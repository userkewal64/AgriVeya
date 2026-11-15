const assert = require("node:assert/strict");
const test = require("node:test");

const {
    FarmProfileError,
    generateRecommendations,
    validateFarmProfile
} = require("../services/recommendationEngine");

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
        previousCrop: "rice",
        farmerPriorities: {
            waterConservation: "high",
            climateResilience: "medium",
            soilHealth: "high"
        },
        ...overrides
    });
}

test("creates three different ordered recommendations for a valid farm profile", () => {
    const result = generateRecommendations(
        buildProfile(),
        itahariClimateSummary,
        completeClimateData
    );

    assert.equal(result.recommendations.length, 3);
    assert.equal(result.recommendations[0].cropSequence[0].crop, "Rice");
    assert.equal(
        new Set(result.recommendations.map((item) => item.cropSequence[1].crop)).size,
        3
    );
    assert.ok(result.recommendations.every((item) => item.suitabilityScore >= 0));
    assert.ok(result.recommendations.every((item) => item.suitabilityScore <= 100));
});

test("changes the soil score when the selected soil type changes", () => {
    const loamResult = generateRecommendations(
        buildProfile({ soilType: "loam" }),
        itahariClimateSummary,
        completeClimateData
    );
    const sandyResult = generateRecommendations(
        buildProfile({ soilType: "sandy" }),
        itahariClimateSummary,
        completeClimateData
    );
    const loamChickpea = loamResult.recommendations.find(
        (item) => item.cropSequence[1].crop === "Chickpea"
    );
    const sandyChickpea = sandyResult.recommendations.find(
        (item) => item.cropSequence[1].crop === "Chickpea"
    );

    assert.equal(loamChickpea.scoreBreakdown.soil, 20);
    assert.equal(sandyChickpea.scoreBreakdown.soil, 5);
});

test("uses the previous crop season to choose a different next-season candidate set", () => {
    const result = generateRecommendations(
        buildProfile({ previousCrop: "wheat" }),
        itahariClimateSummary,
        completeClimateData
    );

    assert.ok(
        result.recommendations.every((item) =>
            ["spring-summer", "monsoon"].includes(item.cropSequence[1].season)
        )
    );
});

test("rejects unsupported crop inputs", () => {
    assert.throws(
        () => buildProfile({ previousCrop: "potato" }),
        FarmProfileError
    );
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
