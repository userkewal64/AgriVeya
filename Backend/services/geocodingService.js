const NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search";
const NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse";
const REQUEST_TIMEOUT_MS = 10000;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const MIN_REQUEST_INTERVAL_MS = 1000;
const MAX_RESULTS = 10;
const NEPAL_VIEWBOX = "80.05,30.45,88.2,26.35";
const SUPPORTED_LANGUAGES = new Set(["en", "ne", "hi"]);
const COUNTRY_ALIASES = {
    np: ["Nepal", "नेपाल"],
    in: ["India", "भारत"],
    bd: ["Bangladesh", "बांग्लादेश"],
    bt: ["Bhutan", "भूटान"],
    cn: ["China", "चीन"],
    fr: ["France", "फ्रांस", "फ्रान्स"],
    jp: ["Japan", "जापान"],
    gb: ["United Kingdom", "UK", "Britain", "ब्रिटेन"],
    us: ["United States", "USA", "America", "अमेरिका", "संयुक्त राज्य"]
};
const searchCache = new Map();
const countryCache = new Map();
let nextRequestAt = 0;

class LocationSearchError extends Error {
    constructor(message, statusCode = 502) {
        super(message);
        this.name = "LocationSearchError";
        this.statusCode = statusCode;
    }
}

function validateQuery(value) {
    const query = String(value || "").trim();

    if (query.length < 2) {
        throw new LocationSearchError("Location search must contain at least two characters.", 400);
    }

    if (query.length > 120) {
        throw new LocationSearchError("Location search must be 120 characters or fewer.", 400);
    }

    return query;
}

function normalizeText(value) {
    return String(value || "")
        .normalize("NFKC")
        .toLocaleLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, " ")
        .trim();
}

function normalizeCoordinates(options) {
    const hasLatitude = options.latitude !== undefined && String(options.latitude).trim() !== "";
    const hasLongitude = options.longitude !== undefined && String(options.longitude).trim() !== "";

    if (!hasLatitude && !hasLongitude) return null;
    if (!hasLatitude || !hasLongitude) {
        throw new LocationSearchError("Location coordinates are invalid.", 400);
    }

    const latitude = Number(options.latitude);
    const longitude = Number(options.longitude);
    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
        !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
        throw new LocationSearchError("Location coordinates are invalid.", 400);
    }

    return { latitude, longitude };
}

function formatLocation(result) {
    const address = result.address || {};
    const displayName = result.display_name || result.name || "";
    const context = [
        address.village || address.town || address.city || address.municipality || address.county,
        address.state || address.province,
        address.country
    ].filter((item, index, values) => item && values.indexOf(item) === index);

    return {
        id: String(result.place_id),
        name: displayName.split(",")[0].trim() || result.name || displayName,
        displayName,
        context: context.join(", "),
        region: address.state || address.province || "",
        district: address.county || address.state_district || "",
        country: address.country || "",
        countryCode: String(address.country_code || "").toLowerCase(),
        latitude: Number(result.lat),
        longitude: Number(result.lon),
        type: result.type || result.class,
        importance: Number(result.importance) || 0
    };
}

function locationDistanceKm(first, second) {
    const radians = (degrees) => degrees * Math.PI / 180;
    const latitudeDelta = radians(second.latitude - first.latitude);
    const longitudeDelta = radians(second.longitude - first.longitude);
    const a = Math.min(1, Math.sin(latitudeDelta / 2) ** 2 +
        Math.cos(radians(first.latitude)) * Math.cos(radians(second.latitude)) *
        Math.sin(longitudeDelta / 2) ** 2);
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function querySimilarity(query, location) {
    const queryWords = normalizeText(query).split(" ").filter(Boolean);
    if (!queryWords.length) return 0;
    const resultText = normalizeText(`${location.name} ${location.displayName} ${location.context}`);
    return queryWords.filter((word) => resultText.includes(word)).length / queryWords.length;
}

function queryNamesCountry(query, location) {
    const normalizedQuery = ` ${normalizeText(query)} `;
    const country = normalizeText(location.country);
    if (country.length > 1 && normalizedQuery.includes(` ${country} `)) return true;
    const aliases = COUNTRY_ALIASES[location.countryCode] || [];
    return aliases.some((alias) => normalizedQuery.includes(` ${normalizeText(alias)} `));
}

function deduplicateLocations(locations) {
    const seenLabels = new Set();
    const seenCoordinates = new Set();
    return locations.filter((location) => {
        const labelKey = [
            normalizeText(location.displayName || location.name),
            location.countryCode
        ].join("|");
        const coordinateKey = [
            location.countryCode,
            location.latitude.toFixed(4),
            location.longitude.toFixed(4)
        ].join("|");
        if (seenLabels.has(labelKey) || seenCoordinates.has(coordinateKey)) return false;
        seenLabels.add(labelKey);
        seenCoordinates.add(coordinateKey);
        return true;
    });
}

function rankLocations(query, locations, options = {}) {
    const coordinates = options.coordinates || null;
    const userCountryCode = options.userCountryCode || null;
    const ranked = deduplicateLocations(locations).map((location, index) => {
        const explicitCountryMatch = queryNamesCountry(query, location);
        return {
            location,
            index,
            explicitCountryMatch,
            sameCountry: Boolean(userCountryCode && location.countryCode === userCountryCode),
            distance: coordinates ? locationDistanceKm(coordinates, location) : Infinity,
            similarity: querySimilarity(query, location)
        };
    });
    const queryHasCountry = ranked.some((item) => item.explicitCountryMatch);
    const queryHasSimilarity = ranked.some((item) => item.similarity > 0);

    ranked.sort((first, second) => {
        if (queryHasCountry && first.explicitCountryMatch !== second.explicitCountryMatch) {
            return Number(second.explicitCountryMatch) - Number(first.explicitCountryMatch);
        }
        if (queryHasSimilarity && first.similarity !== second.similarity) {
            return second.similarity - first.similarity;
        }

        if (coordinates) {
            const distanceBand = (distance) => Math.floor(distance / 150);
            const bandDifference = distanceBand(first.distance) - distanceBand(second.distance);
            if (bandDifference) return bandDifference;
        }

        if (first.sameCountry !== second.sameCountry) {
            return Number(second.sameCountry) - Number(first.sameCountry);
        }

        if (coordinates && first.distance !== second.distance) return first.distance - second.distance;
        return second.similarity - first.similarity ||
            second.location.importance - first.location.importance ||
            first.index - second.index;
    });

    return ranked.map((item) => item.location);
}

async function waitForNominatimSlot() {
    const waitMs = Math.max(0, nextRequestAt - Date.now());
    nextRequestAt = Math.max(Date.now(), nextRequestAt) + MIN_REQUEST_INTERVAL_MS;

    if (waitMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
}

async function fetchNominatim(url) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "AgriVeya/1.0 (educational climate-smart agriculture project)"
            },
            signal: controller.signal
        });

        if (!response.ok) {
            throw new LocationSearchError(`Location service responded with HTTP ${response.status}.`);
        }
        return await response.json();
    } catch (error) {
        if (error.name === "AbortError") {
            throw new LocationSearchError("Location search timed out. Please try again.");
        }
        if (error instanceof LocationSearchError) throw error;
        throw new LocationSearchError(`Unable to reach the location search service: ${error.message}`);
    } finally {
        clearTimeout(timeout);
    }
}

async function getLocationDetails(coordinates, language = "en") {
    const displayLanguage = SUPPORTED_LANGUAGES.has(language) ? language : "en";
    const cacheKey = `${coordinates.latitude.toFixed(2)},${coordinates.longitude.toFixed(2)}|${displayLanguage}`;
    const cached = countryCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) return cached.details;

    try {
        await waitForNominatimSlot();
        const parameters = new URLSearchParams({
            lat: String(coordinates.latitude),
            lon: String(coordinates.longitude),
            format: "jsonv2",
            addressdetails: "1",
            "accept-language": displayLanguage
        });
        const result = await fetchNominatim(`${NOMINATIM_REVERSE_URL}?${parameters}`);
        const address = result.address || {};
        const locality = address.city || address.town || address.village || address.municipality || "";
        const district = address.county || address.state_district || "";
        const region = address.state || address.province || "";
        const country = address.country || "";
        const displayParts = [locality, district, region, country]
            .filter((part, index, parts) => part && parts.indexOf(part) === index);
        const details = {
            id: result.place_id === undefined ? "" : String(result.place_id),
            name: locality || district || region || country,
            displayName: displayParts.join(", "),
            context: displayParts.slice(locality ? 1 : 0).join(", "),
            countryCode: String(address.country_code || "").toLowerCase() || null,
            country,
            region,
            district,
            locality
        };
        countryCache.set(cacheKey, { details, expiresAt: Date.now() + CACHE_TTL_MS });
        return details;
    } catch (error) {
        console.warn("Could not resolve user country for location ranking:", error.message);
        const details = {
            id: "",
            name: "",
            displayName: "",
            context: "",
            countryCode: null,
            country: "",
            region: "",
            district: "",
            locality: ""
        };
        countryCache.set(cacheKey, { details, expiresAt: Date.now() + 5 * 60 * 1000 });
        return details;
    }
}

function createViewbox(coordinates) {
    if (!coordinates) return NEPAL_VIEWBOX;
    const halfWidth = 12;
    const halfHeight = 8;
    const left = Math.max(-180, coordinates.longitude - halfWidth);
    const right = Math.min(180, coordinates.longitude + halfWidth);
    const top = Math.min(90, coordinates.latitude + halfHeight);
    const bottom = Math.max(-90, coordinates.latitude - halfHeight);
    return `${left},${top},${right},${bottom}`;
}

async function searchLocations(queryValue, options = {}) {
    const query = validateQuery(queryValue);
    const coordinates = normalizeCoordinates(options);
    const language = SUPPORTED_LANGUAGES.has(options.language) ? options.language : "en";
    const userCountryCode = coordinates ? (await getLocationDetails(coordinates, language)).countryCode : null;
    const cacheKey = [
        normalizeText(query),
        language,
        coordinates ? coordinates.latitude.toFixed(2) : "no-lat",
        coordinates ? coordinates.longitude.toFixed(2) : "no-lon",
        userCountryCode || "no-country"
    ].join("|");
    const cachedEntry = searchCache.get(cacheKey);

    if (cachedEntry && cachedEntry.expiresAt > Date.now()) {
        return { results: cachedEntry.results, cache: { hit: true } };
    }

    await waitForNominatimSlot();
    const parameters = new URLSearchParams({
        q: query,
        format: "jsonv2",
        addressdetails: "1",
        limit: String(MAX_RESULTS),
        viewbox: createViewbox(coordinates),
        bounded: "0",
        "accept-language": language
    });

    const rawResults = await fetchNominatim(`${NOMINATIM_SEARCH_URL}?${parameters}`);
    const results = rankLocations(query, rawResults
        .map(formatLocation)
        .filter((result) => Number.isFinite(result.latitude) && Number.isFinite(result.longitude)), {
        coordinates,
        userCountryCode
    });

    searchCache.set(cacheKey, {
        results,
        expiresAt: Date.now() + CACHE_TTL_MS
    });

    return { results, cache: { hit: false } };
}

module.exports = {
    LocationSearchError,
    formatLocation,
    getLocationDetails,
    rankLocations,
    searchLocations
};
