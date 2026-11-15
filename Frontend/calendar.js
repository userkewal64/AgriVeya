(function (root, factory) {
  const NepaliDate = typeof module === "object" && module.exports
    ? require("./vendor/nepali-date-converter.umd.js")
    : root.NepaliDate;
  const calendar = factory(NepaliDate);

  if (typeof module === "object" && module.exports) module.exports = calendar;
  root.AgriVeyaCalendar = calendar;
})(typeof globalThis !== "undefined" ? globalThis : this, function (NepaliDate) {
  "use strict";

  const AD_MIN = new Date(1943, 3, 14, 12);
  const AD_MAX = new Date(2034, 3, 13, 12);

  function getPlanStartYear(referenceDate = new Date(), plantingMonths = [2, 3]) {
    if (!(referenceDate instanceof Date) || !Number.isFinite(referenceDate.getTime())) {
      throw new TypeError("referenceDate must be a valid Date.");
    }
    if (!Array.isArray(plantingMonths) || plantingMonths.length !== 2 ||
        plantingMonths.some((month) => !Number.isInteger(month) || month < 1 || month > 12)) {
      throw new RangeError("plantingMonths must contain two Gregorian month numbers.");
    }

    const year = referenceDate.getFullYear();
    const lastPlantingDay = new Date(year, plantingMonths[1], 0, 23, 59, 59, 999);
    return referenceDate <= lastPlantingDay ? year : year + 1;
  }

  function getDateWindow(months, season, period, planYear) {
    if (!Array.isArray(months) || months.length !== 2 ||
        months.some((month) => !Number.isInteger(month) || month < 1 || month > 12)) {
      throw new RangeError("months must contain two Gregorian month numbers.");
    }
    if (season !== "summer" && season !== "monsoon" && season !== "winter") {
      throw new RangeError("season must be summer, monsoon, or winter.");
    }
    if (period !== "planting" && period !== "harvest") {
      throw new RangeError("period must be planting or harvest.");
    }
    if (!Number.isInteger(planYear)) {
      throw new RangeError("planYear must be an integer Gregorian year.");
    }

    const yearOffset = season === "winter" && period === "harvest" ? 1 : 0;
    const startYear = planYear + yearOffset;
    const endYear = startYear + (months[1] < months[0] ? 1 : 0);
    return {
      start: new Date(startYear, months[0] - 1, 1, 12),
      end: new Date(endYear, months[1], 0, 12)
    };
  }

  function formatGregorianDateRange(window, language) {
    const locale = language === "hi" ? "hi-IN-u-ca-gregory-nu-latn" : "en-GB-u-ca-gregory-nu-latn";
    const formatter = new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
    return `${formatter.format(window.start)} – ${formatter.format(window.end)}`;
  }

  function formatBikramSambatDateRange(window) {
    if (window.start < AD_MIN || window.start > AD_MAX || window.end < AD_MIN || window.end > AD_MAX) {
      return null;
    }

    const start = NepaliDate.fromAD(window.start).format("D MMMM YYYY", "np");
    const end = NepaliDate.fromAD(window.end).format("D MMMM YYYY", "np");
    return `${start} – ${end}`;
  }

  function formatMonthWindow(months, season, period, planYear, language) {
    const window = getDateWindow(months, season, period, planYear);
    return language === "ne"
      ? formatBikramSambatDateRange(window)
      : formatGregorianDateRange(window, language);
  }

  return {
    formatBikramSambatDateRange,
    formatGregorianDateRange,
    formatMonthWindow,
    getDateWindow,
    getPlanStartYear
  };
});
