const assert = require("node:assert/strict");
const test = require("node:test");

const {
    FarmProfileError,
    generateRecommendations,
    validateFarmProfile
} = require("../services/recommendationEngine");
const { supportedSoilTypes } = require("../data/cropDataset");

const itahariClimateSummary = {
    averageTemperatureC: 24.17,
    totalPrecipitationMm: 1482.19,
    averageRelativeHumidityPercent: 68.13,
    averageSolarRadiationMjM2Day: 15.5
};

const completeClimateData = {
    daysWithAnyMissingValue: 0,
    totalDaysRequested: 365
};

function buildProfile(overrides = {}) {
    return validateFarmProfile({
        soilType: "loam",
        farmerPriorities: {
            waterConservation: "high",
            climateResilience: "medium",
            soilHealth: "high"
        },
        ...overrides
    });
}

test("creates three chronological annual plans with three seasonal crops", () => {
    const result = generateRecommendations(
        buildProfile(),
        itahariClimateSummary,
        completeClimateData
    );

    assert.equal(result.rotationMode, "annual-rotation");
    assert.equal(result.recommendations.length, 3);
    for (const plan of result.recommendations) {
        assert.deepEqual(plan.seasonalPlan.phases.map((phase) => phase.season), [
            "summer",
            "monsoon",
            "winter"
        ]);
        assert.equal(plan.seasonalPlan.coverage, "complete");
        assert.ok(plan.seasonalPlan.phases.every((phase) =>
            Array.isArray(phase.plantingMonths) &&
            Array.isArray(phase.harvestMonths) &&
            Array.isArray(phase.durationDays)
        ));
        assert.ok(plan.seasonalPlan.phases[0].transitionAfter);
        assert.ok(plan.seasonalPlan.phases[1].transitionAfter);
        assert.ok(plan.seasonalPlan.cycleTransition);
        assert.equal(new Set(plan.seasonalPlan.phases.map((phase) => phase.cropId)).size, 3);
    }
    assert.equal(
        new Set(result.recommendations.map((item) =>
            item.seasonalPlan.phases.map((phase) => phase.cropId).join("|")
        )).size,
        3
    );
    assert.ok(result.recommendations.every((item) => item.suitabilityScore >= 0));
    assert.ok(result.recommendations.every((item) => item.suitabilityScore <= 100));
});

test("changes the soil score when the selected soil type changes", () => {
    const loamResult = generateRecommendations(
        buildProfile({ soilType: "loam" }),
        itahariClimateSummary,
        completeClimateData,
        { regionalCropIds: ["mung-bean", "rice", "lentil"], regionalLevel: "country" }
    );
    const sandyResult = generateRecommendations(
        buildProfile({ soilType: "sandy" }),
        itahariClimateSummary,
        completeClimateData,
        { regionalCropIds: ["mung-bean", "rice", "lentil"], regionalLevel: "country" }
    );
    const loamPlan = loamResult.recommendations.find((item) =>
        item.seasonalPlan.phases.some((phase) => phase.cropId === "lentil")
    );
    const sandyPlan = sandyResult.recommendations.find((item) =>
        item.seasonalPlan.phases.some((phase) => phase.cropId === "lentil")
    );

    const loamLentil = loamPlan.seasonalPlan.phases.find((phase) => phase.cropId === "lentil");
    const sandyLentil = sandyPlan.seasonalPlan.phases.find((phase) => phase.cropId === "lentil");
    assert.equal(loamLentil.scoreBreakdown.soil, 20);
    assert.equal(sandyLentil.scoreBreakdown.soil, 5);
});

test("accepts every USDA soil texture and the explicit unknown value", () => {
    assert.deepEqual(supportedSoilTypes, [
        "sand",
        "loamy-sand",
        "sandy-loam",
        "loam",
        "silt-loam",
        "silt",
        "sandy-clay-loam",
        "clay-loam",
        "silty-clay-loam",
        "sandy-clay",
        "silty-clay",
        "clay",
        "unknown"
    ]);

    for (const soilType of supportedSoilTypes) {
        const result = generateRecommendations(
            buildProfile({ soilType }),
            itahariClimateSummary,
            completeClimateData
        );
        assert.equal(result.recommendations.length, 3, `${soilType} produces recommendations`);
    }

    const unknownSoil = generateRecommendations(
        buildProfile({ soilType: "unknown" }),
        itahariClimateSummary,
        completeClimateData
    );
    assert.ok(unknownSoil.recommendations.every((item) => item.scoreBreakdown.soil === 10));
    assert.ok(unknownSoil.riskFlags.some((flag) => flag.includes("Soil texture is unknown")));
});

test("no preferences produces a complete annual plan", () => {
    const result = generateRecommendations(
        buildProfile(),
        itahariClimateSummary,
        completeClimateData,
        {
            regionalCropIds: ["rice", "maize", "wheat", "lentil", "mustard", "chickpea", "millet", "mung-bean"],
            regionalLevel: "country"
        }
    );

    assert.equal(result.recommendations.length, 3);
    assert.equal(result.rotationMode, "annual-rotation");
    assert.ok(result.recommendations.every((item) => item.cropSequence.length === 3));
    assert.ok(result.recommendations.every((item) =>
        item.seasonalPlan.phases.map((phase) => phase.season).join(",") === "summer,monsoon,winter"
    ));
    assert.ok(result.recommendations.every((item) => item.seasonalPlan.phases[0].crop));
    assert.ok(result.riskFlags.some((flag) => flag.includes("Water access and irrigation")));
    assert.ok(result.riskFlags.some((flag) => flag.includes("Planting and harvest windows are indicative")));
});

test("uses each soil texture when ranking annual plans without preferences", () => {
    for (const soilType of supportedSoilTypes) {
        const result = generateRecommendations(
            buildProfile({ soilType }),
            itahariClimateSummary,
            completeClimateData,
            {
                regionalCropIds: ["wheat", "lentil", "mustard"],
                fallbackCropIds: ["wheat", "lentil", "mustard", "mung-bean"],
                dailyObservations: []
            }
        );
        assert.ok(result.recommendations.length > 0, `${soilType} produces a rotation`);
    }
});

test("uses a country fallback for a missing season and reports unavailable coverage", () => {
    const result = generateRecommendations(
        buildProfile(),
        itahariClimateSummary,
        completeClimateData,
        {
            regionalCropIds: ["wheat", "lentil"],
            fallbackCropIds: ["wheat", "lentil", "chickpea", "mung-bean"],
            regionalLevel: "country",
            dailyObservations: [
                { date: "2025-01-15", temperatureC: 12, precipitationMm: 0.1, relativeHumidityPercent: 60, solarRadiationMjM2Day: 15 },
                { date: "2025-04-15", temperatureC: 24, precipitationMm: 1.2, relativeHumidityPercent: 55, solarRadiationMjM2Day: 20 }
            ]
        }
    );

    assert.equal(result.recommendations.length, 1);
    assert.ok(result.recommendations.every((item) =>
        item.seasonalPlan.phases.map((phase) => phase.season).join(",") === "summer,winter"
    ));
    assert.ok(result.recommendations.every((item) =>
        item.seasonalPlan.phases[0].cropId === "mung-bean"
    ));
    assert.ok(result.recommendations.every((item) =>
        item.seasonalPlan.phases[1].cropId === "wheat"
    ));
    assert.ok(result.riskFlags.some((flag) => flag.includes("A broader country-level crop list was used")));
    assert.ok(result.recommendations.some((item) =>
        item.seasonalPlan.phases[0].climate.averageTemperatureC === 24 &&
        item.seasonalPlan.phases[1].climate.averageTemperatureC === 12
    ));
});

test("does not fill an uncovered subregion season from a broader crop list", () => {
    const result = generateRecommendations(
        buildProfile(),
        itahariClimateSummary,
        completeClimateData,
        {
            regionalCropIds: ["maize", "millet", "wheat"],
            fallbackCropIds: ["maize", "millet", "wheat", "mung-bean"],
            regionalLevel: "subregion"
        }
    );

    assert.ok(result.recommendations.length > 0);
    assert.ok(result.recommendations.every((item) =>
        item.seasonalPlan.omittedSeasons.includes("summer") &&
        item.seasonalPlan.phases.every((phase) => phase.cropId !== "mung-bean")
    ));
    assert.ok(result.riskFlags.some((flag) => flag.includes("complete three-season plan was unavailable")));
});

test("omits a season when its historical temperatures fall outside available crop profiles", () => {
    const result = generateRecommendations(
        buildProfile(),
        itahariClimateSummary,
        completeClimateData,
        {
            regionalCropIds: ["rice", "maize", "wheat", "lentil", "mustard", "chickpea", "millet", "mung-bean"],
            regionalLevel: "country",
            dailyObservations: [
                { date: "2025-03-15", temperatureC: 40 },
                { date: "2025-07-15", temperatureC: 26 },
                { date: "2025-12-15", temperatureC: 18 }
            ]
        }
    );

    assert.ok(result.recommendations.length > 0);
    assert.ok(result.recommendations.every((item) =>
        item.seasonalPlan.omittedSeasons.includes("summer") &&
        !item.seasonalPlan.phases.some((phase) => phase.season === "summer")
    ));
    assert.ok(result.riskFlags.some((flag) => flag.includes("Historical seasonal temperatures did not match")));
});

test("preferred crops guide an otherwise suitable annual plan", () => {
    const profile = buildProfile({ preferredCropIds: ["rice", "lentil"] });
    const result = generateRecommendations(
        profile,
        itahariClimateSummary,
        completeClimateData,
        { regionalCropIds: ["rice", "lentil", "mung-bean"] }
    );

    assert.deepEqual(profile.preferredCropIds, ["rice", "lentil"]);
    assert.equal(result.recommendations.length, 1);
    assert.deepEqual(result.recommendations[0].seasonalPlan.phases.map((phase) => phase.cropId), [
        "mung-bean",
        "rice",
        "lentil"
    ]);
    assert.deepEqual(result.recommendations[0].preferredCropIds, ["rice", "lentil"]);
    assert.ok(result.preferenceAssessment.every((item) => item.status === "included"));
});

test("an out-of-region preference does not force the annual plan", () => {
    const result = generateRecommendations(
        buildProfile({ preferredCropIds: ["rice"] }),
        itahariClimateSummary,
        completeClimateData,
        { regionalCropIds: ["mung-bean", "maize", "lentil"] }
    );

    assert.ok(result.recommendations.length > 0);
    assert.ok(result.recommendations.every((plan) =>
        !plan.seasonalPlan.phases.some((phase) => phase.cropId === "rice")
    ));
    assert.deepEqual(result.preferenceAssessment, [{
        cropId: "rice",
        status: "not-regional",
        alternatives: ["maize"]
    }]);
});

test("a preferred crop outside the seasonal temperature screen is explained", () => {
    const result = generateRecommendations(
        buildProfile({ preferredCropIds: ["rice"] }),
        itahariClimateSummary,
        completeClimateData,
        {
            regionalCropIds: ["rice", "mung-bean", "lentil"],
            dailyObservations: [
                { date: "2025-07-15", temperatureC: 40 },
                { date: "2025-03-15", temperatureC: 25 },
                { date: "2025-12-15", temperatureC: 18 }
            ]
        }
    );

    assert.deepEqual(result.preferenceAssessment, [{
        cropId: "rice",
        status: "climate-screened",
        alternatives: []
    }]);
    assert.ok(result.recommendations.every((plan) =>
        !plan.seasonalPlan.phases.some((phase) => phase.cropId === "rice")
    ));
});

test("preferred crop selections are optional and validated", () => {
    const noPreferences = buildProfile();
    assert.deepEqual(noPreferences.preferredCropIds, []);
    assert.equal(Object.hasOwn(noPreferences, "previousCrop"), false);
    assert.throws(() => buildProfile({ preferredCropIds: ["potato"] }), FarmProfileError);
    assert.throws(() => buildProfile({ preferredCropIds: "rice" }), FarmProfileError);
    assert.throws(() => buildProfile({ preferredCropIds: ["rice", "rice"] }), FarmProfileError);
});

test("rejects unsupported crop inputs", () => {
    assert.throws(() => buildProfile({ soilType: "unknown-soil" }), FarmProfileError);
});

test("returns explicit uncertainty flags when climate summary values are missing", () => {
    const result = generateRecommendations(
        buildProfile(),
        {
            averageTemperatureC: null,
            totalPrecipitationMm: null,
            averageRelativeHumidityPercent: null,
            averageSolarRadiationMjM2Day: null
        },
        { daysWithAnyMissingValue: 365, totalDaysRequested: 365 }
    );

    assert.equal(result.recommendations.length, 3);
    assert.ok(
        result.riskFlags.some((flag) => flag.includes("Average relative humidity is unavailable"))
    );
    assert.ok(
        result.recommendations[0].risks.some((risk) => risk.includes("unavailable"))
    );
});
