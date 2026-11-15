const {
    crops,
    cropDatasetMetadata,
    getCropById,
    normaliseSoilType,
    supportedSoilTypes
} = require("../data/cropDataset");

const PRIORITY_LEVELS = {
    low: 0.3,
    medium: 0.6,
    high: 1
};

const NEXT_SEASONS = {
    monsoon: ["winter"],
    winter: ["spring-summer", "monsoon"],
    "spring-summer": ["monsoon"]
};

class FarmProfileError extends Error {
    constructor(message) {
        super(message);
        this.name = "FarmProfileError";
    }
}

function validateFarmerPriorities(value) {
    const requiredPriorities = [
        "waterConservation",
        "climateResilience",
        "soilHealth"
    ];

    if (!value || typeof value !== "object" || Array.isArray(value)) {
        throw new FarmProfileError("farmerPriorities must be an object.");
    }

    const priorities = {};

    for (const priority of requiredPriorities) {
        const level = String(value[priority] || "").toLowerCase();

        if (!Object.hasOwn(PRIORITY_LEVELS, level)) {
            throw new FarmProfileError(
                `farmerPriorities.${priority} must be low, medium, or high.`
            );
        }

        priorities[priority] = level;
    }

    return priorities;
}

function validateFarmProfile(input) {
    if (!input || typeof input !== "object") {
        throw new FarmProfileError("A JSON farm profile is required.");
    }

    const soilType = normaliseSoilType(input.soilType);

    if (!soilType) {
        throw new FarmProfileError(
            `soilType must be one of: ${supportedSoilTypes.join(", ")}.`
        );
    }

    const previousCrop = getCropById(input.previousCrop);

    if (!previousCrop) {
        throw new FarmProfileError(
            `previousCrop must be one of: ${crops.map((crop) => crop.id).join(", ")}.`
        );
    }

    return {
        soilType,
        previousCrop,
        farmerPriorities: validateFarmerPriorities(input.farmerPriorities)
    };
}

function getBandScore(value, band, maximumScore) {
    if (value === null || value === undefined || !Number.isFinite(value)) {
        return 0;
    }

    if (value >= band.min && value <= band.max) {
        return maximumScore;
    }

    const distance = value < band.min ? band.min - value : value - band.max;
    const bandWidth = Math.max(band.max - band.min, 1);
    return Number(Math.max(0, maximumScore * (1 - distance / bandWidth)).toFixed(2));
}

function getToleranceScore(tolerance) {
    return { low: 1, medium: 3, high: 5 }[tolerance];
}

function getWaterScore(waterNeed) {
    return { low: 5, medium: 3, high: 1 }[waterNeed];
}

function evaluateClimate(candidate, climateSummary, missingData) {
    const temperatureScore = getBandScore(
        climateSummary.averageTemperatureC,
        candidate.temperatureBandC,
        20
    );
    const rainfallScore = getBandScore(
        climateSummary.totalPrecipitationMm,
        candidate.annualRainfallBandMm,
        15
    );
    const expectedSummaryFields = [
        climateSummary.averageTemperatureC,
        climateSummary.totalPrecipitationMm,
        climateSummary.averageRelativeHumidityPercent,
        climateSummary.averageSolarRadiationMjM2Day
    ];
    const coverageScore = Number(
        ((expectedSummaryFields.filter((value) => value !== null).length / 4) * 5).toFixed(2)
    );
    const reasons = [];
    const risks = [];

    if (temperatureScore === 20) {
        reasons.push("Historical average temperature is within this profile's illustrative suitability band.");
    } else if (climateSummary.averageTemperatureC === null) {
        risks.push("Average temperature is unavailable, reducing climate confidence.");
    } else {
        risks.push("Historical average temperature is outside this profile's illustrative suitability band.");
    }

    if (rainfallScore === 15) {
        reasons.push("Historical annual precipitation is within this profile's illustrative water band.");
    } else if (climateSummary.totalPrecipitationMm === null) {
        risks.push("Total precipitation is unavailable, reducing water-availability confidence.");
    } else {
        risks.push("Historical precipitation differs from this profile's illustrative water band; irrigation or drainage may matter.");
    }

    if (missingData.daysWithAnyMissingValue > 0) {
        risks.push("Some historical environmental observations are missing; scores use available values only.");
    }

    return {
        score: Number((temperatureScore + rainfallScore + coverageScore).toFixed(2)),
        breakdown: { temperature: temperatureScore, rainfall: rainfallScore, dataCoverage: coverageScore },
        reasons,
        risks
    };
}

function evaluateRotation(candidate, previousCrop) {
    const sameFamily = candidate.family === previousCrop.family;
    const candidateIsLegume = candidate.family === "Fabaceae";
    const previousIsCereal = previousCrop.family === "Poaceae";
    const diversityScore = sameFamily ? 3 : 15;
    const legumeAfterCerealBonus = candidateIsLegume && previousIsCereal ? 5 : 0;
    const reasons = [];
    const risks = [];

    if (sameFamily) {
        risks.push(`Both crops are in the ${candidate.family} family, so family diversity is limited.`);
    } else {
        reasons.push(`Changes crop family from ${previousCrop.family} to ${candidate.family}.`);
    }

    if (legumeAfterCerealBonus > 0) {
        reasons.push("Adds a legume after a cereal, supporting rotation diversity and nitrogen cycling when well managed.");
    }

    return {
        score: diversityScore + legumeAfterCerealBonus,
        breakdown: { familyDiversity: diversityScore, legumeAfterCereal: legumeAfterCerealBonus },
        reasons,
        risks
    };
}

function evaluateSoil(candidate, soilType) {
    const compatible = candidate.suitableSoils.includes(soilType);

    return {
        score: compatible ? 20 : 5,
        reasons: compatible
            ? [`${candidate.name} is marked compatible with the selected ${soilType} soil texture.`]
            : [`${candidate.name} is not a direct match for the selected ${soilType} soil texture.`],
        risks: compatible
            ? []
            : ["Soil texture is a simplified input; verify drainage, pH, fertility, and salinity locally."]
    };
}

function evaluatePriorities(candidate, priorities) {
    const water = getWaterScore(candidate.waterNeed) * PRIORITY_LEVELS[priorities.waterConservation];
    const resilience =
        ((getToleranceScore(candidate.droughtTolerance) + getToleranceScore(candidate.heatTolerance)) / 2) *
        PRIORITY_LEVELS[priorities.climateResilience];
    const soilHealthBase = candidate.family === "Fabaceae" ? 5 : 2;
    const soilHealth = soilHealthBase * PRIORITY_LEVELS[priorities.soilHealth];
    const reasons = [];

    if (candidate.waterNeed === "low" && priorities.waterConservation !== "low") {
        reasons.push("Matches the selected emphasis on water conservation with a lower-water profile.");
    }

    if (
        (candidate.droughtTolerance === "high" || candidate.heatTolerance === "high") &&
        priorities.climateResilience !== "low"
    ) {
        reasons.push("Matches the selected emphasis on climate resilience through its illustrative tolerance profile.");
    }

    if (candidate.family === "Fabaceae" && priorities.soilHealth !== "low") {
        reasons.push("Matches the selected emphasis on soil health through a legume rotation phase.");
    }

    return {
        score: Number((water + resilience + soilHealth).toFixed(2)),
        breakdown: {
            waterConservation: Number(water.toFixed(2)),
            climateResilience: Number(resilience.toFixed(2)),
            soilHealth: Number(soilHealth.toFixed(2))
        },
        reasons
    };
}

function evaluateRotationBenefits(candidate) {
    const score = candidate.family === "Fabaceae" ? 5 : 3;

    return {
        score,
        reasons:
            candidate.family === "Fabaceae"
                ? ["Receives the full rotation-benefit score for adding a legume phase."]
                : ["Receives a base rotation-benefit score for adding a defined seasonal crop phase."]
    };
}

function getSeasonTransition(previousCrop, candidate) {
    return `${previousCrop.season} ${previousCrop.name} → ${candidate.season} ${candidate.name}`;
}

function buildCandidateRecommendation(candidate, farmProfile, climateSummary, missingData) {
    const climate = evaluateClimate(candidate, climateSummary, missingData);
    const soil = evaluateSoil(candidate, farmProfile.soilType);
    const rotation = evaluateRotation(candidate, farmProfile.previousCrop);
    const priorities = evaluatePriorities(candidate, farmProfile.farmerPriorities);
    const rotationBenefits = evaluateRotationBenefits(candidate);
    const totalScore = Math.max(
        0,
        Math.min(
            100,
            Math.round(
                climate.score + soil.score + rotation.score + priorities.score + rotationBenefits.score
            )
        )
    );

    return {
        crop: candidate,
        cropSequence: [
            { crop: farmProfile.previousCrop.name, season: farmProfile.previousCrop.season, role: "previous crop" },
            { crop: candidate.name, season: candidate.season, role: "recommended next crop" }
        ],
        seasonalTransition: getSeasonTransition(farmProfile.previousCrop, candidate),
        suitabilityScore: totalScore,
        scoreBreakdown: {
            climate: climate.score,
            soil: soil.score,
            rotation: rotation.score,
            farmerPriorities: priorities.score,
            rotationBenefits: rotationBenefits.score
        },
        benefits: [...candidate.rotationBenefits],
        reasons: [
            ...climate.reasons,
            ...soil.reasons,
            ...rotation.reasons,
            ...priorities.reasons,
            ...rotationBenefits.reasons
        ],
        risks: [...candidate.limitations, ...climate.risks, ...soil.risks, ...rotation.risks]
    };
}

function buildTopLevelRiskFlags(recommendations, climateSummary) {
    const riskFlags = [
        "Historical NASA POWER observations support climate context only; they are not a weather forecast or yield prediction.",
        "Soil texture is farmer-reported and is not a direct soil measurement."
    ];

    if (climateSummary.averageRelativeHumidityPercent === null) {
        riskFlags.push("Average relative humidity is unavailable.");
    }

    if (climateSummary.averageSolarRadiationMjM2Day === null) {
        riskFlags.push("Average solar radiation is unavailable.");
    }

    for (const recommendation of recommendations) {
        for (const risk of recommendation.risks) {
            if (!riskFlags.includes(risk)) {
                riskFlags.push(risk);
            }
        }
    }

    return riskFlags;
}

function generateRecommendations(farmProfile, climateSummary, missingData) {
    const nextSeasons = NEXT_SEASONS[farmProfile.previousCrop.season];
    const candidates = crops.filter(
        (crop) => crop.id !== farmProfile.previousCrop.id && nextSeasons.includes(crop.season)
    );

    const rankedCandidates = candidates
        .map((candidate) => buildCandidateRecommendation(candidate, farmProfile, climateSummary, missingData))
        .sort((first, second) => second.suitabilityScore - first.suitabilityScore)
        .slice(0, 3)
        .map((recommendation, index, recommendations) => {
            const higherRecommendation = recommendations[0];
            const leadReason = recommendation.reasons[0] || "its combined profile score";

            return {
                rank: index + 1,
                cropSequence: recommendation.cropSequence,
                seasonalTransition: recommendation.seasonalTransition,
                suitabilityScore: recommendation.suitabilityScore,
                scoreBreakdown: recommendation.scoreBreakdown,
                benefits: recommendation.benefits,
                risks: recommendation.risks,
                reasons: recommendation.reasons,
                explanation:
                    index === 0
                        ? `Ranked first because ${leadReason}`
                        : `Ranked below ${higherRecommendation.cropSequence[1].crop} because its combined score is lower; ${leadReason}`
            };
        });

    if (rankedCandidates.length < 3) {
        throw new Error("The crop dataset does not provide three feasible seasonal candidates.");
    }

    return {
        recommendations: rankedCandidates,
        reasons: [
            "Scores combine historical temperature and precipitation suitability, soil-texture compatibility, crop-family diversity, and farmer-selected priorities.",
            "Relative humidity and solar radiation are retained as historical context and data-coverage checks, but are not given crop-specific numeric thresholds in this illustrative model.",
            "Sequences are ordered from the reported previous crop to a feasible next seasonal crop; validate local planting windows with extension guidance."
        ],
        riskFlags: buildTopLevelRiskFlags(rankedCandidates, climateSummary),
        methodology: {
            type: "Deterministic, rule-based screening model",
            maximumScore: 100,
            scoreWeights: {
                climate: 40,
                soil: 20,
                rotation: 20,
                farmerPriorities: 15,
                rotationBenefits: 5,
                note: "The total may be below 100 when a farmer sets medium or low priority levels."
            },
            climateScoring: "Temperature contributes up to 20 points, precipitation up to 15, and environmental-data coverage up to 5.",
            assumptions: cropDatasetMetadata.assumptions
        }
    };
}

module.exports = {
    FarmProfileError,
    generateRecommendations,
    validateFarmProfile
};
