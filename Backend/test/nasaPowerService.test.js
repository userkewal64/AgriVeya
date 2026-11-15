const assert = require("node:assert/strict");
const test = require("node:test");

const {
    NasaPowerError,
    getClimateData
} = require("../services/nasaPowerService");

test("surfaces an upstream fetch failure as a NASA POWER error", async () => {
    const originalFetch = global.fetch;
    global.fetch = async () => {
        throw new Error("test network failure");
    };

    try {
        await assert.rejects(
            () =>
                getClimateData({
                    latitude: "26.66",
                    longitude: "87.27",
                    start: "2024-01-01",
                    end: "2024-01-07"
                }),
            NasaPowerError
        );
    } finally {
        global.fetch = originalFetch;
    }
});
