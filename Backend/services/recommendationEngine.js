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

const PLAN_SEASONS = {
    summer: { months: new Set([2, 3, 4, 5]), label: "Summer" },
    monsoon: { months: new Set([5, 6, 7, 8, 9, 10, 11]), label: "Monsoon" },
    winter: { months: new Set([10, 11, 12, 1, 2, 3]), label: "Winter" }
};

const PLAN_SEASON_ORDER = ["summer", "monsoon", "winter"];

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

    const preferredCropIds = input.preferredCropIds === undefined ? [] : input.preferredCropIds;
    if (!Array.isArray(preferredCropIds) ||
        preferredCropIds.some((id) => typeof id !== "string" || !getCropById(id)) ||
        new Set(preferredCropIds).size !== preferredCropIds.length) {
        throw new FarmProfileError(
            `preferredCropIds must be an array of unique crop IDs: ${crops.map((crop) => crop.id).join(", ")}.`
        );
    }

    return {
        soilType,
        preferredCropIds: [...preferredCropIds],
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

function averageFiniteValues(values) {
    const availableValues = values.filter(Number.isFinite);
    if (!availableValues.length) return null;
    return Number((availableValues.reduce((sum, value) => sum + value, 0) / availableValues.length).toFixed(2));
}

function getSeasonClimate(season, climateSummary, dailyObservations) {
    const monthSet = PLAN_SEASONS[season].months;
    const observations = Array.isArray(dailyObservations)
        ? dailyObservations.filter((item) => monthSet.has(Number(String(item.date || "").slice(5, 7))))
        : [];
    const temperature = averageFiniteValues(observations.map((item) => item.temperatureC));
    const humidity = averageFiniteValues(observations.map((item) => item.relativeHumidityPercent));
    const solar = averageFiniteValues(observations.map((item) => item.solarRadiationMjM2Day));

    return {
        summary: {
            ...climateSummary,
            averageTemperatureC: temperature === null ? climateSummary.averageTemperatureC : temperature,
            averageRelativeHumidityPercent: humidity === null
                ? climateSummary.averageRelativeHumidityPercent
                : humidity,
            averageSolarRadiationMjM2Day: solar === null
                ? climateSummary.averageSolarRadiationMjM2Day
                : solar
        },
        observed: observations.some((item) => Number.isFinite(item.temperatureC)),
        context: {
            averageTemperatureC: temperature,
            totalPrecipitationMm: observations.some((item) => Number.isFinite(item.precipitationMm))
                ? Number(observations.reduce(
                    (sum, item) => sum + (Number.isFinite(item.precipitationMm) ? item.precipitationMm : 0),
                    0
                ).toFixed(2))
                : null,
            observationDays: observations.length
        }
    };
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

function evaluateRotation(candidate, precedingCrop) {
    if (!precedingCrop) {
        return {
            score: 10,
            breakdown: { familyDiversity: 10, legumeAfterCereal: 0 },
            reasons: [],
            risks: []
        };
    }

    const sameFamily = candidate.family === precedingCrop.family;
    const candidateIsLegume = candidate.family === "Fabaceae";
    const previousIsCereal = precedingCrop.family === "Poaceae";
    const diversityScore = sameFamily ? 3 : 15;
    const legumeAfterCerealBonus = candidateIsLegume && previousIsCereal ? 5 : 0;
    const reasons = [];
    const risks = [];

    if (sameFamily) {
        risks.push(`Both crops are in the ${candidate.family} family, so family diversity is limited.`);
    } else {
        reasons.push(`Changes crop family from ${precedingCrop.family} to ${candidate.family}.`);
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
    if (soilType === "unknown") {
        return {
            score: 10,
            reasons: [],
            risks: ["Soil texture is unknown; no soil-specific compatibility was assumed."]
        };
    }

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

function buildCandidateRecommendation(candidate, farmProfile, climateSummary, missingData, precedingCrop) {
    const climate = evaluateClimate(candidate, climateSummary, missingData);
    const soil = evaluateSoil(candidate, farmProfile.soilType);
    const rotation = evaluateRotation(candidate, precedingCrop);
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

function getPlanSeason(crop) {
    return crop.season === "spring-summer" ? "summer" : crop.season;
}

function isWithinTemperatureBand(crop, climate) {
    const temperature = climate.summary.averageTemperatureC;
    return !Number.isFinite(temperature) ||
        (temperature >= crop.temperatureBandC.min && temperature <= crop.temperatureBandC.max);
}

function getCropTransition(fromPhase, toPhase, isCycleTransition = false) {
    const harvestMonth = fromPhase.crop.calendar.harvestMonths[1] +
        (fromPhase.season === "winter" ? 12 : 0);
    const plantingMonth = toPhase.crop.calendar.plantingMonths[0] +
        (isCycleTransition ? 12 : 0);
    const difference = plantingMonth - harvestMonth;

    return {
        from: fromPhase.season,
        to: toPhase.season,
        type: difference <= 0 ? "overlap" : "gap",
        months: difference <= 0 ? Math.max(1, Math.abs(difference)) : Math.max(0, difference - 1)
    };
}

function buildAnnualRotationPlans(farmProfile, climateSummary, missingData, context) {
    const regionalIds = Array.isArray(context.regionalCropIds) && context.regionalCropIds.length
        ? new Set(context.regionalCropIds)
        : null;
    const fallbackIds = new Set(Array.isArray(context.fallbackCropIds) ? context.fallbackCropIds : []);
    const regionalCoverage = Boolean(regionalIds);
    const broaderFallbackUsed = new Set();
    const climateBySeason = Object.fromEntries(PLAN_SEASON_ORDER.map((season) => [
        season,
        getSeasonClimate(season, climateSummary, context.dailyObservations)
    ]));
    const climateExcludedSeasons = new Set();

    const candidatesBySeason = Object.fromEntries(PLAN_SEASON_ORDER.map((season) => {
        const cropSeason = season === "summer" ? "spring-summer" : season;
        const baseCandidates = crops.filter((crop) =>
            crop.season === cropSeason &&
            (!regionalIds || regionalIds.has(crop.id))
        );
        const suitableCandidates = baseCandidates.filter((crop) =>
            isWithinTemperatureBand(crop, climateBySeason[season])
        );

        if (baseCandidates.length && !suitableCandidates.length) {
            climateExcludedSeasons.add(season);
        }

        if (suitableCandidates.length) return [season, suitableCandidates];

        if (!regionalIds || context.regionalLevel === "subregion" || !fallbackIds.size) {
            return [season, []];
        }

        const fallbackCandidates = crops.filter((crop) =>
            crop.season === cropSeason &&
            fallbackIds.has(crop.id) &&
            isWithinTemperatureBand(crop, climateBySeason[season])
        );
        if (fallbackCandidates.length) broaderFallbackUsed.add(season);
        return [season, fallbackCandidates];
    }));

    const availableSeasons = PLAN_SEASON_ORDER.filter((season) => candidatesBySeason[season].length);
    const omittedSeasons = PLAN_SEASON_ORDER.filter((season) => !candidatesBySeason[season].length);
    const allSeasonClimateObserved = PLAN_SEASON_ORDER.every((season) => climateBySeason[season].observed);
    const preferredCropIds = new Set(farmProfile.preferredCropIds);
    const generalRisks = [
        "Water access and irrigation were not provided; historical rainfall cannot confirm available water.",
        "Planting and harvest windows are indicative South Asian calendar ranges; confirm local dates and crop duration with agricultural extension advice.",
        ...(!regionalCoverage
            ? ["Regional crop coverage is unavailable; these climate-screened profiles are not locally confirmed choices."]
            : []),
        ...(broaderFallbackUsed.size
            ? ["A broader country-level crop list was used for a season missing regional options."]
            : []),
        ...(!allSeasonClimateObserved
            ? ["Season-specific climate observations were incomplete; annual climate values were used where needed."]
            : []),
        ...(omittedSeasons.length
            ? ["A complete three-season plan was unavailable; the omitted seasons are shown in the plan."]
            : []),
        ...(climateExcludedSeasons.size
            ? ["Historical seasonal temperatures did not match a crop's broad screening band for at least one season."]
            : [])
    ];

    const plans = [];
    function addPlans(index, selected) {
        if (index < availableSeasons.length) {
            const season = availableSeasons[index];
            for (const crop of candidatesBySeason[season]) {
                addPlans(index + 1, [...selected, { season, crop }]);
            }
            return;
        }

        const phaseRecommendations = [];
        let precedingCrop = null;
        for (const selectedPhase of selected) {
            const recommendation = buildCandidateRecommendation(
                selectedPhase.crop,
                farmProfile,
                climateBySeason[selectedPhase.season].summary,
                missingData,
                precedingCrop
            );
            phaseRecommendations.push({ ...selectedPhase, recommendation });
            precedingCrop = selectedPhase.crop;
        }

        const transitions = [];
        for (let phaseIndex = 0; phaseIndex < phaseRecommendations.length - 1; phaseIndex += 1) {
            transitions.push(getCropTransition(
                phaseRecommendations[phaseIndex],
                phaseRecommendations[phaseIndex + 1]
            ));
        }
        const completePlan = availableSeasons.length === PLAN_SEASON_ORDER.length;
        const cycleTransition = completePlan
            ? getCropTransition(phaseRecommendations[phaseRecommendations.length - 1], phaseRecommendations[0], true)
            : null;

        if ([...transitions, ...(cycleTransition ? [cycleTransition] : [])].some((transition) =>
            transition.type === "overlap" && transition.months > 1
        )) {
            return;
        }

        const scoreParts = ["climate", "soil", "rotation", "farmerPriorities", "rotationBenefits"];
        const scoreBreakdown = Object.fromEntries(scoreParts.map((part) => [
            part,
            Number((phaseRecommendations.reduce(
                (sum, phase) => sum + phase.recommendation.scoreBreakdown[part],
                0
            ) / phaseRecommendations.length).toFixed(2))
        ]));
        const phases = phaseRecommendations.map(({ season, crop, recommendation }, phaseIndex) => ({
            season,
            cropId: crop.id,
            crop: crop.name,
            plantingMonths: [...crop.calendar.plantingMonths],
            harvestMonths: [...crop.calendar.harvestMonths],
            durationDays: [...crop.calendar.durationDays],
            waterNeed: crop.waterNeed,
            soilFit: farmProfile.soilType === "unknown" ? null : crop.suitableSoils.includes(farmProfile.soilType),
            reasons: recommendation.reasons,
            risks: recommendation.risks,
            suitabilityScore: recommendation.suitabilityScore,
            scoreBreakdown: recommendation.scoreBreakdown,
            climate: climateBySeason[season].context,
            transitionAfter: transitions[phaseIndex] || null
        }));
        const cerealToLegume = phaseRecommendations.some((phase, phaseIndex) => {
            return phaseIndex > 0 &&
                phaseRecommendations[phaseIndex - 1].crop.family === "Poaceae" &&
                phase.crop.family === "Fabaceae";
        });
        const changedFamilies = phaseRecommendations.some((phase, phaseIndex) =>
            phaseIndex > 0 && phaseRecommendations[phaseIndex - 1].crop.family !== phase.crop.family
        );
        const rotationBenefit = cerealToLegume
            ? "A cereal-to-legume change can support crop-family diversity when locally suitable."
            : changedFamilies
                ? "Crop families change across seasons, supporting rotation diversity."
                : "Crop-family diversity is limited in this sequence.";
        const reasons = phaseRecommendations.flatMap((phase) => phase.recommendation.reasons);
        const risks = [
            ...phaseRecommendations.flatMap((phase) => phase.recommendation.risks),
            ...generalRisks,
        ].filter((risk, riskIndex, values) =>
            values.indexOf(risk) === riskIndex
        );

        plans.push({
            cropSequence: phases.map((phase) => ({
                crop: phase.crop,
                season: phase.season,
                role: `${phase.season} crop`
            })),
            preferredCropIds: phases
                .filter((phase) => preferredCropIds.has(phase.cropId))
                .map((phase) => phase.cropId),
            seasonalPlan: {
                phases,
                coverage: completePlan ? "complete" : "partial",
                omittedSeasons,
                cycleTransition,
                rotationBenefit
            },
            suitabilityScore: Math.round(phaseRecommendations.reduce(
                (sum, phase) => sum + phase.recommendation.suitabilityScore,
                0
            ) / phaseRecommendations.length),
            scoreBreakdown,
            benefits: [rotationBenefit],
            reasons: [...new Set(reasons)],
            risks
        });
    }

    if (availableSeasons.length) addPlans(0, []);
    plans.sort((first, second) =>
        second.suitabilityScore - first.suitabilityScore ||
        second.preferredCropIds.length - first.preferredCropIds.length
    );
    const recommendations = plans.slice(0, 3).map((plan, index) => ({
        ...plan,
        rank: index + 1,
        explanation: plan.seasonalPlan.coverage === "complete"
            ? index === 0
                ? "Highest combined fit across summer, monsoon, and winter among the screened plans."
                : "An alternative three-season plan using the same screening rules."
            : "Best available seasonal alternative; the omitted season lacked a suitable regional crop profile."
    }));
    const includedPreferredIds = new Set(recommendations.flatMap((plan) => plan.preferredCropIds));
    const preferenceAssessment = farmProfile.preferredCropIds.map((id) => {
        const crop = getCropById(id);
        const season = getPlanSeason(crop);
        const seasonCandidates = candidatesBySeason[season];
        const regionallyAvailable = !regionalIds || regionalIds.has(id) ||
            (context.regionalLevel !== "subregion" && fallbackIds.has(id));
        const seasonCandidatesIncludeCrop = seasonCandidates.some((candidate) => candidate.id === id);
        let status = "not-ranked";

        if (includedPreferredIds.has(id)) {
            status = "included";
        } else if (!regionallyAvailable) {
            status = "not-regional";
        } else if (!seasonCandidatesIncludeCrop &&
            isWithinTemperatureBand(crop, climateBySeason[season]) === false) {
            status = "climate-screened";
        } else if (farmProfile.soilType !== "unknown" && !crop.suitableSoils.includes(farmProfile.soilType)) {
            status = "soil-mismatch";
        }

        const alternatives = status === "included" ? [] : [...new Set(recommendations.flatMap((plan) =>
            plan.seasonalPlan.phases
                .filter((phase) => phase.season === season && phase.cropId !== id)
                .map((phase) => phase.cropId)
        ))];
        return { cropId: id, status, alternatives };
    });
    const riskFlags = buildTopLevelRiskFlags(recommendations, climateSummary);
    if (!recommendations.length) {
        riskFlags.push("No crop sequence was available from the regional profiles and climate screening.");
    }

    return {
        rotationMode: "annual-rotation",
        recommendations,
        preferenceAssessment,
        reasons: [
            "Plans follow summer, monsoon, then winter when suitable; crop-family transitions are evaluated between planned phases.",
            "Scores combine historical climate screening, soil texture, farmer priorities, and crop-family transitions. Preferred crops only break ties and never override suitability screening.",
            "Crop calendars and climate screening are illustrative decision support, not validated planting prescriptions or yield predictions."
        ],
        riskFlags,
        methodology: {
            type: "Deterministic, rule-based annual seasonal screening model",
            maximumScore: 100,
            scoreWeights: {
                climate: 40,
                soil: 20,
                rotation: 20,
                farmerPriorities: 15,
                rotationBenefits: 5,
                note: "The phase scores are averaged; the result is a relative screening score, not a yield prediction."
            },
            climateScoring: "Season-specific temperature averages are used when available; annual precipitation remains a broad water-context measure.",
            assumptions: cropDatasetMetadata.assumptions
        }
    };
}

function generateRecommendations(farmProfile, climateSummary, missingData, context = {}) {
    return buildAnnualRotationPlans(farmProfile, climateSummary, missingData, context);
}

module.exports = {
    FarmProfileError,
    generateRecommendations,
    validateFarmProfile
};
