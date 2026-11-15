const assert = require("node:assert/strict");
const test = require("node:test");

const {
    getLocationDetails,
    rankLocations,
    searchLocations
} = require("../services/geocodingService");

test("resolves and caches country, region, and district for current coordinates", async () => {
    const originalFetch = global.fetch;
    let requestCount = 0;
    global.fetch = async () => {
        requestCount += 1;
        return {
            ok: true,
            json: async () => ({
                address: {
                    country_code: "np",
                    country: "Nepal",
                    state: "Bagmati Province",
                    county: "Kathmandu",
                    city: "Kathmandu"
                }
            })
        };
    };

    try {
        const coordinates = { latitude: 33.4567, longitude: 73.1234 };
        const details = await getLocationDetails(coordinates, "en");
        const cached = await getLocationDetails(coordinates, "en");

        assert.deepEqual(details, {
            id: "",
            name: "Kathmandu",
            displayName: "Kathmandu, Bagmati Province, Nepal",
            context: "Bagmati Province, Nepal",
            countryCode: "np",
            country: "Nepal",
            region: "Bagmati Province",
            district: "Kathmandu",
            locality: "Kathmandu"
        });
        assert.deepEqual(cached, details);
        assert.equal(requestCount, 1);
    } finally {
        global.fetch = originalFetch;
    }
});

test("normalizes a location-search response into safe coordinates and context", async () => {
    const originalFetch = global.fetch;
    let searchUrl;
    global.fetch = async (url) => {
        searchUrl = new URL(url);
        return {
            ok: true,
            json: async () => [
                {
                    place_id: 1,
                    name: "Itahari",
                    display_name: "Itahari, Koshi Province, Nepal",
                    lat: "26.6634",
                    lon: "87.2740",
                    type: "city",
                    address: { city: "Itahari", state: "Koshi Province", county: "Sunsari", country: "Nepal", country_code: "np" }
                }
            ]
        };
    };

    try {
        const result = await searchLocations("Itahari, Nepal", { language: "en" });
        assert.equal(result.results.length, 1);
        assert.equal(result.results[0].latitude, 26.6634);
        assert.equal(result.results[0].longitude, 87.274);
        assert.equal(result.results[0].context, "Itahari, Koshi Province, Nepal");
        assert.equal(result.results[0].region, "Koshi Province");
        assert.equal(result.results[0].district, "Sunsari");
        assert.equal(searchUrl.searchParams.get("viewbox"), "80.05,30.45,88.2,26.35");
        assert.equal(searchUrl.searchParams.get("bounded"), "0");
        assert.equal(searchUrl.searchParams.get("accept-language"), "en");
        assert.equal(searchUrl.searchParams.get("q"), "Itahari, Nepal");
        assert.equal(result.results[0].countryCode, "np");
    } finally {
        global.fetch = originalFetch;
    }
});

test("ranks nearby same-country places first without excluding a named foreign country", () => {
    const user = { latitude: 27.7, longitude: 85.3 };
    const places = [
        {
            id: "foreign-nearby", name: "Raxaul", displayName: "Raxaul, India",
            country: "India", countryCode: "in", latitude: 27.0, longitude: 84.9, importance: 0.7
        },
        {
            id: "nepal", name: "Dharan", displayName: "Dharan, Nepal",
            country: "Nepal", countryCode: "np", latitude: 26.8, longitude: 87.3, importance: 0.4
        },
        {
            id: "france", name: "Paris", displayName: "Paris, France",
            country: "France", countryCode: "fr", latitude: 48.8, longitude: 2.3, importance: 0.9
        },
        {
            id: "france-duplicate", name: "Paris", displayName: "Paris, France",
            country: "France", countryCode: "fr", latitude: 48.81, longitude: 2.31, importance: 0.8
        }
    ];

    const localResults = rankLocations("Dharan", places, {
        coordinates: user,
        userCountryCode: "np"
    });
    assert.equal(localResults[0].id, "nepal");
    assert.ok(localResults.some((place) => place.countryCode === "in"));

    const internationalResults = rankLocations("Paris France", places, {
        coordinates: user,
        userCountryCode: "np"
    });
    assert.equal(internationalResults[0].id, "france");
    assert.equal(internationalResults.filter((place) => place.countryCode === "fr").length, 1);
});

test("recognizes Nepali country names in a multilingual query", () => {
    const places = [
        {
            id: "india", name: "New Delhi", displayName: "New Delhi, India",
            country: "India", countryCode: "in", latitude: 28.6, longitude: 77.2, importance: 0.8
        },
        {
            id: "nepal", name: "Kathmandu", displayName: "Kathmandu, Nepal",
            country: "Nepal", countryCode: "np", latitude: 27.7, longitude: 85.3, importance: 0.8
        }
    ];

    const results = rankLocations("दिल्ली भारत", places, {
        coordinates: { latitude: 27.7, longitude: 85.3 },
        userCountryCode: "np"
    });
    assert.equal(results[0].id, "india");
});

test("keeps multilingual queries intact while requesting each selected display language", async () => {
    const originalFetch = global.fetch;
    const requests = [];
    global.fetch = async (url) => {
        const requestUrl = new URL(url);
        requests.push(requestUrl);
        const language = requestUrl.searchParams.get("accept-language");
        const labels = {
            en: "Kathmandu, Nepal",
            ne: "काठमाडौं, नेपाल",
            hi: "काठमांडू, नेपाल"
        };
        return {
            ok: true,
            json: async () => [{
                place_id: 7,
                name: "Kathmandu",
                display_name: labels[language],
                lat: "27.7",
                lon: "85.3",
                address: { city: labels[language].split(",")[0], country: labels[language].split(",")[1].trim(), country_code: "np" }
            }]
        };
    };

    try {
        const cases = [
            ["काठमाडौँ नेपाल", "en"],
            ["दिल्ली भारत", "en"],
            ["Kathmandu Nepal", "ne"],
            ["दिल्ली भारत", "hi"]
        ];
        for (const [query, language] of cases) {
            const result = await searchLocations(query, { language });
            assert.equal(result.results[0].displayName.includes("Kathmandu"), language === "en");
        }

        assert.deepEqual(requests.map((url) => [
            url.searchParams.get("q"),
            url.searchParams.get("accept-language")
        ]), cases);
    } finally {
        global.fetch = originalFetch;
    }
});

test("uses a granted location and display language in provider requests", async () => {
    const originalFetch = global.fetch;
    const urls = [];
    global.fetch = async (url) => {
        const requestUrl = new URL(url);
        urls.push(requestUrl);
        if (requestUrl.pathname.endsWith("/reverse")) {
            return {
                ok: true,
                json: async () => ({ address: { country_code: "np" } })
            };
        }

        return {
            ok: true,
            json: async () => [
                {
                    place_id: 1, name: "Raxaul", display_name: "Raxaul, India", lat: "27.0", lon: "84.9",
                    address: { town: "Raxaul", country: "India", country_code: "in" }
                },
                {
                    place_id: 2, name: "Dharan", display_name: "Dharan, Nepal", lat: "26.8", lon: "87.3",
                    address: { city: "Dharan", country: "Nepal", country_code: "np" }
                }
            ]
        };
    };

    try {
        const result = await searchLocations("Dharan", {
            latitude: 27.71,
            longitude: 85.32,
            language: "ne"
        });
        const searchUrl = urls.find((url) => url.pathname.endsWith("/search"));
        assert.equal(result.results[0].countryCode, "np");
        assert.equal(searchUrl.searchParams.get("accept-language"), "ne");
        assert.equal(searchUrl.searchParams.get("viewbox"), "73.32,35.71,97.32,19.71");
        assert.equal(urls.filter((url) => url.pathname.endsWith("/reverse")).length, 1);
    } finally {
        global.fetch = originalFetch;
    }
});
