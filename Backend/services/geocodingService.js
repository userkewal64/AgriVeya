const NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search";
const REQUEST_TIMEOUT_MS = 10000;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const MIN_REQUEST_INTERVAL_MS = 1000;
const MAX_RESULTS = 5;
const SUPPORTED_LANGUAGES = new Set(["en", "ne", "hi"]);
const searchCache = new Map();
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

function normalizeLanguage(value) {
    const language = String(value || "en").trim().toLowerCase();
    return SUPPORTED_LANGUAGES.has(language) ? language : "en";
}

function formatLocation(result) {
    const address = result.address || {};
    const context = [
        address.village || address.town || address.city || address.municipality || address.county,
        address.state || address.province,
        address.country
    ].filter((item, index, values) => item && values.indexOf(item) === index);

    return {
        id: String(result.place_id),
        name: result.name || result.display_name,
        displayName: result.display_name,
        context: context.join(", "),
        latitude: Number(result.lat),
        longitude: Number(result.lon),
        type: result.type || result.class
    };
}

async function waitForNominatimSlot() {
    const waitMs = Math.max(0, nextRequestAt - Date.now());
    nextRequestAt = Math.max(Date.now(), nextRequestAt) + MIN_REQUEST_INTERVAL_MS;

    if (waitMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
}

async function searchLocations(queryValue, languageValue) {
    const query = validateQuery(queryValue);
    const language = normalizeLanguage(languageValue);
    const cacheKey = `${language}\n${query.toLowerCase()}`;
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
        "accept-language": language
    });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(`${NOMINATIM_SEARCH_URL}?${parameters}`, {
            headers: {
                "User-Agent": "AgriVeya/1.0 (educational climate-smart agriculture project)",
                "Accept-Language": language
            },
            signal: controller.signal
        });

        if (!response.ok) {
            throw new LocationSearchError(
                `Location service responded with HTTP ${response.status}.`
            );
        }

        const rawResults = await response.json();
        const results = rawResults
            .map(formatLocation)
            .filter((result) => Number.isFinite(result.latitude) && Number.isFinite(result.longitude));

        searchCache.set(cacheKey, {
            results,
            expiresAt: Date.now() + CACHE_TTL_MS
        });

        return { results, cache: { hit: false } };
    } catch (error) {
        if (error.name === "AbortError") {
            throw new LocationSearchError("Location search timed out. Please try again.");
        }

        if (error instanceof LocationSearchError) {
            throw error;
        }

        throw new LocationSearchError(`Unable to reach the location search service: ${error.message}`);
    } finally {
        clearTimeout(timeout);
    }
}

function clearLocationSearchState() {
    searchCache.clear();
    nextRequestAt = 0;
}

module.exports = {
    LocationSearchError,
    clearLocationSearchState,
    searchLocations
};
