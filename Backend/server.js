
const path = require("path");
const express = require("express");
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
const { cropDatasetMetadata } = require("./data/cropDataset");
const {
    LocationSearchError,
    searchLocations
} = require("./services/geocodingService");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 4000;
const frontendDirectory = path.join(__dirname, "..", "Frontend");

// Middleware used by the Phase 1 application foundation.
app.use(express.json());

// Serve frontend assets from the same origin as the API.
// Keeping index disabled preserves the existing GET / welcome route.
app.use(express.static(frontendDirectory, { index: false }));

// Phase 2 service modules live in Backend/services/.

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to AgriVeya Backend!");
});

// Status route
app.get("/api/status", (req, res) => {
    res.json({
        project: "AgriVeya",
        status: "Running",
        message: "Backend is working successfully!"
    });
});

// About route
app.get("/api/about", (req, res) => {
    res.json({
        name: "AgriVeya",
        purpose: "Climate-smart agricultural decision support"
    });
});

// Historical climate observations from NASA POWER for one geographical point.
app.get("/api/climate", async (req, res, next) => {
    try {
        const climateData = await getClimateData(req.query);
        res.json(climateData);
    } catch (error) {
        if (error instanceof ClimateRequestError) {
            return res.status(400).json({ error: error.message });
        }

        if (error instanceof NasaPowerError) {
            return res.status(502).json({ error: error.message });
        }

        next(error);
    }
});

// User-triggered location search. Results are cached and rate-limited to respect
// the public OpenStreetMap Nominatim service policy.
app.get("/api/locations/search", async (req, res, next) => {
    try {
        const locationData = await searchLocations(req.query.q);
        res.json({
            provider: "OpenStreetMap Nominatim",
            attribution: "© OpenStreetMap contributors",
            results: locationData.results,
            cache: locationData.cache
        });
    } catch (error) {
        if (error instanceof LocationSearchError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        next(error);
    }
});

app.post("/api/recommendations", async (req, res, next) => {
    try {
        const farmProfile = validateFarmProfile(req.body);
        const climateData = await getClimateData({
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            start: req.body.start,
            end: req.body.end
        });
        const recommendationResult = generateRecommendations(
            farmProfile,
            climateData.summary,
            climateData.missingData
        );

        res.json({
            location: climateData.location,
            climateSummary: climateData.summary,
            climatePeriod: climateData.dateRange,
            farmProfile: {
                soilType: farmProfile.soilType,
                previousCrop: {
                    id: farmProfile.previousCrop.id,
                    name: farmProfile.previousCrop.name,
                    family: farmProfile.previousCrop.family,
                    season: farmProfile.previousCrop.season
                },
                farmerPriorities: farmProfile.farmerPriorities
            },
            recommendations: recommendationResult.recommendations,
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
        if (error instanceof FarmProfileError || error instanceof ClimateRequestError) {
            return res.status(400).json({ error: error.message });
        }

        if (error instanceof NasaPowerError) {
            return res.status(502).json({ error: error.message });
        }

        next(error);
    }
});

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ error: "An unexpected server error occurred." });
});

// Handle unknown API routes
app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found",
        path: req.originalUrl
    });
});

// Handle all unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.originalUrl
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`FieldShift server running on port ${PORT}`);
});


