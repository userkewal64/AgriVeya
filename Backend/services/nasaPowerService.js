const NASA_POWER_DAILY_POINT_URL =
    "https://power.larc.nasa.gov/api/temporal/daily/point";

const NASA_PARAMETERS = [
    "T2M",
    "PRECTOTCORR",
    "RH2M",
    "ALLSKY_SFC_SW_DWN"
];

const REQUEST_TIMEOUT_MS = 10000;
const CACHE_TTL_MS = 30 * 60 * 1000;
const MAX_DATE_RANGE_DAYS = 366;
const DRY_DAY_PRECIPITATION_THRESHOLD_MM = 1;
const climateCache = new Map();

class ClimateRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = "ClimateRequestError";
    }
}

class NasaPowerError extends Error {
    constructor(message) {
        super(message);
        this.name = "NasaPowerError";
    }
}

function parseCoordinate(value, name, minimum, maximum) {
    if (value === undefined || value === "") {
        throw new ClimateRequestError(`${name} is required.`);
    }

    const coordinate = Number(value);

    if (!Number.isFinite(coordinate) || coordinate < minimum || coordinate > maximum) {
        throw new ClimateRequestError(
            `${name} must be a number between ${minimum} and ${maximum}.`
        );
    }

    return coordinate;
}

function parseDate(value, name) {
    const match = /^(\d{4})(?:-)?(\d{2})(?:-)?(\d{2})$/.exec(value || "");

    if (!match) {
        throw new ClimateRequestError(
            `${name} must use YYYY-MM-DD or YYYYMMDD format.`
        );
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(Date.UTC(year, month - 1, day));

    if (
        date.getUTCFullYear() !== year ||
        date.getUTCMonth() !== month - 1 ||
        date.getUTCDate() !== day
    ) {
        throw new ClimateRequestError(`${name} must be a real calendar date.`);
    }

    return {
        nasaDate: `${match[1]}${match[2]}${match[3]}`,
        isoDate: `${match[1]}-${match[2]}-${match[3]}`,
        timestamp: date.getTime()
    };
}

function getDefaultDateRange() {
    // A full prior calendar year is complete historical data, not a forecast.
    const previousYear = new Date().getUTCFullYear() - 1;

    return {
        start: parseDate(`${previousYear}0101`, "start"),
        end: parseDate(`${previousYear}1231`, "end"),
        isDefault: true
    };
}

function getDateRange(startValue, endValue) {
    if ((startValue && !endValue) || (!startValue && endValue)) {
        throw new ClimateRequestError(
            "Provide both start and end dates, or omit both to use the default period."
        );
    }

    if (!startValue && !endValue) {
        return getDefaultDateRange();
    }

    const start = parseDate(startValue, "start");
    const end = parseDate(endValue, "end");

    if (start.timestamp > end.timestamp) {
        throw new ClimateRequestError("start must be on or before end.");
    }

    const dayCount = Math.floor((end.timestamp - start.timestamp) / 86400000) + 1;

    if (dayCount > MAX_DATE_RANGE_DAYS) {
        throw new ClimateRequestError(
            `The date range cannot exceed ${MAX_DATE_RANGE_DAYS} days.`
        );
    }

    return { start, end, isDefault: false };
}

function getDatesInRange(start, end) {
    const dates = [];
    const current = new Date(start.timestamp);

    while (current.getTime() <= end.timestamp) {
        const year = current.getUTCFullYear();
        const month = String(current.getUTCMonth() + 1).padStart(2, "0");
        const day = String(current.getUTCDate()).padStart(2, "0");

        dates.push({
            nasaDate: `${year}${month}${day}`,
            isoDate: `${year}-${month}-${day}`
        });
        current.setUTCDate(current.getUTCDate() + 1);
    }

    return dates;
}

function normaliseValue(value) {
    const number = Number(value);

    // NASA POWER uses -999 for unavailable values in its data responses.
    if (!Number.isFinite(number) || number === -999) {
        return null;
    }

    return number;
}

function calculateAverage(values) {
    const validValues = values.filter((value) => value !== null);

    if (validValues.length === 0) {
        return null;
    }

    const total = validValues.reduce((sum, value) => sum + value, 0);
    return Number((total / validValues.length).toFixed(2));
}

function calculateTotal(values) {
    const validValues = values.filter((value) => value !== null);

    if (validValues.length === 0) {
        return null;
    }

    const total = validValues.reduce((sum, value) => sum + value, 0);
    return Number(total.toFixed(2));
}

function buildClimateResult(nasaData, latitude, longitude, dateRange) {
    const parameterData = nasaData?.properties?.parameter;

    if (!parameterData) {
        throw new NasaPowerError("NASA POWER returned an unexpected response format.");
    }

    for (const parameter of NASA_PARAMETERS) {
        if (!parameterData[parameter]) {
            throw new NasaPowerError(
                `NASA POWER did not return the requested ${parameter} parameter.`
            );
        }
    }

    const missingCounts = {
        T2M: 0,
        PRECTOTCORR: 0,
        RH2M: 0,
        ALLSKY_SFC_SW_DWN: 0
    };

    const dailyObservations = getDatesInRange(dateRange.start, dateRange.end).map((date) => {
        const temperatureC = normaliseValue(parameterData.T2M[date.nasaDate]);
        const precipitationMm = normaliseValue(parameterData.PRECTOTCORR[date.nasaDate]);
        const relativeHumidityPercent = normaliseValue(parameterData.RH2M[date.nasaDate]);
        const solarRadiationMjM2Day = normaliseValue(
            parameterData.ALLSKY_SFC_SW_DWN[date.nasaDate]
        );

        const values = {
            T2M: temperatureC,
            PRECTOTCORR: precipitationMm,
            RH2M: relativeHumidityPercent,
            ALLSKY_SFC_SW_DWN: solarRadiationMjM2Day
        };

        for (const [parameter, value] of Object.entries(values)) {
            if (value === null) {
                missingCounts[parameter] += 1;
            }
        }

        return {
            date: date.isoDate,
            temperatureC,
            precipitationMm,
            relativeHumidityPercent,
            solarRadiationMjM2Day
        };
    });

    const temperatureValues = dailyObservations.map((item) => item.temperatureC);
    const precipitationValues = dailyObservations.map((item) => item.precipitationMm);
    const humidityValues = dailyObservations.map((item) => item.relativeHumidityPercent);
    const solarRadiationValues = dailyObservations.map(
        (item) => item.solarRadiationMjM2Day
    );
    const daysWithAnyMissingValue = dailyObservations.filter((item) =>
        Object.values(item).some((value) => value === null)
    ).length;

    return {
        location: { latitude, longitude },
        dataSource: {
            name: "NASA POWER Daily Point API",
            endpoint: NASA_POWER_DAILY_POINT_URL,
            community: "AG",
            dataType: "Historical environmental data",
            note: "This data is not a live weather forecast and does not measure soil directly."
        },
        dateRange: {
            start: dateRange.start.isoDate,
            end: dateRange.end.isoDate,
            usedDefaultCompletedPeriod: dateRange.isDefault
        },
        units: {
            temperatureC: "degrees Celsius (T2M)",
            precipitationMm: "millimetres per day (PRECTOTCORR)",
            relativeHumidityPercent: "percent (RH2M)",
            solarRadiationMjM2Day:
                "megajoules per square metre per day (ALLSKY_SFC_SW_DWN)",
            dryDay: `PRECTOTCORR below ${DRY_DAY_PRECIPITATION_THRESHOLD_MM} mm/day`
        },
        summary: {
            averageTemperatureC: calculateAverage(temperatureValues),
            totalPrecipitationMm: calculateTotal(precipitationValues),
            averageRelativeHumidityPercent: calculateAverage(humidityValues),
            averageSolarRadiationMjM2Day: calculateAverage(solarRadiationValues),
            dryDays: precipitationValues.filter(
                (value) =>
                    value !== null && value < DRY_DAY_PRECIPITATION_THRESHOLD_MM
            ).length
        },
        dailyObservations,
        missingData: {
            nasaMissingValue: -999,
            handling: "NASA missing values are converted to null and excluded from summary calculations.",
            missingValuesByParameter: missingCounts,
            daysWithAnyMissingValue,
            totalDaysRequested: dailyObservations.length
        }
    };
}

function buildCacheKey(latitude, longitude, dateRange) {
    return [
        latitude.toFixed(4),
        longitude.toFixed(4),
        dateRange.start.nasaDate,
        dateRange.end.nasaDate
    ].join("|");
}

async function requestNasaPowerData(latitude, longitude, dateRange) {
    const query = new URLSearchParams({
        parameters: NASA_PARAMETERS.join(","),
        community: "AG",
        longitude: String(longitude),
        latitude: String(latitude),
        start: dateRange.start.nasaDate,
        end: dateRange.end.nasaDate,
        format: "JSON"
    });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(`${NASA_POWER_DAILY_POINT_URL}?${query}`, {
            signal: controller.signal
        });

        if (!response.ok) {
            throw new NasaPowerError(
                `NASA POWER responded with HTTP ${response.status}.`
            );
        }

        return await response.json();
    } catch (error) {
        if (error.name === "AbortError") {
            throw new NasaPowerError(
                `NASA POWER did not respond within ${REQUEST_TIMEOUT_MS / 1000} seconds.`
            );
        }

        if (error instanceof NasaPowerError) {
            throw error;
        }

        throw new NasaPowerError(`Unable to reach NASA POWER: ${error.message}`);
    } finally {
        clearTimeout(timeout);
    }
}

function addCacheMetadata(result, cacheHit) {
    return {
        ...result,
        cache: {
            hit: cacheHit,
            ttlMinutes: CACHE_TTL_MS / 60000
        }
    };
}

async function getClimateData(query) {
    const latitude = parseCoordinate(query.latitude, "latitude", -90, 90);
    const longitude = parseCoordinate(query.longitude, "longitude", -180, 180);
    const dateRange = getDateRange(query.start, query.end);
    const cacheKey = buildCacheKey(latitude, longitude, dateRange);
    const cachedEntry = climateCache.get(cacheKey);

    if (cachedEntry && cachedEntry.expiresAt > Date.now()) {
        return addCacheMetadata(cachedEntry.result, true);
    }

    if (cachedEntry) {
        climateCache.delete(cacheKey);
    }

    const nasaData = await requestNasaPowerData(latitude, longitude, dateRange);
    const result = buildClimateResult(nasaData, latitude, longitude, dateRange);

    climateCache.set(cacheKey, {
        result,
        expiresAt: Date.now() + CACHE_TTL_MS
    });

    return addCacheMetadata(result, false);
}

module.exports = {
    ClimateRequestError,
    NasaPowerError,
    getClimateData
};
