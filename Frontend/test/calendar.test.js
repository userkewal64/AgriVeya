"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const calendar = require("../calendar");

test("English and Hindi month windows remain in Gregorian AD", () => {
    const english = calendar.formatMonthWindow([2, 3], "summer", "planting", 2027, "en");
    const hindi = calendar.formatMonthWindow([2, 3], "summer", "planting", 2027, "hi");

    assert.equal(english, "1 Feb 2027 – 31 Mar 2027");
    assert.match(hindi, /2027/);
    assert.match(hindi, /फ़र/);
});

test("Nepali dates use converted BS dates and handle a month boundary", () => {
    const value = calendar.formatBikramSambatDateRange({
        start: new Date(2024, 5, 14, 12),
        end: new Date(2024, 5, 15, 12)
    });

    assert.equal(value, "३२ जेठ २०८१ – १ असार २०८१");
});

test("Nepali month windows convert both endpoints using the actual calendar year", () => {
    const value = calendar.formatMonthWindow([6, 7], "monsoon", "planting", 2027, "ne");

    assert.match(value, /२०८४/);
    assert.match(value, /जेठ/);
    assert.match(value, /श्रावण/);
});

test("winter harvest windows fall in the year after winter planting", () => {
    const window = calendar.getDateWindow([2, 3], "winter", "harvest", 2027);

    assert.equal(window.start.getFullYear(), 2028);
    assert.equal(window.end.getFullYear(), 2028);
    assert.equal(window.start.getMonth(), 1);
    assert.equal(window.end.getMonth(), 2);
});

test("Gregorian month lengths account for leap years", () => {
    const window = calendar.getDateWindow([2, 2], "summer", "planting", 2024);

    assert.equal(window.end.getDate(), 29);
});

test("calendar plan year uses the next occurrence of the summer planting window", () => {
    assert.equal(calendar.getPlanStartYear(new Date(2026, 10, 15, 12)), 2027);
    assert.equal(calendar.getPlanStartYear(new Date(2027, 2, 15, 12)), 2027);
    assert.equal(calendar.getPlanStartYear(new Date(2027, 3, 1, 12)), 2028);
});

test("BS conversion reports dates outside the converter's verified range", () => {
    const value = calendar.formatMonthWindow([2, 3], "summer", "planting", 2035, "ne");

    assert.equal(value, null);
});
