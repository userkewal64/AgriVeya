const assert = require("node:assert/strict");
const { describe, test } = require("node:test");

const { clearLocationSearchState, searchLocations } = require("../services/geocodingService");

describe("location search", { concurrency: false }, () => {

test("normalizes a location-search response into safe coordinates and context", async () => {
    clearLocationSearchState();
    const originalFetch = global.fetch;
    global.fetch = async () => ({
        ok: true,
        json: async () => [
            {
                place_id: 1,
                name: "Itahari",
                display_name: "Itahari, Koshi Province, Nepal",
                lat: "26.6634",
                lon: "87.2740",
                type: "city",
                address: { city: "Itahari", state: "Koshi Province", country: "Nepal" }
            }
        ]
    });

    try {
        const result = await searchLocations("Itahari, Nepal");
        assert.equal(result.results.length, 1);
        assert.equal(result.results[0].latitude, 26.6634);
        assert.equal(result.results[0].longitude, 87.274);
        assert.equal(result.results[0].context, "Itahari, Koshi Province, Nepal");
    } finally {
        global.fetch = originalFetch;
        clearLocationSearchState();
    }
});

test("asks Nominatim for place names in the selected language", async () => {
    clearLocationSearchState();
    const originalFetch = global.fetch;
    const calls = [];

    global.fetch = async (url, options) => {
        calls.push({ url: String(url), language: options.headers["Accept-Language"] });
        const language = new URL(url).searchParams.get("accept-language");
        const name = language === "ne" ? "पोखरा" : "Pokhara";
        return {
            ok: true,
            json: async () => [
                {
                    place_id: language,
                    name,
                    display_name: `${name}, Nepal`,
                    lat: "28.2095",
                    lon: "83.9856",
                    type: "city",
                    address: { city: name, country: "Nepal" }
                }
            ]
        };
    };

    try {
        const nepali = await searchLocations("पोखरा", "ne");
        const english = await searchLocations("पोखरा", "en");
        const cachedNepali = await searchLocations("पोखरा", "ne");
        const fallback = await searchLocations("Pokhara", "fr");

        assert.equal(nepali.results[0].name, "पोखरा");
        assert.equal(english.results[0].name, "Pokhara");
        assert.equal(english.cache.hit, false);
        assert.equal(cachedNepali.cache.hit, true);
        assert.equal(cachedNepali.results[0].name, "पोखरा");
        assert.equal(calls.length, 3);
        assert.equal(calls[0].language, "ne");
        assert.equal(new URL(calls[0].url).searchParams.get("q"), "पोखरा");
        assert.equal(new URL(calls[0].url).searchParams.get("accept-language"), "ne");
        assert.equal(new URL(calls[2].url).searchParams.get("accept-language"), "en");
        assert.equal(fallback.results[0].name, "Pokhara");
    } finally {
        global.fetch = originalFetch;
        clearLocationSearchState();
    }
});

});
