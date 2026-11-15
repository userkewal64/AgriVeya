"use strict";

/* ==========================================================
   CONFIG: edit these lists if the backend rejects a value.
   The "value" must match what Backend/data/cropDataset.js and
   Backend/services/recommendationEngine.js accept.
   If the backend says a value is unsupported, the message is
   shown on the page and tells you what to change here.
   ========================================================== */
const CONFIG = {
  soilTypes: [
    { value: "sandy", label: "Sandy" },
    { value: "loam", label: "Loam" },
    { value: "silt", label: "Silt" },
    { value: "clay", label: "Clay" }
  ],
  crops: [
    { value: "rice", label: "Rice" },
    { value: "maize", label: "Maize" },
    { value: "wheat", label: "Wheat" },
    { value: "lentil", label: "Lentil" },
    { value: "mustard", label: "Mustard" },
    { value: "chickpea", label: "Chickpea" },
    { value: "millet", label: "Millet" },
    { value: "mung_bean", label: "Mung bean" }
  ],
  priorities: [
    { key: "waterConservation", label: "Water conservation", hint: "Prefer crops that need less water." },
    { key: "climateResilience", label: "Climate resilience", hint: "Prefer crops that cope with heat and dry spells." },
    { key: "soilHealth", label: "Soil health", hint: "Prefer rotations that rebuild the soil, such as legumes after cereals." }
  ],
  priorityLevels: [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" }
  ],
  defaultPriorityLevel: "medium",
  requestTimeoutMs: 30000,
  // Location used for the climate snapshot in the hero (real NASA POWER data via the backend)
  snapshot: { latitude: 26.66, longitude: 87.27, label: "Itahari area" }
};

/* ---------- Small DOM helpers (text only, no innerHTML) ---------- */
function el(tag, props, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props || {})) {
    if (value === undefined || value === null) continue;
    if (key === "class") node.className = value;
    else if (key === "text") node.textContent = value;
    else node.setAttribute(key, value);
  }
  for (const child of children.flat()) {
    if (child === undefined || child === null || child === false) continue;
    node.append(child.nodeType ? child : document.createTextNode(String(child)));
  }
  return node;
}

const $ = (id) => document.getElementById(id);
const resultsEl = $("results");

/* ---------- Navigation: scrolled state + mobile menu ---------- */
(function setupNav() {
  const nav = document.querySelector(".nav");
  const toggle = $("menu-toggle");
  const menu = $("menu");

  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  function setOpen(open) {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  document.addEventListener("click", (e) => { if (!nav.contains(e.target)) setOpen(false); });
})();

/* ---------- Build the form controls from CONFIG ---------- */
function fillSelect(select, options) {
  options.forEach((o) => select.append(el("option", { value: o.value, text: o.label })));
}

function buildForm() {
  fillSelect($("soilType"), CONFIG.soilTypes);
  fillSelect($("previousCrop"), CONFIG.crops);

  const box = $("priorities");
  CONFIG.priorities.forEach((p) => {
    box.append(
      el(
        "div",
        { class: "priority", role: "radiogroup", "aria-label": p.label },
        el("div", { class: "priority-name", text: p.label }),
        el("div", { class: "priority-hint", text: p.hint }),
        el(
          "div",
          { class: "segmented" },
          CONFIG.priorityLevels.map((level) => {
            const input = el("input", { type: "radio", name: p.key, value: level.value });
            if (level.value === CONFIG.defaultPriorityLevel) input.checked = true;
            return el("label", {}, input, el("span", { text: level.label }));
          })
        )
      )
    );
  });
}

/* ---------- Result-area states ---------- */
function showState(...nodes) {
  resultsEl.replaceChildren(...nodes);
}

function showLoading() {
  showState(
    el(
      "section",
      { class: "glass state loading", role: "status" },
      el("div", { class: "spinner", "aria-hidden": "true" }),
      el(
        "div",
        {},
        el("h3", { text: "Getting climate data from NASA POWER" }),
        el("p", { text: "This usually takes a few seconds. Your options will appear here." })
      )
    )
  );
}

function showError(title, message, extra) {
  showState(
    el(
      "section",
      { class: "glass state error", role: "alert" },
      el("h3", { text: title }),
      el("p", { text: message }),
      extra ? el("p", { text: extra }) : null
    )
  );
  scrollToResults();
}

function scrollToResults() {
  resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------- Generic helpers for response data ---------- */
// The backend's exact field names may vary slightly, so we read defensively.
function pick(obj, keys) {
  if (!obj || typeof obj !== "object") return undefined;
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) return obj[key];
  }
  return undefined;
}

function humanize(key) {
  const spaced = String(key).replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
}

function toText(item) {
  if (item === null || item === undefined) return "";
  if (typeof item === "string") return item;
  if (typeof item === "number" || typeof item === "boolean") return String(item);
  if (typeof item === "object") {
    const text = pick(item, ["message", "text", "description", "reason", "risk", "flag", "title", "name"]);
    if (text !== undefined && typeof text !== "object") {
      const label = pick(item, ["severity", "level", "type"]);
      return label && typeof label !== "object" ? `${humanize(label)}: ${text}` : String(text);
    }
    return Object.entries(item)
      .map(([k, v]) => `${humanize(k)}: ${typeof v === "object" ? JSON.stringify(v) : v}`)
      .join("; ");
  }
  return String(item);
}

function toList(value) {
  if (value === undefined || value === null) return [];
  if (Array.isArray(value)) return value.map(toText).filter(Boolean);
  if (typeof value === "object") {
    return Object.entries(value).map(([k, v]) => `${humanize(k)}: ${toText(v)}`);
  }
  return [toText(value)].filter(Boolean);
}

function bulletList(items) {
  return el("ul", {}, items.map((t) => el("li", { text: t })));
}

// Renders any unknown JSON shape as readable text.
function renderAny(value) {
  if (value === undefined || value === null) return el("p", { text: "Not provided." });
  if (typeof value === "string" || typeof value === "number") return el("p", { text: String(value) });
  if (Array.isArray(value)) return bulletList(value.map(toText));
  const dl = el("dl", { class: "kv" });
  Object.entries(value).forEach(([k, v]) => {
    dl.append(el("dt", { text: humanize(k) }));
    dl.append(el("dd", {}, typeof v === "object" ? renderAny(v) : String(v)));
  });
  return dl;
}

function fmt(value, digits) {
  return typeof value === "number" && Number.isFinite(value) ? value.toFixed(digits) : "n/a";
}

function fmtInt(value) {
  return typeof value === "number" && Number.isFinite(value) ? Math.round(value).toLocaleString() : "n/a";
}

function clampPct(n) {
  return Math.max(0, Math.min(100, n));
}

/* ---------- Climate overview (inside results) ---------- */
function renderClimate(data) {
  const s = data.climateSummary || {};
  const period = data.climatePeriod || {};
  const tile = (label, value, unit) =>
    el("div", { class: "tile" }, el("dt", { text: label }), el("dd", {}, value, " ", el("small", { text: unit })));

  return el(
    "section",
    { class: "glass overview" },
    el("h3", { text: "What the climate has done here" }),
    el("p", {
      class: "hint",
      text: period.start && period.end ? `NASA POWER observations from ${period.start} to ${period.end}.` : "NASA POWER observations."
    }),
    el(
      "dl",
      { class: "tiles" },
      tile("Average temperature", fmt(s.averageTemperatureC, 1), "°C"),
      tile("Total rainfall", fmtInt(s.totalPrecipitationMm), "mm"),
      tile("Average humidity", fmtInt(s.averageRelativeHumidityPercent), "%"),
      tile("Average sunlight", fmt(s.averageSolarRadiationMjM2Day, 1), "MJ/m²/day"),
      tile("Dry days", s.dryDays ?? "n/a", "under 1 mm")
    )
  );
}

/* ---------- One recommendation card ---------- */
function normaliseSequence(rec, data) {
  let seq = pick(rec, ["sequence", "cropSequence", "rotation", "rotationSequence"]);
  if (typeof seq === "string") seq = seq.split(/→|->|>/).map((s) => s.trim()).filter(Boolean);

  if (Array.isArray(seq) && seq.length) {
    return seq.map((item) =>
      typeof item === "string"
        ? { name: item }
        : { name: pick(item, ["name", "crop", "cropName", "id"]) || "Crop", season: pick(item, ["season", "sowingSeason"]) }
    );
  }

  // Fallback: previous crop, then the recommended crop.
  const prev = data.farmProfile && data.farmProfile.previousCrop;
  const next = pick(rec, ["crop", "cropName", "name"]);
  const nextName = next && typeof next === "object" ? pick(next, ["name", "id"]) : next;
  const items = [];
  if (prev) items.push({ name: prev.name || prev.id, season: prev.season });
  if (nextName) items.push({ name: nextName, season: pick(rec, ["season"]) });
  return items;
}

function scoreToPercent(raw) {
  if (typeof raw !== "number" || !Number.isFinite(raw)) return null;
  return clampPct(raw <= 1 ? raw * 100 : raw);
}

function fitLabel(percent) {
  if (percent === null) return "Suitability score";
  if (percent >= 75) return "Strong fit";
  if (percent >= 55) return "Moderate fit";
  return "Weak fit";
}

function renderBreakdown(rec) {
  const raw = pick(rec, ["scoreBreakdown", "breakdown", "components", "scores", "scoreComponents"]);
  if (!raw || typeof raw !== "object") return null;

  const rows = [];
  for (const [key, value] of Object.entries(raw)) {
    const num = typeof value === "number" ? value : pick(value, ["score", "value", "points"]);
    const pct = scoreToPercent(num);
    if (pct === null) continue;
    rows.push(
      el(
        "div",
        { class: "breakdown-row" },
        el("span", { text: humanize(key) }),
        el("div", { class: "track" }, el("i", { style: `width:${pct}%` })),
        el("span", { class: "num", text: fmtInt(pct) })
      )
    );
  }

  return el("details", { class: "breakdown" }, el("summary", { text: "How the score was built" }), rows.length ? rows : renderAny(raw));
}

function renderRecommendation(rec, index, data) {
  const sequence = normaliseSequence(rec, data);
  const percent = scoreToPercent(pick(rec, ["score", "suitabilityScore", "totalScore", "overallScore"]));
  const benefits = toList(pick(rec, ["benefits", "rotationBenefits", "reasons"]));
  const risks = toList(pick(rec, ["risks", "tradeOffs", "tradeoffs", "limitations"]));
  const explanation = pick(rec, ["explanation", "rankingExplanation", "whyRanked", "summary"]);

  const chips = [];
  sequence.forEach((item, i) => {
    if (i > 0) chips.push(el("span", { class: "arrow", role: "img", "aria-label": "then" }));
    const isNext = i === sequence.length - 1 && sequence.length > 1;
    chips.push(
      el(
        "div",
        { class: isNext ? "chip next" : "chip" },
        el("b", { text: item.name }),
        item.season ? el("small", { text: `${item.season} season` }) : null
      )
    );
  });

  const ring = el("div", { class: "ring", role: "img", "aria-label": percent === null ? "No score" : `Score ${fmtInt(percent)} out of 100` }, el("span", { text: percent === null ? "n/a" : fmtInt(percent) }));

  const card = el(
    "article",
    { class: index === 0 ? "glass rec top" : "glass rec" },
    el(
      "div",
      { class: "rec-top" },
      el(
        "div",
        {},
        el("span", { class: "badge", text: index === 0 ? "Best match" : `Option ${index + 1}` }),
        el("div", { class: "sequence" }, chips)
      ),
      el("div", { class: "score" }, ring, el("div", { class: "score-label", text: fitLabel(percent) }))
    ),
    explanation ? el("div", { class: "explain" }, el("strong", { text: "Why it ranked here" }), toText(explanation)) : null,
    el(
      "div",
      { class: "cols" },
      el("div", {}, el("h4", { text: "Why it fits" }), benefits.length ? bulletList(benefits) : el("p", { text: "No benefits listed." })),
      el("div", { class: "risks" }, el("h4", { text: "Risks and trade-offs" }), risks.length ? bulletList(risks) : el("p", { text: "No specific risks listed." }))
    ),
    renderBreakdown(rec)
  );

  // Animate the score ring after the card is in the page.
  if (percent !== null) {
    requestAnimationFrame(() => requestAnimationFrame(() => ring.style.setProperty("--p", String(percent))));
  }
  return card;
}

/* ---------- Whole result page ---------- */
function renderResults(data) {
  const recs = Array.isArray(data.recommendations) ? data.recommendations : [];
  const stack = el("div", { class: "results-stack" });
  const period = data.climatePeriod || {};

  stack.append(
    el(
      "div",
      { class: "notice" },
      el("p", {
        text: `These options use NASA POWER observations${period.start ? ` from ${period.start} to ${period.end}` : ""}. That is what the climate did in the past, not a weather forecast. Scores rank crops by simple rules and do not predict yield.`
      }),
      toList(data.missingClimateData).length
        ? el("p", { text: "Some climate values were missing, so scores that depend on them are less certain." })
        : null
    )
  );

  stack.append(renderClimate(data));

  if (!recs.length) {
    stack.append(
      el(
        "section",
        { class: "glass state" },
        el("h3", { text: "No suitable options found" }),
        el("p", { text: "The rules did not produce a recommendation for this combination. Try a different soil texture or last crop." })
      )
    );
  } else {
    stack.append(el("h3", { class: "results-title", text: "Your three rotation options for the next season" }));
    recs.forEach((rec, i) => stack.append(renderRecommendation(rec, i, data)));
  }

  const flags = toList(data.riskFlags);
  if (flags.length) {
    stack.append(el("section", { class: "glass flags" }, el("h3", { text: "Things to keep in mind" }), bulletList(flags)));
  }

  const more = el("section", { class: "glass more" });
  const reasons = toList(data.reasons);
  if (reasons.length) more.append(el("details", {}, el("summary", { text: "Overall reasons" }), bulletList(reasons)));
  if (data.methodology) more.append(el("details", {}, el("summary", { text: "How FieldShift scores crops" }), renderAny(data.methodology)));
  if (data.dataSources) more.append(el("details", {}, el("summary", { text: "Data sources" }), renderAny(data.dataSources)));
  more.append(el("details", {}, el("summary", { text: "Raw response (for debugging)" }), el("pre", { text: JSON.stringify(data, null, 2) })));
  stack.append(more);

  showState(stack);
  scrollToResults();
}

/* ---------- Reading and validating the form ---------- */
function readForm() {
  const latitude = Number($("latitude").value);
  const longitude = Number($("longitude").value);
  const start = $("start").value;
  const end = $("end").value;

  if ($("latitude").value === "" || !Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw new Error("Latitude must be a number between -90 and 90.");
  }
  if ($("longitude").value === "" || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new Error("Longitude must be a number between -180 and 180.");
  }
  if ((start && !end) || (!start && end)) throw new Error("Set both a start and an end date, or leave both empty.");
  if (start && end && start > end) throw new Error("The start date must be before the end date.");

  const farmerPriorities = {};
  CONFIG.priorities.forEach((p) => {
    const checked = document.querySelector(`input[name="${p.key}"]:checked`);
    farmerPriorities[p.key] = checked ? checked.value : CONFIG.defaultPriorityLevel;
  });

  const payload = { latitude, longitude, soilType: $("soilType").value, previousCrop: $("previousCrop").value, farmerPriorities };
  if (start && end) {
    payload.start = start;
    payload.end = end;
  }
  return payload;
}

/* ---------- Calling the backend ---------- */
async function requestRecommendations(payload) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CONFIG.requestTimeoutMs);
  try {
    const response = await fetch("/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    let body = null;
    try { body = await response.json(); } catch (_) { /* non-JSON response */ }

    if (!response.ok) {
      const error = new Error((body && (body.error || body.message)) || `Request failed (${response.status}).`);
      error.status = response.status;
      throw error;
    }
    return body;
  } finally {
    clearTimeout(timer);
  }
}

async function handleSubmit(event) {
  event.preventDefault();
  const button = $("submit");

  let payload;
  try {
    payload = readForm();
  } catch (error) {
    showError("Check your details", error.message);
    return;
  }

  button.disabled = true;
  button.textContent = "Working…";
  showLoading();
  scrollToResults();

  try {
    renderResults(await requestRecommendations(payload));
  } catch (error) {
    if (error.name === "AbortError") {
      showError("The request took too long", "NASA POWER did not answer in time. Wait a moment and try again.");
    } else if (error.status === 502) {
      showError("NASA climate data is unavailable", error.message, "FieldShift does not guess climate values, so no recommendations are shown. Try again shortly.");
    } else if (error.status === 400) {
      showError("The server could not use these details", error.message, "Adjust the form and try again.");
    } else if (error.status) {
      showError("Something went wrong on the server", error.message);
    } else {
      showError("Can't reach the FieldShift server", "Make sure the backend is running (npm start in the Backend folder) and that you opened this page at http://localhost:4000/index.html.");
    }
  } finally {
    button.disabled = false;
    button.textContent = "Get rotation options";
  }
}

/* ---------- Use my location ---------- */
function handleLocate() {
  if (!navigator.geolocation) {
    showError("Location not available", "This browser can't share your location. Enter the coordinates by hand.");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      $("latitude").value = pos.coords.latitude.toFixed(2);
      $("longitude").value = pos.coords.longitude.toFixed(2);
    },
    () => showError("Couldn't get your location", "Allow location access in your browser, or enter the coordinates by hand.")
  );
}

/* ---------- Hero climate snapshot (real data from GET /api/climate) ---------- */
async function loadSnapshot() {
  const { latitude, longitude, label } = CONFIG.snapshot;
  try {
    const response = await fetch(`/api/climate?latitude=${latitude}&longitude=${longitude}`);
    if (!response.ok) throw new Error("climate request failed");
    const data = await response.json();
    const s = data.summary || {};
    const range = data.dateRange || {};
    const days = Array.isArray(data.dailyObservations) ? data.dailyObservations.length : null;

    $("snapPeriod").textContent = `${label}, ${range.start || "?"} to ${range.end || "?"}`;
    $("snapTemp").textContent = `${fmt(s.averageTemperatureC, 1)} °C`;
    $("snapHum").textContent = `${fmtInt(s.averageRelativeHumidityPercent)}%`;
    $("snapDry").textContent = days ? `${s.dryDays} of ${days} days` : `${s.dryDays ?? "n/a"} days`;
    $("snapFoot").textContent = `Total rainfall ${fmtInt(s.totalPrecipitationMm)} mm. Historical observations, not a forecast.`;

    // Bars: temperature on a 0 to 40 °C scale, humidity in %, dry days as a share of the period.
    const bars = [
      ["snapTempBar", (s.averageTemperatureC / 40) * 100],
      ["snapHumBar", s.averageRelativeHumidityPercent],
      ["snapDryBar", days ? (s.dryDays / days) * 100 : NaN]
    ];
    requestAnimationFrame(() => {
      bars.forEach(([id, pct]) => {
        if (Number.isFinite(pct)) $(id).style.width = `${clampPct(pct)}%`;
      });
    });
  } catch (_) {
    $("snapPeriod").textContent = `${label}, climate data unavailable`;
    ["snapTemp", "snapHum", "snapDry"].forEach((id) => ($(id).textContent = "n/a"));
    $("snapFoot").textContent = "Start the backend to load NASA POWER data. FieldShift never shows made-up climate values.";
  }
}

/* ---------- Start ---------- */
buildForm();
$("farm-form").addEventListener("submit", handleSubmit);
$("locate").addEventListener("click", handleLocate);
loadSnapshot();
