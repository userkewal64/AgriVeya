const assert = require("node:assert/strict");
const test = require("node:test");

const { resolveRegionalCropOptions } = require("../data/regionalCropDataset");

test("uses a district-level Nepal crop set when a known Terai location is selected", () => {
    const result = resolveRegionalCropOptions({
        countryCode: "np",
        region: "Madhesh Province",
        district: "Sunsari"
    });

    assert.equal(result.level, "subregion");
    assert.equal(result.regionName, "Terai");
    assert.ok(result.cropIds.includes("rice"));
    assert.ok(result.cropIds.includes("mung-bean"));
});

test("matches Nepalese and Hindi region names without changing the displayed region", () => {
    const nepaliResult = resolveRegionalCropOptions({
        countryCode: "np",
        region: "बागमती प्रदेश",
        district: "काठमाडौँ जिल्ला"
    });
    const hindiResult = resolveRegionalCropOptions({
        countryCode: "in",
        region: "दिल्ली",
        district: "नई दिल्ली"
    });

    assert.equal(nepaliResult.regionName, "Hill region");
    assert.equal(hindiResult.regionName, "Northern India");
});

test("falls back to country-level options when detailed regional data is unavailable", () => {
    const result = resolveRegionalCropOptions({
        countryCode: "pk",
        region: "",
        district: ""
    });

    assert.equal(result.level, "country");
    assert.ok(result.cropIds.length > 0);
    assert.match(result.note, /Country-level fallback/);
});

test("does not invent crop options for an uncovered location", () => {
    const result = resolveRegionalCropOptions({
        countryCode: "zz",
        region: "Unknown",
        district: "Unknown"
    });

    assert.equal(result.level, "unavailable");
    assert.deepEqual(result.cropIds, []);
    assert.equal(result.source, null);
});
