const { getCropById } = require("./cropDataset");

const SOURCES = {
    faostat: {
        name: "FAOSTAT Crops and livestock products",
        url: "https://www.fao.org/faostat/en/#data/QCL"
    },
    nepal: {
        name: "Nepal Ministry of Agriculture and Livestock Development",
        url: "https://moald.gov.np/"
    },
    india: {
        name: "India Ministry of Agriculture and Farmers Welfare",
        url: "https://agriwelfare.gov.in/"
    },
    bangladesh: {
        name: "Bangladesh Bureau of Statistics",
        url: "https://bbs.gov.bd/"
    }
};

const countryProfiles = {
    np: {
        country: "Nepal",
        source: SOURCES.nepal,
        cropIds: ["rice", "maize", "wheat", "millet", "lentil", "mustard", "mung-bean"],
        regions: [
            {
                id: "terai",
                label: "Terai",
                match: ["madhesh", "मधेश", "sunsari", "सुनसरी", "morang", "मोरङ", "jhapa", "झापा", "saptari", "सप्तरी", "siraha", "सिरहा", "dhanusha", "धनुषा", "mahottari", "महोत्तरी", "sarlahi", "सर्लाही", "rautahat", "रौतहट", "bara", "बारा", "parsa", "पर्सा", "rupandehi", "रुपन्देही", "kapilvastu", "कपिलवस्तु", "nawalparasi", "नवलपरासी", "banke", "बाँके", "bardiya", "बर्दिया", "kailali", "कैलाली", "kanchanpur", "कञ्चनपुर"],
                cropIds: ["rice", "maize", "wheat", "lentil", "mustard", "chickpea", "mung-bean"]
            },
            {
                id: "hills",
                label: "Hill region",
                match: ["bagmati", "बागमती", "gandaki", "गण्डकी", "kathmandu", "काठमाण्डौ", "काठमाडौँ", "काठमाडौं", "kavrepalanchok", "काभ्रेपलाञ्चोक", "kaski", "कास्की", "tanahun", "तनहुँ", "palpa", "पाल्पा", "gorkha", "गोरखा", "lamjung", "लमजुङ", "syangja", "स्याङ्जा"],
                cropIds: ["maize", "rice", "millet", "wheat", "lentil", "mustard"]
            },
            {
                id: "mountains",
                label: "Mountain region",
                match: ["mustang", "मुस्ताङ", "manang", "मनाङ", "dolpa", "डोल्पा", "humla", "हुम्ला", "mugu", "मुगु", "jumla", "जुम्ला", "solukhumbu", "सोलुखुम्बु", "kalikot", "कालिकोट", "darchula", "दार्चुला", "bajhang", "बझाङ"],
                cropIds: ["maize", "millet", "wheat"]
            }
        ]
    },
    in: {
        country: "India",
        source: SOURCES.india,
        cropIds: ["rice", "wheat", "maize", "lentil", "mustard", "chickpea", "mung-bean", "millet"],
        regions: [
            {
                id: "north-india",
                label: "Northern India",
                match: ["punjab", "पंजाब", "haryana", "हरियाणा", "uttar pradesh", "उत्तर प्रदेश", "uttarakhand", "उत्तराखंड", "delhi", "दिल्ली"],
                cropIds: ["rice", "wheat", "maize", "mustard", "lentil", "chickpea", "mung-bean"]
            },
            {
                id: "east-india",
                label: "Eastern India",
                match: ["bihar", "बिहार", "jharkhand", "झारखंड", "west bengal", "पश्चिम बंगाल", "odisha", "ओडिशा", "assam", "असम"],
                cropIds: ["rice", "maize", "wheat", "lentil", "mustard", "mung-bean"]
            },
            {
                id: "west-india",
                label: "Western India",
                match: ["rajasthan", "राजस्थान", "gujarat", "गुजरात", "maharashtra", "महाराष्ट्र", "goa", "गोवा"],
                cropIds: ["wheat", "maize", "millet", "chickpea", "mustard", "mung-bean"]
            },
            {
                id: "central-india",
                label: "Central India",
                match: ["madhya pradesh", "मध्य प्रदेश", "chhattisgarh", "छत्तीसगढ़"],
                cropIds: ["rice", "wheat", "maize", "lentil", "chickpea", "mustard"]
            },
            {
                id: "south-india",
                label: "Southern India",
                match: ["andhra pradesh", "आंध्र प्रदेश", "telangana", "तेलंगाना", "tamil nadu", "तमिलनाडु", "karnataka", "कर्नाटक", "kerala", "केरल"],
                cropIds: ["rice", "maize", "millet", "chickpea", "mung-bean"]
            }
        ]
    },
    bd: {
        country: "Bangladesh",
        source: SOURCES.bangladesh,
        cropIds: ["rice", "maize", "wheat", "lentil", "mustard", "mung-bean"],
        regions: [
            {
                id: "northwest-bangladesh",
                label: "Northwestern Bangladesh",
                match: ["rajshahi", "রাজশাহী", "rangpur", "রংপুর"],
                cropIds: ["rice", "wheat", "maize", "lentil", "mustard"]
            },
            {
                id: "southern-bangladesh",
                label: "Southern Bangladesh",
                match: ["khulna", "খুলনা", "barisal", "বরিশাল", "barishal", "chittagong", "চট্টগ্রাম", "chattogram"],
                cropIds: ["rice", "maize", "lentil", "mustard", "mung-bean"]
            },
            {
                id: "northeast-bangladesh",
                label: "Northeastern Bangladesh",
                match: ["sylhet", "সিলেট", "mymensingh", "ময়মনসিংহ"],
                cropIds: ["rice", "maize", "mustard", "mung-bean"]
            }
        ]
    },
    pk: { country: "Pakistan", source: SOURCES.faostat, cropIds: ["wheat", "rice", "maize", "chickpea", "mustard", "millet"] },
    bt: { country: "Bhutan", source: SOURCES.faostat, cropIds: ["rice", "maize", "wheat", "millet"] },
    lk: { country: "Sri Lanka", source: SOURCES.faostat, cropIds: ["rice", "maize", "millet", "mung-bean"] },
    cn: { country: "China", source: SOURCES.faostat, cropIds: ["rice", "wheat", "maize", "millet", "mung-bean"] },
    jp: { country: "Japan", source: SOURCES.faostat, cropIds: ["rice", "wheat", "maize"] },
    us: { country: "United States", source: SOURCES.faostat, cropIds: ["maize", "wheat", "rice", "lentil", "chickpea"] },
    ca: { country: "Canada", source: SOURCES.faostat, cropIds: ["wheat", "maize", "lentil", "chickpea"] },
    au: { country: "Australia", source: SOURCES.faostat, cropIds: ["wheat", "maize", "lentil", "chickpea", "mustard"] },
    fr: { country: "France", source: SOURCES.faostat, cropIds: ["wheat", "maize", "lentil", "mustard"] },
    gb: { country: "United Kingdom", source: SOURCES.faostat, cropIds: ["wheat", "maize", "mustard"] },
    br: { country: "Brazil", source: SOURCES.faostat, cropIds: ["maize", "rice", "wheat", "mung-bean"] },
    ar: { country: "Argentina", source: SOURCES.faostat, cropIds: ["maize", "wheat", "lentil", "chickpea"] },
    mx: { country: "Mexico", source: SOURCES.faostat, cropIds: ["maize", "wheat", "rice", "chickpea"] },
    th: { country: "Thailand", source: SOURCES.faostat, cropIds: ["rice", "maize", "wheat", "mung-bean"] },
    vn: { country: "Vietnam", source: SOURCES.faostat, cropIds: ["rice", "maize", "wheat", "mung-bean"] },
    id: { country: "Indonesia", source: SOURCES.faostat, cropIds: ["rice", "maize", "mung-bean"] },
    ke: { country: "Kenya", source: SOURCES.faostat, cropIds: ["maize", "wheat", "rice", "millet"] },
    et: { country: "Ethiopia", source: SOURCES.faostat, cropIds: ["wheat", "maize", "millet", "lentil", "chickpea"] },
    ng: { country: "Nigeria", source: SOURCES.faostat, cropIds: ["maize", "rice", "millet", "mung-bean"] },
    za: { country: "South Africa", source: SOURCES.faostat, cropIds: ["maize", "wheat", "lentil"] }
};

const broadRegions = [
    {
        id: "south-asia",
        label: "South Asia",
        countries: ["af", "bd", "bt", "in", "lk", "mv", "np", "pk"],
        cropIds: ["rice", "maize", "wheat", "lentil", "mustard", "chickpea", "millet", "mung-bean"]
    },
    {
        id: "east-and-southeast-asia",
        label: "East and Southeast Asia",
        countries: ["bn", "kh", "la", "mm", "my", "ph", "sg", "tl", "tw", "kr"],
        cropIds: ["rice", "maize", "wheat", "millet", "mung-bean"]
    },
    {
        id: "europe",
        label: "Europe",
        countries: ["al", "at", "be", "bg", "ch", "cy", "cz", "de", "dk", "ee", "es", "fi", "gr", "hr", "hu", "ie", "is", "it", "lt", "lu", "lv", "md", "me", "mk", "mt", "nl", "no", "pl", "pt", "ro", "rs", "se", "si", "sk", "ua"],
        cropIds: ["wheat", "maize", "rice", "lentil", "mustard"]
    },
    {
        id: "africa",
        label: "Africa",
        countries: ["ao", "bj", "bw", "cd", "cf", "cg", "ci", "cm", "dz", "eg", "gh", "gn", "lr", "ma", "mg", "ml", "mz", "na", "ne", "rw", "sn", "sd", "sl", "so", "ss", "td", "tg", "tn", "tz", "ug", "zm", "zw"],
        cropIds: ["maize", "rice", "millet", "wheat", "mung-bean"]
    },
    {
        id: "americas",
        label: "Americas",
        countries: ["bo", "cl", "co", "cr", "cu", "do", "ec", "gt", "hn", "ni", "pa", "pe", "py", "sv", "uy", "ve"],
        cropIds: ["maize", "rice", "wheat", "lentil", "chickpea"]
    },
    {
        id: "oceania",
        label: "Oceania",
        countries: ["fj", "fm", "ki", "mh", "nr", "nz", "pg", "pw", "sb", "to", "vu", "ws"],
        cropIds: ["rice", "maize", "wheat"]
    }
];

function normalizeRegion(value) {
    return String(value || "")
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, " ")
        .trim();
}

function resolveRegionalCropOptions({ countryCode, region, district }) {
    const code = String(countryCode || "").toLowerCase();
    const profile = countryProfiles[code];
    const regionalName = normalizeRegion(`${district || ""} ${region || ""}`);
    const matchedRegion = profile && (profile.regions || []).find((entry) =>
        entry.match.some((term) => regionalName.includes(normalizeRegion(term)))
    );
    const broadRegion = !profile && broadRegions.find((entry) => entry.countries.includes(code));
    const cropIds = matchedRegion
        ? matchedRegion.cropIds
        : profile
            ? profile.cropIds
            : broadRegion
                ? broadRegion.cropIds
                : [];
    const level = matchedRegion ? "subregion" : profile ? "country" : broadRegion ? "broad-region" : "unavailable";
    return {
        countryCode: code || null,
        level,
        regionName: (matchedRegion && matchedRegion.label) || (profile && profile.country) ||
            (broadRegion && broadRegion.label) || "Regional crop data unavailable",
        cropIds: cropIds.filter((id) => getCropById(id)),
        fallbackCropIds: ((profile && profile.cropIds) || (broadRegion && broadRegion.cropIds) || [])
            .filter((id) => getCropById(id)),
        source: (profile && profile.source) || (broadRegion && SOURCES.faostat) || null,
        note: level === "subregion"
            ? "A broad regional crop set, not farm-level planting advice."
            : level === "country"
                ? "Country-level fallback; local crop calendars and farm conditions may differ."
                : level === "broad-region"
                    ? "Broader regional fallback; confirm local crops with agricultural extension services."
                    : "No curated crop coverage for this location. No crops have been guessed."
    };
}

module.exports = {
    resolveRegionalCropOptions,
    SOURCES
};
