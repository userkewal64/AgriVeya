const cropDatasetMetadata = {
    status: "Illustrative decision-support profiles, not local agronomic prescriptions.",
    assumptions: [
        "Temperature and annual-rainfall bands are broad screening heuristics, not crop-stage or cultivar-specific thresholds.",
        "Soil types describe texture-level compatibility only; pH, drainage, fertility, salinity, irrigation, pests, markets, and farm management are not modelled.",
        "Local extension guidance and field observations should override these profiles."
    ],
    references: [
        {
            title: "FAO ECOCROP crop ecological requirements database",
            url: "https://www.fao.org/geospatial/data-and-tools/data-portals/ecocrop/en",
            note: "Used as a reference family for broad climate and soil descriptors."
        },
        {
            title: "IRRI Rice Knowledge Bank: water management",
            url: "https://www.knowledgebank.irri.org/ericeproduction/PDF_%26_Docs/WaterMgmt.pdf",
            note: "Supports treating rice as comparatively water-demanding."
        }
    ]
};

const crops = [
    {
        id: "rice",
        name: "Rice",
        family: "Poaceae",
        season: "monsoon",
        suitableSoils: ["clay", "clay-loam", "loam", "silt"],
        temperatureBandC: { min: 20, max: 35 },
        annualRainfallBandMm: { min: 1000, max: 2200 },
        waterNeed: "high",
        droughtTolerance: "low",
        heatTolerance: "medium",
        rotationBenefits: ["Fits a monsoon cereal phase", "Can follow a winter pulse or oilseed"],
        limitations: ["Water-demanding without dependable rainfall or irrigation", "Repeated cereal rotations can reduce diversity"]
    },
    {
        id: "maize",
        name: "Maize",
        family: "Poaceae",
        season: "monsoon",
        suitableSoils: ["loam", "sandy-loam", "silt", "clay-loam"],
        temperatureBandC: { min: 18, max: 32 },
        annualRainfallBandMm: { min: 500, max: 1200 },
        waterNeed: "medium",
        droughtTolerance: "medium",
        heatTolerance: "medium",
        rotationBenefits: ["Fits a monsoon cereal phase", "Can follow winter pulses or oilseeds"],
        limitations: ["Sensitive to prolonged water stress around flowering", "Cereal-after-cereal sequences reduce family diversity"]
    },
    {
        id: "wheat",
        name: "Wheat",
        family: "Poaceae",
        season: "winter",
        suitableSoils: ["loam", "silt", "clay-loam"],
        temperatureBandC: { min: 12, max: 25 },
        annualRainfallBandMm: { min: 300, max: 900 },
        waterNeed: "medium",
        droughtTolerance: "medium",
        heatTolerance: "low",
        rotationBenefits: ["Provides a winter cereal option after monsoon crops", "Diversifies the seasonal calendar"],
        limitations: ["Late-season heat can be a risk", "Following another cereal reduces crop-family diversity"]
    },
    {
        id: "lentil",
        name: "Lentil",
        family: "Fabaceae",
        season: "winter",
        suitableSoils: ["loam", "sandy-loam", "silt", "clay-loam"],
        temperatureBandC: { min: 15, max: 25 },
        annualRainfallBandMm: { min: 300, max: 800 },
        waterNeed: "low",
        droughtTolerance: "medium",
        heatTolerance: "low",
        rotationBenefits: ["Legume phase can improve rotation diversity", "Can support nitrogen cycling when well managed"],
        limitations: ["Poor drainage and excessive moisture can be problematic", "Requires local variety and disease advice"]
    },
    {
        id: "mustard",
        name: "Mustard",
        family: "Brassicaceae",
        season: "winter",
        suitableSoils: ["loam", "sandy-loam", "silt", "clay-loam"],
        temperatureBandC: { min: 10, max: 25 },
        annualRainfallBandMm: { min: 300, max: 900 },
        waterNeed: "low",
        droughtTolerance: "medium",
        heatTolerance: "medium",
        rotationBenefits: ["Adds an oilseed family to cereal rotations", "Provides a winter non-cereal option"],
        limitations: ["Needs local pest and disease management", "Flowering can be sensitive to unsuitable heat conditions"]
    },
    {
        id: "chickpea",
        name: "Chickpea",
        family: "Fabaceae",
        season: "winter",
        suitableSoils: ["loam", "sandy-loam", "silt", "clay-loam"],
        temperatureBandC: { min: 15, max: 30 },
        annualRainfallBandMm: { min: 400, max: 800 },
        waterNeed: "low",
        droughtTolerance: "high",
        heatTolerance: "medium",
        rotationBenefits: ["Legume phase improves crop-family diversity", "Can support nitrogen cycling when well managed"],
        limitations: ["Waterlogging can be damaging", "Requires local disease and market assessment"]
    },
    {
        id: "millet",
        name: "Millet",
        family: "Poaceae",
        season: "monsoon",
        suitableSoils: ["sandy", "sandy-loam", "loam", "clay-loam"],
        temperatureBandC: { min: 20, max: 35 },
        annualRainfallBandMm: { min: 300, max: 900 },
        waterNeed: "low",
        droughtTolerance: "high",
        heatTolerance: "high",
        rotationBenefits: ["Offers a comparatively drought-tolerant monsoon cereal", "Can broaden cereal choice"],
        limitations: ["Market access and preferred varieties are location-specific", "Still needs establishment moisture"]
    },
    {
        id: "mung-bean",
        name: "Mung bean",
        family: "Fabaceae",
        season: "spring-summer",
        suitableSoils: ["sandy-loam", "loam", "silt", "clay-loam"],
        temperatureBandC: { min: 20, max: 35 },
        annualRainfallBandMm: { min: 400, max: 1000 },
        waterNeed: "low",
        droughtTolerance: "medium",
        heatTolerance: "high",
        rotationBenefits: ["Short pulse phase can improve crop-family diversity", "Can support nitrogen cycling when well managed"],
        limitations: ["Waterlogging and disease pressure need local management", "Planting window must fit the local crop calendar"]
    }
];

const soilTypeAliases = {
    clay: "clay",
    "clay-loam": "clay-loam",
    clayloam: "clay-loam",
    loam: "loam",
    sandy: "sandy",
    "sandy-loam": "sandy-loam",
    sandyloam: "sandy-loam",
    silt: "silt"
};

function normaliseText(value) {
    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");
}

function normaliseSoilType(value) {
    return soilTypeAliases[normaliseText(value)] || null;
}

function getCropById(value) {
    const id = normaliseText(value);
    return crops.find((crop) => crop.id === id) || null;
}

module.exports = {
    crops,
    cropDatasetMetadata,
    getCropById,
    normaliseSoilType,
    supportedSoilTypes: Object.values(soilTypeAliases).filter(
        (value, index, values) => values.indexOf(value) === index
    )
};
