const assert = require("node:assert/strict");
const test = require("node:test");

const { searchLocations } = require("../services/geocodingService");

test("normalizes a location-search response into safe coordinates and context", async () => {
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
    }
});
