
const path = require("path");
const express = require("express");
const cors = require("cors");

const {
    ClimateRequestError,
    NasaPowerError,
    getClimateData
} = require("./services/nasaPowerService");

const {
    FarmProfileError,
    generateRecommendations,
    validateFarmProfile
} = require("./services/recommendationEngine");

const {
    cropDatasetMetadata,
    getCropById
} = require("./data/cropDataset");

const {
    resolveRegionalCropOptions
} = require("./data/regionalCropDataset");

const {
    LocationSearchError,
    getLocationDetails,
    searchLocations
} = require("./services/geocodingService");

// Load environment variables
require("dotenv").config({
    path: path.join(__dirname, ".env")
});

const app = express();
const PORT = process.env.PORT || 3000;

const frontendDirectory = path.join(__dirname, "..", "Frontend");

const SUPPORTED_LOCATION_LANGUAGES = new Set(["en", "ne", "hi"]);

// ==========================================
// CORS CONFIGURATION
// ==========================================

const allowedOrigins = [
    process.env.FRONTEND_URL,
    "https://agriveya.pages.dev",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:3000",
    "http://localhost:4000",
    "http://127.0.0.1:4000"
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    }
}));

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json());

// Serve frontend assets from the same origin as the API.
// Keeping index disabled preserves the existing GET / welcome route.
app.use(express.static(frontendDirectory, {
    index: false
}));

// ==========================================
// LOCATION VALIDATION
// ==========================================

function readCoordinates(query) {
    const latitude = Number(query.latitude);
    const longitude = Number(query.longitude);

    if (
        query.latitude === undefined ||
        String(query.latitude).trim() === "" ||
        query.longitude === undefined ||
        String(query.longitude).trim() === "" ||
        !Number.isFinite(latitude) ||
        latitude < -90 ||
        latitude > 90 ||
        !Number.isFinite(longitude) ||
        longitude < -180 ||
        longitude > 180
    ) {
        return null;
    }

    return {
        latitude,
        longitude
    };
}

function validateSelectedLocation(value, coordinates) {
    if (value === undefined || value === null) {
        return null;
    }

    if (typeof value !== "object" || Array.isArray(value)) {
        throw new FarmProfileError("location must be an object.");
    }

    const latitude = Number(value.latitude);
    const longitude = Number(value.longitude);

    if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude) ||
        Math.abs(latitude - coordinates.latitude) > 0.000001 ||
        Math.abs(longitude - coordinates.longitude) > 0.000001
    ) {
        throw new FarmProfileError(
            "location coordinates must match the recommendation coordinates."
        );
    }

    const countryCode = String(value.countryCode || "")
        .trim()
        .toLowerCase();

    if (countryCode && !/^[a-z]{2}$/.test(countryCode)) {
        throw new FarmProfileError(
            "location.countryCode must be a two-letter ISO code."
        );
    }

    const text = (field) =>
        String(value[field] || "").trim().slice(0, 200);

    return {
        id: text("id"),
        name: text("name"),
        displayName: text("displayName"),
        context: text("context"),
        country: text("country"),
        countryCode: countryCode || null,
        region: text("region"),
        district: text("district"),
        locality: text("locality"),
        latitude: coordinates.latitude,
        longitude: coordinates.longitude
    };
}

// ==========================================
// HOME ROUTE
// ==========================================

app.get("/", (req, res) => {
    res.send("Welcome to AgriVeya Backend!");
});

// ==========================================
// STATUS ROUTE
// ==========================================

app.get("/api/status", (req, res) => {
    res.json({
        project: "AgriVeya",
        status: "Running",
        message: "Backend is working successfully!"
    });
});

// ==========================================
// ABOUT ROUTE
// ==========================================

app.get("/api/about", (req, res) => {
    res.json({
        name: "AgriVeya",
        purpose: "Climate-smart agricultural decision support"
    });
});

// ==========================================
// NASA POWER CLIMATE API
// ==========================================

app.get("/api/climate", async (req, res, next) => {
    try {
        const climateData = await getClimateData(req.query);

        res.json(climateData);

    } catch (error) {
        if (error instanceof ClimateRequestError) {
            return res.status(400).json({
                error: error.message
            });
        }

        if (error instanceof NasaPowerError) {
            return res.status(502).json({
                error: error.message
            });
        }

        next(error);
    }
});

// ==========================================
// LOCATION SEARCH API
// ==========================================

app.get("/api/locations/search", async (req, res, next) => {
    try {
        const locationData = await searchLocations(req.query.q, {
            language: req.query.language,
            latitude: req.query.latitude,
            longitude: req.query.longitude
        });

        res.json({
            provider: "OpenStreetMap Nominatim",
            attribution: "© OpenStreetMap contributors",
            results: locationData.results,
            cache: locationData.cache
        });

    } catch (error) {
        if (error instanceof LocationSearchError) {
            return res.status(error.statusCode).json({
                error: error.message
            });
        }

        next(error);
    }
});

// ==========================================
// REVERSE GEOCODING API
// ==========================================

app.get("/api/locations/reverse", async (req, res, next) => {
    const coordinates = readCoordinates(req.query);

    if (!coordinates) {
        return res.status(400).json({
            error: "Valid latitude and longitude are required."
        });
    }

    const language = SUPPORTED_LOCATION_LANGUAGES.has(
        req.query.language
    )
        ? req.query.language
        : "en";

    try {
        const location = await getLocationDetails(
            coordinates,
            language
        );

        res.json({
            provider: "OpenStreetMap Nominatim",
            attribution: "© OpenStreetMap contributors",
            location: {
                ...location,
                ...coordinates
            }
        });
    } catch (error) {
        if (error instanceof LocationSearchError) {
            return res.status(error.statusCode).json({
                error: error.message
            });
        }

        next(error);
    }
});

// ==========================================
// REGIONAL CROP API
// ==========================================

app.get("/api/crops/regional", async (req, res, next) => {
    try {
        const coordinates = readCoordinates(req.query);

        if (!coordinates) {
            return res.status(400).json({
                error: "Valid latitude and longitude are required."
            });
        }

        const requestedCountryCode = String(
            req.query.countryCode || ""
        ).toLowerCase();

        if (
            requestedCountryCode &&
            !/^[a-z]{2}$/.test(requestedCountryCode)
        ) {
            return res.status(400).json({
                error: "countryCode must be a two-letter ISO code."
            });
        }

        const language = SUPPORTED_LOCATION_LANGUAGES.has(
            req.query.language
        )
            ? req.query.language
            : "en";

        const locationDetails = requestedCountryCode
            ? {
                countryCode: requestedCountryCode,
                region: String(req.query.region || "").slice(0, 120),
                district: String(req.query.district || "").slice(0, 120),
                country: String(req.query.country || "").slice(0, 120),
                locality: String(req.query.locality || "").slice(0, 120),
                name: String(req.query.name || "").slice(0, 120),
                displayName: String(req.query.displayName || "").slice(0, 200)
            }
            : await getLocationDetails(coordinates, language);

        const regionalOptions =
            resolveRegionalCropOptions(locationDetails);

        res.json({
            ...regionalOptions,
            location: {
                ...locationDetails,
                ...coordinates
            },
            fallbackCropIds: regionalOptions.fallbackCropIds,
            crops: regionalOptions.cropIds.map((id) => {
                const crop = getCropById(id);

                return {
                    id: crop.id,
                    name: crop.name
                };
            })
        });

    } catch (error) {
        if (error instanceof LocationSearchError) {
            return res.status(error.statusCode).json({
                error: error.message
            });
        }

        next(error);
    }
});

// ==========================================
// FARM RECOMMENDATION API
// ==========================================

app.post("/api/recommendations", async (req, res, next) => {
    try {
        const farmProfile = validateFarmProfile(req.body);

        const coordinates = readCoordinates(req.body);

        if (!coordinates) {
            throw new ClimateRequestError(
                "Valid latitude and longitude are required."
            );
        }

        const selectedLocation = validateSelectedLocation(
            req.body.location,
            coordinates
        );

        const climateRequest = getClimateData({
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            start: req.body.start,
            end: req.body.end
        });

        const reverseRequest =
            selectedLocation && selectedLocation.countryCode
                ? Promise.resolve(null)
                : getLocationDetails(coordinates, "en");

        const [climateData, reverseLocation] =
            await Promise.all([
                climateRequest,
                reverseRequest
            ]);

        const locationDetails = {
            ...(reverseLocation || {}),
            ...(selectedLocation || {}),

            id:
                selectedLocation && selectedLocation.id ||
                reverseLocation && reverseLocation.id ||
                "",

            name:
                selectedLocation && selectedLocation.name ||
                reverseLocation && reverseLocation.name ||
                "",

            context:
                selectedLocation && selectedLocation.context ||
                reverseLocation && reverseLocation.context ||
                "",

            country:
                selectedLocation && selectedLocation.country ||
                reverseLocation && reverseLocation.country ||
                "",

            countryCode:
                selectedLocation && selectedLocation.countryCode ||
                reverseLocation && reverseLocation.countryCode ||
                null,

            region:
                selectedLocation && selectedLocation.region ||
                reverseLocation && reverseLocation.region ||
                "",

            district:
                selectedLocation && selectedLocation.district ||
                reverseLocation && reverseLocation.district ||
                "",

            locality:
                selectedLocation && selectedLocation.locality ||
                reverseLocation && reverseLocation.locality ||
                "",

            displayName:
                selectedLocation && selectedLocation.displayName ||
                reverseLocation && reverseLocation.displayName ||
                "",

            latitude: coordinates.latitude,
            longitude: coordinates.longitude
        };

        const regionalOptions =
            resolveRegionalCropOptions(locationDetails);

        const recommendationResult = generateRecommendations(
            farmProfile,
            climateData.summary,
            climateData.missingData,
            {
                dailyObservations: climateData.dailyObservations,
                regionalCropIds: regionalOptions.cropIds,
                fallbackCropIds: regionalOptions.fallbackCropIds,
                regionalLevel: regionalOptions.level,
                regionalNote: regionalOptions.note
            }
        );

        res.json({
            location: locationDetails,

            climateSummary: climateData.summary,

            climatePeriod: climateData.dateRange,

            farmProfile: {
                soilType: farmProfile.soilType,
                preferredCrops: farmProfile.preferredCropIds.map((id) => {
                    const crop = getCropById(id);
                    return {
                        id: crop.id,
                        name: crop.name
                    };
                }),
                farmerPriorities: farmProfile.farmerPriorities
            },

            recommendations: recommendationResult.recommendations,

            preferenceAssessment: recommendationResult.preferenceAssessment,

            rotationMode:
                recommendationResult.rotationMode || "next-season",

            reasons: recommendationResult.reasons,

            riskFlags: recommendationResult.riskFlags,

            methodology: recommendationResult.methodology,

            dataSources: {
                nasaPower: climateData.dataSource,
                cropProfiles: cropDatasetMetadata
            },

            missingClimateData: climateData.missingData,

            climateCache: climateData.cache
        });

    } catch (error) {
        if (
            error instanceof FarmProfileError ||
            error instanceof ClimateRequestError
        ) {
            return res.status(400).json({
                error: error.message
            });
        }

        if (error instanceof NasaPowerError) {
            return res.status(502).json({
                error: error.message
            });
        }

        if (error instanceof LocationSearchError) {
            return res.status(error.statusCode).json({
                error: error.message
            });
        }

        next(error);
    }
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((error, req, res, next) => {
    console.error(error);

    res.status(500).json({
        error: "An unexpected server error occurred."
    });
});

// ==========================================
// UNKNOWN API ROUTES
// ==========================================

app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found",
        path: req.originalUrl
    });
});

// ==========================================
// UNKNOWN ROUTES
// ==========================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.originalUrl
    });
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
    console.log(`AgriVeya server running on port ${PORT}`);
});
