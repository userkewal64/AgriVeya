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
    { value: "sandy-loam", label: "Sandy loam" },
    { value: "loam", label: "Loam" },
    { value: "silt", label: "Silt" },
    { value: "clay", label: "Clay" },
    { value: "clay-loam", label: "Clay loam" }
  ],
  crops: [
    { value: "rice", label: "Rice" },
    { value: "maize", label: "Maize" },
    { value: "wheat", label: "Wheat" },
    { value: "lentil", label: "Lentil" },
    { value: "mustard", label: "Mustard" },
    { value: "chickpea", label: "Chickpea" },
    { value: "millet", label: "Millet" },
    { value: "mung-bean", label: "Mung bean" }
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

const LANGUAGE_STORAGE_KEY = "agriVeyaLanguage";
let currentLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en";

const TRANSLATIONS = {
  en: {
    language: "Language", searchLocation: "Search for a farm location", search: "Search", searchHint: "Search is powered by OpenStreetMap.", searchPlaceholder: "e.g., Pokhara, Nepal",
    searching: "Searching for locations…", chooseLocation: "Choose a location", noLocations: "No matching places found. Try a town, district, or country.", locationSearchError: "Location search is unavailable. Enter coordinates manually.", selectedLocation: "Selected farm location: {name}", locationChanged: "Coordinates were edited; the selected location label was cleared.",
    soils: { sandy: "Sandy", "sandy-loam": "Sandy loam", loam: "Loam", silt: "Silt", clay: "Clay", "clay-loam": "Clay loam" },
    crops: { rice: "Rice", maize: "Maize", wheat: "Wheat", lentil: "Lentil", mustard: "Mustard", chickpea: "Chickpea", millet: "Millet", "mung-bean": "Mung bean" },
    priorities: { waterConservation: ["Water conservation", "Prefer crops that need less water."], climateResilience: ["Climate resilience", "Prefer crops that cope with heat and dry spells."], soilHealth: ["Soil health", "Prefer rotations that rebuild the soil, such as legumes after cereals."] },
    levels: { low: "Low", medium: "Medium", high: "High" },
    validation: { latitude: "Latitude must be a number between -90 and 90.", longitude: "Longitude must be a number between -180 and 180.", dates: "Set both a start and an end date, or leave both empty.", dateOrder: "The start date must be before the end date." },
    loadingTitle: "Getting climate data from NASA POWER", loadingText: "This usually takes a few seconds. Your options will appear here.", checkDetails: "Check your details", working: "Working…", getOptions: "Get rotation options",
    requestTimeout: "The request took too long", nasaUnavailable: "NASA climate data is unavailable", serverDetails: "The server could not use these details", serverError: "Something went wrong on the server", serverOffline: "Can't reach the AgriVeya server", offlineHelp: "Make sure the backend is running and you opened this page at http://localhost:4000/index.html.",
    useLocation: "Use my current location", locating: "Finding your current location…", locationUnavailable: "Location not available", locationUnsupported: "This browser can't share your location. Enter the coordinates by hand.", locationDenied: "Couldn't get your location", locationDeniedHelp: "Allow location access in your browser, or enter the coordinates by hand.",
    currentLocation: "Your current location", findingClimate: "Finding your local historical climate…", climateUnavailable: "Local climate data unavailable", historical: "Historical observations, not a forecast.",
    climate: { title: "What the climate has done here", temperature: "Average temperature", rainfall: "Total rainfall", humidity: "Average humidity", sunlight: "Average sunlight", dryDays: "Dry days", period: "NASA POWER observations from {start} to {end}.", dryUnit: "under 1 mm" },
    recommendation: { options: "Your three rotation options for the next season", best: "Best match", option: "Option {number}", why: "Why it ranked here", fits: "Why it fits", risks: "Risks and trade-offs", breakdown: "How the score was built", points: "points", strong: "Strong fit", moderate: "Moderate fit", weak: "Weak fit", noOptions: "No suitable options found", noOptionsHelp: "The rules did not produce a recommendation for this combination. Try a different soil texture or last crop." },
    missingClimate: "Some climate values were missing, so scores that depend on them are less certain.",
    sourceAttribution: "Location search: © OpenStreetMap contributors"
  },
  ne: {
    language: "भाषा", searchLocation: "खेतको स्थान खोज्नुहोस्", search: "खोज्नुहोस्", searchHint: "खोज OpenStreetMap द्वारा सञ्चालित छ।", searchPlaceholder: "जस्तै: पोखरा, नेपाल",
    searching: "स्थान खोजिँदैछ…", chooseLocation: "स्थान छान्नुहोस्", noLocations: "मिल्ने स्थान भेटिएन। सहर, जिल्ला वा देश लेख्नुहोस्।", locationSearchError: "स्थान खोज सेवा उपलब्ध छैन। निर्देशांक स्वयं लेख्नुहोस्।", selectedLocation: "छानिएको खेतको स्थान: {name}", locationChanged: "निर्देशांक परिवर्तन गरियो; छानिएको स्थानको नाम हटाइयो।",
    soils: { sandy: "बलौटे", "sandy-loam": "बलौटे दोमट", loam: "दोमट", silt: "पाँगो", clay: "चिम्टाइलो", "clay-loam": "चिम्टाइलो दोमट" },
    crops: { rice: "धान", maize: "मकै", wheat: "गहुँ", lentil: "मसुरो", mustard: "तोरी", chickpea: "चना", millet: "कोदो", "mung-bean": "मुग" },
    priorities: { waterConservation: ["पानी बचत", "कम पानी चाहिने बालीलाई प्राथमिकता दिनुहोस्।"], climateResilience: ["जलवायु सहनशीलता", "तातो र सुख्खा समय सहन सक्ने बालीलाई प्राथमिकता दिनुहोस्।"], soilHealth: ["माटोको स्वास्थ्य", "अन्नबालीपछि कोसेबाली जस्ता माटो सुधार्ने चक्रलाई प्राथमिकता दिनुहोस्।"] },
    levels: { low: "कम", medium: "मध्यम", high: "उच्च" },
    validation: { latitude: "अक्षांश -90 र 90 बीचको संख्या हुनुपर्छ।", longitude: "देशान्तर -180 र 180 बीचको संख्या हुनुपर्छ।", dates: "सुरु र अन्त्य दुवै मिति राख्नुहोस्, वा दुवै खाली छोड्नुहोस्।", dateOrder: "सुरु मिति अन्त्य मितिभन्दा अगाडि हुनुपर्छ।" },
    loadingTitle: "NASA POWER बाट जलवायु तथ्याङ्क लिइँदैछ", loadingText: "यसमा केही सेकेन्ड लाग्न सक्छ। विकल्प यहाँ देखिनेछन्।", checkDetails: "विवरण जाँच्नुहोस्", working: "काम हुँदैछ…", getOptions: "बाली चक्र विकल्प पाउनुहोस्",
    requestTimeout: "अनुरोधले धेरै समय लियो", nasaUnavailable: "NASA जलवायु तथ्याङ्क उपलब्ध छैन", serverDetails: "सर्भरले यी विवरण प्रयोग गर्न सकेन", serverError: "सर्भरमा समस्या आयो", serverOffline: "AgriVeya सर्भरमा पुग्न सकिएन", offlineHelp: "ब्याकएन्ड चलिरहेको छ र यो पृष्ठ http://localhost:4000/index.html बाट खोलिएको छ भनी जाँच्नुहोस्।",
    useLocation: "मेरो हालको स्थान प्रयोग गर्नुहोस्", locating: "हालको स्थान खोजिँदैछ…", locationUnavailable: "स्थान उपलब्ध छैन", locationUnsupported: "यो ब्राउजरले स्थान साझा गर्न सक्दैन। निर्देशांक स्वयं लेख्नुहोस्।", locationDenied: "स्थान पाउन सकिएन", locationDeniedHelp: "ब्राउजरमा स्थान अनुमति दिनुहोस्, वा निर्देशांक स्वयं लेख्नुहोस्।",
    currentLocation: "तपाईंको हालको स्थान", findingClimate: "तपाईंको स्थानीय ऐतिहासिक जलवायु खोजिँदैछ…", climateUnavailable: "स्थानीय जलवायु तथ्याङ्क उपलब्ध छैन", historical: "ऐतिहासिक अवलोकन, पूर्वानुमान होइन।",
    climate: { title: "यहाँको जलवायुको इतिहास", temperature: "औसत तापक्रम", rainfall: "कुल वर्षा", humidity: "औसत आर्द्रता", sunlight: "औसत घाम", dryDays: "सुख्खा दिन", period: "NASA POWER अवलोकन {start} देखि {end} सम्म।", dryUnit: "१ मिमीभन्दा कम" },
    recommendation: { options: "अर्को मौसमका तीन बाली चक्र विकल्प", best: "उत्तम मिलान", option: "विकल्प {number}", why: "यो स्थानमा किन", fits: "किन मिल्छ", risks: "जोखिम र सम्झौता", breakdown: "स्कोर कसरी बन्यो", points: "अंक", strong: "राम्रो मिलान", moderate: "मध्यम मिलान", weak: "कमजोर मिलान", noOptions: "उपयुक्त विकल्प भेटिएन", noOptionsHelp: "यस संयोजनका लागि नियमले सिफारिस दिएन। फरक माटो वा अघिल्लो बाली छान्नुहोस्।" },
    missingClimate: "केही जलवायु मान छुटेका छन्, त्यसैले ती मानमा आधारित स्कोर कम निश्चित छन्।", sourceAttribution: "स्थान खोज: © OpenStreetMap contributors"
  },
  hi: {
    language: "भाषा", searchLocation: "खेत का स्थान खोजें", search: "खोजें", searchHint: "खोज OpenStreetMap द्वारा संचालित है।", searchPlaceholder: "उदाहरण: पोखरा, नेपाल",
    searching: "स्थान खोजा जा रहा है…", chooseLocation: "स्थान चुनें", noLocations: "मिलता-जुलता स्थान नहीं मिला। शहर, जिला या देश लिखें।", locationSearchError: "स्थान खोज सेवा उपलब्ध नहीं है। निर्देशांक स्वयं दर्ज करें।", selectedLocation: "चुना गया खेत स्थान: {name}", locationChanged: "निर्देशांक बदले गए; चुने गए स्थान का नाम हटा दिया गया।",
    soils: { sandy: "रेतीली", "sandy-loam": "बलुई दोमट", loam: "दोमट", silt: "गादयुक्त", clay: "चिकनी", "clay-loam": "चिकनी दोमट" },
    crops: { rice: "धान", maize: "मक्का", wheat: "गेहूँ", lentil: "मसूर", mustard: "सरसों", chickpea: "चना", millet: "बाजरा", "mung-bean": "मूंग" },
    priorities: { waterConservation: ["जल संरक्षण", "कम पानी चाहने वाली फसलों को प्राथमिकता दें।"], climateResilience: ["जलवायु सहनशीलता", "गर्मी और सूखे को सहने वाली फसलों को प्राथमिकता दें।"], soilHealth: ["मिट्टी का स्वास्थ्य", "अनाज के बाद दलहन जैसी मिट्टी सुधारने वाली फसल-चक्र को प्राथमिकता दें।"] },
    levels: { low: "कम", medium: "मध्यम", high: "उच्च" },
    validation: { latitude: "अक्षांश -90 और 90 के बीच होना चाहिए।", longitude: "देशांतर -180 और 180 के बीच होना चाहिए।", dates: "आरंभ और अंत दोनों तिथियाँ भरें, या दोनों खाली छोड़ें।", dateOrder: "आरंभ तिथि अंत तिथि से पहले होनी चाहिए।" },
    loadingTitle: "NASA POWER से जलवायु डेटा लिया जा रहा है", loadingText: "इसमें कुछ सेकंड लग सकते हैं। विकल्प यहाँ दिखेंगे।", checkDetails: "विवरण जाँचें", working: "काम हो रहा है…", getOptions: "फसल-चक्र विकल्प पाएँ",
    requestTimeout: "अनुरोध में बहुत समय लगा", nasaUnavailable: "NASA जलवायु डेटा उपलब्ध नहीं है", serverDetails: "सर्वर इन विवरणों का उपयोग नहीं कर सका", serverError: "सर्वर में समस्या हुई", serverOffline: "AgriVeya सर्वर तक नहीं पहुँचा जा सका", offlineHelp: "जाँचें कि बैकएंड चल रहा है और यह पृष्ठ http://localhost:4000/index.html से खुला है।",
    useLocation: "मेरा वर्तमान स्थान उपयोग करें", locating: "वर्तमान स्थान खोजा जा रहा है…", locationUnavailable: "स्थान उपलब्ध नहीं है", locationUnsupported: "यह ब्राउज़र स्थान साझा नहीं कर सकता। निर्देशांक स्वयं दर्ज करें।", locationDenied: "स्थान नहीं मिल सका", locationDeniedHelp: "ब्राउज़र में स्थान अनुमति दें, या निर्देशांक स्वयं दर्ज करें।",
    currentLocation: "आपका वर्तमान स्थान", findingClimate: "आपका स्थानीय ऐतिहासिक जलवायु डेटा खोजा जा रहा है…", climateUnavailable: "स्थानीय जलवायु डेटा उपलब्ध नहीं है", historical: "ऐतिहासिक अवलोकन, पूर्वानुमान नहीं।",
    climate: { title: "यहाँ के जलवायु का इतिहास", temperature: "औसत तापमान", rainfall: "कुल वर्षा", humidity: "औसत आर्द्रता", sunlight: "औसत धूप", dryDays: "शुष्क दिन", period: "NASA POWER अवलोकन {start} से {end} तक।", dryUnit: "1 मिमी से कम" },
    recommendation: { options: "अगले मौसम के लिए तीन फसल-चक्र विकल्प", best: "सर्वोत्तम मेल", option: "विकल्प {number}", why: "यह स्थान क्यों मिला", fits: "क्यों उपयुक्त है", risks: "जोखिम और समझौते", breakdown: "स्कोर कैसे बना", points: "अंक", strong: "मजबूत मेल", moderate: "मध्यम मेल", weak: "कमज़ोर मेल", noOptions: "उपयुक्त विकल्प नहीं मिला", noOptionsHelp: "इस संयोजन के लिए नियमों ने सिफारिश नहीं दी। अलग मिट्टी या पिछली फसल चुनें।" },
    missingClimate: "कुछ जलवायु मान उपलब्ध नहीं थे, इसलिए उन पर आधारित स्कोर कम निश्चित हैं।", sourceAttribution: "स्थान खोज: © OpenStreetMap contributors"
  }
};

function t(key, variables = {}) {
  const value = key.split(".").reduce((item, part) => item && item[part], TRANSLATIONS[currentLanguage]) || key.split(".").reduce((item, part) => item && item[part], TRANSLATIONS.en) || key;
  return typeof value === "string" ? value.replace(/\{(\w+)\}/g, (_, name) => variables[name] ?? `{${name}}`) : value;
}

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
  const previousValues = { soil: $("soilType").value, crop: $("previousCrop").value };
  $("soilType").replaceChildren();
  $("previousCrop").replaceChildren();
  fillSelect($("soilType"), CONFIG.soilTypes.map((item) => ({ ...item, label: t(`soils.${item.value}`) })));
  fillSelect($("previousCrop"), CONFIG.crops.map((item) => ({ ...item, label: t(`crops.${item.value}`) })));
  $("soilType").value = previousValues.soil || "loam";
  $("previousCrop").value = previousValues.crop || "rice";

  const box = $("priorities");
  box.replaceChildren();
  CONFIG.priorities.forEach((p) => {
    const translatedPriority = t(`priorities.${p.key}`);
    box.append(
      el(
        "div",
        { class: "priority", role: "radiogroup", "aria-label": p.label },
        el("div", { class: "priority-name", text: translatedPriority[0] }),
        el("div", { class: "priority-hint", text: translatedPriority[1] }),
        el(
          "div",
          { class: "segmented" },
          CONFIG.priorityLevels.map((level) => {
            const input = el("input", { type: "radio", name: p.key, value: level.value });
            if (level.value === CONFIG.defaultPriorityLevel) input.checked = true;
            return el("label", {}, input, el("span", { text: t(`levels.${level.value}`) }));
          })
        )
      )
    );
  });
}

const STATIC_TEXT = {
  "FieldShift": "AgriVeya",
  "Climate-smart rotation": "Smarter Crop Decisions, Guided by Nature.",
  "Home": "Home", "How it works": "How it works", "Planner": "Planner", "About the data": "About the data", "Plan my season": "Plan my season",
  "Built on NASA POWER climate data": "Built on NASA POWER climate data", "Climate snapshot": "Climate snapshot", "Average temperature": "Average temperature", "Average humidity": "Average humidity", "Dry days": "Dry days", "Historical observations, not a forecast.": "Historical observations, not a forecast.",
  "How AgriVeya decides": "How AgriVeya decides", "Plan your next season": "Plan your next season", "Farm location": "Farm location", "Latitude": "Latitude", "Longitude": "Longitude", "Your field": "Your field", "Soil texture": "Soil texture", "Crop grown last season": "Crop grown last season", "What matters most": "What matters most", "Climate period (optional)": "Climate period (optional)", "Start": "Start", "End": "End",
  "Data. Rules. Rotation.": "Data. Rules. Rotation.", "Ready for the next season?": "Ready for the next season?"
};

const STATIC_TRANSLATIONS = {
  ne: { "Home": "गृहपृष्ठ", "How it works": "कसरी काम गर्छ", "Planner": "योजना", "About the data": "तथ्याङ्कबारे", "Plan my season": "मेरो मौसम योजना", "Built on NASA POWER climate data": "NASA POWER जलवायु तथ्याङ्कमा आधारित", "Climate snapshot": "जलवायु झलक", "Average temperature": "औसत तापक्रम", "Average humidity": "औसत आर्द्रता", "Dry days": "सुख्खा दिन", "Historical observations, not a forecast.": "ऐतिहासिक अवलोकन, पूर्वानुमान होइन।", "How AgriVeya decides": "AgriVeya कसरी निर्णय गर्छ", "Plan the next season.": "अर्को मौसमको योजना बनाउनुहोस्।", "Grow with the climate.": "जलवायुसँगै बढ्नुहोस्।", "NASA climate measures": "NASA जलवायु मापन", "crops compared": "बाली तुलना", "ranked rotations": "क्रमबद्ध चक्र", "days of observations by default": "पूर्वनिर्धारित अवलोकन दिन", "NASA climate record": "NASA जलवायु अभिलेख", "Soil and last crop": "माटो र अघिल्लो बाली", "Your priorities": "तपाईंका प्राथमिकता", "Ranked rotations": "क्रमबद्ध बाली चक्र", "Where the answer comes from": "उत्तर कहाँबाट आउँछ", "Plan your next season": "अर्को मौसमको योजना बनाउनुहोस्", "Farm location": "खेतको स्थान", "Latitude": "अक्षांश", "Longitude": "देशान्तर", "Your field": "तपाईंको खेत", "Soil texture": "माटोको बनावट", "Crop grown last season": "गत मौसमको बाली", "What matters most": "के सबैभन्दा महत्त्वपूर्ण छ", "Climate period (optional)": "जलवायु अवधि (वैकल्पिक)", "Leave empty to use the last complete calendar year. To choose your own period, set both dates.": "गत पूरा पात्रो वर्ष प्रयोग गर्न खाली छोड्नुहोस्। आफ्नै अवधि छान्न दुवै मिति राख्नुहोस्।", "Start": "सुरु", "End": "अन्त्य", "Your rotation options will appear here": "तपाईंका बाली चक्र विकल्प यहाँ देखिनेछन्", "Data. Rules. Rotation.": "तथ्याङ्क। नियम। बाली चक्र।", "What AgriVeya does not do": "AgriVeya ले के गर्दैन", "Ready for the next season?": "अर्को मौसमका लागि तयार?", "It takes one form and a few seconds.": "एउटा फाराम र केही सेकेन्ड मात्र लाग्छ।" },
  hi: { "Home": "मुखपृष्ठ", "How it works": "यह कैसे काम करता है", "Planner": "योजनाकार", "About the data": "डेटा के बारे में", "Plan my season": "मेरे मौसम की योजना", "Built on NASA POWER climate data": "NASA POWER जलवायु डेटा पर आधारित", "Climate snapshot": "जलवायु झलक", "Average temperature": "औसत तापमान", "Average humidity": "औसत आर्द्रता", "Dry days": "शुष्क दिन", "Historical observations, not a forecast.": "ऐतिहासिक अवलोकन, पूर्वानुमान नहीं।", "How AgriVeya decides": "AgriVeya कैसे निर्णय करता है", "Plan the next season.": "अगले मौसम की योजना बनाएँ।", "Grow with the climate.": "जलवायु के साथ उगाएँ।", "NASA climate measures": "NASA जलवायु माप", "crops compared": "फसलों की तुलना", "ranked rotations": "क्रमबद्ध चक्र", "days of observations by default": "डिफ़ॉल्ट अवलोकन दिन", "NASA climate record": "NASA जलवायु रिकॉर्ड", "Soil and last crop": "मिट्टी और पिछली फसल", "Your priorities": "आपकी प्राथमिकताएँ", "Ranked rotations": "क्रमबद्ध फसल-चक्र", "Where the answer comes from": "उत्तर कहाँ से आता है", "Plan your next season": "अगले मौसम की योजना बनाएँ", "Farm location": "खेत का स्थान", "Latitude": "अक्षांश", "Longitude": "देशांतर", "Your field": "आपका खेत", "Soil texture": "मिट्टी की बनावट", "Crop grown last season": "पिछले मौसम की फसल", "What matters most": "सबसे महत्वपूर्ण क्या है", "Climate period (optional)": "जलवायु अवधि (वैकल्पिक)", "Leave empty to use the last complete calendar year. To choose your own period, set both dates.": "पिछला पूरा कैलेंडर वर्ष उपयोग करने के लिए खाली छोड़ें। अपनी अवधि चुनने के लिए दोनों तिथियाँ भरें।", "Start": "आरंभ", "End": "अंत", "Your rotation options will appear here": "आपके फसल-चक्र विकल्प यहाँ दिखेंगे", "Data. Rules. Rotation.": "डेटा। नियम। फसल-चक्र।", "What AgriVeya does not do": "AgriVeya क्या नहीं करता", "Ready for the next season?": "अगले मौसम के लिए तैयार?", "It takes one form and a few seconds.": "एक फॉर्म और कुछ सेकंड लगते हैं।" }
};

function translateStaticContent() {
  const translations = STATIC_TRANSLATIONS[currentLanguage] || {};
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    const source = node.__agriVeyaSource || node.nodeValue.trim();
    if (!source) return;
    node.__agriVeyaSource = source;
    const english = STATIC_TEXT[source] || source;
    const translation = translations[english];
    const output = translation || english;
    node.nodeValue = node.nodeValue.replace(node.nodeValue.trim(), output);
  });
  document.documentElement.lang = currentLanguage;
  document.title = currentLanguage === "en" ? "AgriVeya — Smarter Crop Decisions, Guided by Nature." : "AgriVeya";
  $("language").value = currentLanguage;
}

function changeLanguage(language) {
  currentLanguage = TRANSLATIONS[language] ? language : "en";
  localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
  translateStaticContent();
  buildForm();
  updateLocationSearchText();
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
        el("h3", { text: t("loadingTitle") }),
        el("p", { text: t("loadingText") })
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
      text: period.start && period.end ? t("climate.period", period) : "NASA POWER observations."
    }),
    el(
      "dl",
      { class: "tiles" },
      tile(t("climate.temperature"), fmt(s.averageTemperatureC, 1), "°C"),
      tile(t("climate.rainfall"), fmtInt(s.totalPrecipitationMm), "mm"),
      tile(t("climate.humidity"), fmtInt(s.averageRelativeHumidityPercent), "%"),
      tile(t("climate.sunlight"), fmt(s.averageSolarRadiationMjM2Day, 1), "MJ/m²/day"),
      tile(t("climate.dryDays"), s.dryDays ?? "n/a", t("climate.dryUnit"))
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
  if (percent === null) return "n/a";
  if (percent >= 75) return t("recommendation.strong");
  if (percent >= 55) return t("recommendation.moderate");
  return t("recommendation.weak");
}

function renderBreakdown(rec) {
  const raw = pick(rec, ["scoreBreakdown", "breakdown", "components", "scores", "scoreComponents"]);
  if (!raw || typeof raw !== "object") return null;

  const rows = [];
  for (const [key, value] of Object.entries(raw)) {
    const num = typeof value === "number" ? value : pick(value, ["score", "value", "points"]);
    if (typeof num !== "number" || !Number.isFinite(num)) continue;
    const maximum = { climate: 40, soil: 20, rotation: 20, farmerPriorities: 15, rotationBenefits: 5 }[key] || 100;
    const pct = clampPct((num / maximum) * 100);
    rows.push(
      el(
        "div",
        { class: "breakdown-row" },
        el("span", { text: humanize(key) }),
        el("div", { class: "track" }, el("i", { style: `width:${pct}%` })),
        el("span", { class: "num", text: `${fmt(num, 1)} / ${maximum}` })
      )
    );
  }

  return el("details", { class: "breakdown" }, el("summary", { text: t("recommendation.breakdown") }), rows.length ? rows : renderAny(raw));
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
        el("span", { class: "badge", text: index === 0 ? t("recommendation.best") : t("recommendation.option", { number: index + 1 }) }),
        el("div", { class: "sequence" }, chips)
      ),
      el("div", { class: "score" }, ring, el("div", { class: "score-label", text: fitLabel(percent) }))
    ),
    explanation ? el("div", { class: "explain" }, el("strong", { text: t("recommendation.why") }), toText(explanation)) : null,
    el(
      "div",
      { class: "cols" },
      el("div", {}, el("h4", { text: t("recommendation.fits") }), benefits.length ? bulletList(benefits) : el("p", { text: "—" })),
      el("div", { class: "risks" }, el("h4", { text: t("recommendation.risks") }), risks.length ? bulletList(risks) : el("p", { text: "—" }))
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
      data.missingClimateData && (data.missingClimateData.daysWithAnyMissingValue > 0 || Object.values(data.missingClimateData.missingValuesByParameter || {}).some((count) => count > 0))
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
        el("h3", { text: t("recommendation.noOptions") }),
        el("p", { text: t("recommendation.noOptionsHelp") })
      )
    );
  } else {
    stack.append(el("h3", { class: "results-title", text: t("recommendation.options") }));
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
    throw new Error(t("validation.latitude"));
  }
  if ($("longitude").value === "" || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new Error(t("validation.longitude"));
  }
  if ((start && !end) || (!start && end)) throw new Error(t("validation.dates"));
  if (start && end && start > end) throw new Error(t("validation.dateOrder"));

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
    showError(t("checkDetails"), error.message);
    return;
  }

  button.disabled = true;
  button.textContent = t("working");
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
    button.textContent = t("getOptions");
  }
}

/* ---------- Location: homepage and planner stay independent ---------- */
let detectedLocation = null;
let selectedFarmLocation = null;

function setPlannerCoordinates(latitude, longitude, label) {
  $("latitude").value = Number(latitude).toFixed(5);
  $("longitude").value = Number(longitude).toFixed(5);
  selectedFarmLocation = label || null;
  $("selectedLocation").textContent = label ? t("selectedLocation", { name: label }) : "";
}

function requestCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("unsupported"));
    navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 });
  });
}

async function handleLocate() {
  $("locate").disabled = true;
  $("locate").textContent = t("locating");
  try {
    const position = detectedLocation ? { coords: detectedLocation } : await requestCurrentLocation();
    setPlannerCoordinates(position.coords.latitude, position.coords.longitude, t("currentLocation"));
  } catch (error) {
    showError(t("locationUnavailable"), error.message === "unsupported" ? t("locationUnsupported") : t("locationDeniedHelp"));
  } finally {
    $("locate").disabled = false;
    $("locate").textContent = t("useLocation");
  }
}

/* ---------- Hero climate snapshot (real data from GET /api/climate) ---------- */
async function loadSnapshot(latitude, longitude, label) {
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
    $("snapPeriod").textContent = `${label}, ${t("climateUnavailable")}`;
    ["snapTemp", "snapHum", "snapDry"].forEach((id) => ($(id).textContent = "n/a"));
    $("snapFoot").textContent = "AgriVeya never shows made-up climate values.";
  }
}

async function detectHomepageLocation() {
  $("snapPeriod").textContent = t("findingClimate");
  try {
    const position = await requestCurrentLocation();
    detectedLocation = { latitude: position.coords.latitude, longitude: position.coords.longitude };
    await loadSnapshot(detectedLocation.latitude, detectedLocation.longitude, `${t("currentLocation")} (${detectedLocation.latitude.toFixed(2)}, ${detectedLocation.longitude.toFixed(2)})`);
  } catch (_) {
    $("snapPeriod").textContent = t("locationUnavailable");
    $("snapFoot").textContent = `${t("historical")} ${t("locationDeniedHelp")}`;
    ["snapTemp", "snapHum", "snapDry"].forEach((id) => ($(id).textContent = "n/a"));
  }
}

function updateLocationSearchText() {
  $("locationSearch").placeholder = t("searchPlaceholder");
  $("locationSearchStatus").textContent = t("searchHint");
  $("locate").textContent = t("useLocation");
  $("submit").textContent = t("getOptions");
}

function clearSelectedFarmLocation() {
  if (!selectedFarmLocation) return;
  selectedFarmLocation = null;
  $("selectedLocation").textContent = t("locationChanged");
}

function renderLocationResults(results) {
  const list = $("locationResults");
  list.replaceChildren();
  results.forEach((result) => {
    const button = el("button", { type: "button", class: "location-result" }, el("strong", { text: result.name }), el("span", { text: result.context || result.displayName }));
    button.addEventListener("click", () => {
      setPlannerCoordinates(result.latitude, result.longitude, result.displayName);
      list.replaceChildren();
      $("locationSearchStatus").textContent = t("sourceAttribution");
    });
    list.append(el("li", {}, button));
  });
}

async function searchFarmLocation() {
  const query = $("locationSearch").value.trim();
  if (query.length < 2) {
    $("locationSearchStatus").textContent = t("noLocations");
    return;
  }
  $("searchLocation").disabled = true;
  $("locationSearchStatus").textContent = t("searching");
  $("locationResults").replaceChildren();
  try {
    const response = await fetch(`/api/locations/search?q=${encodeURIComponent(query)}`);
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || "search failed");
    if (!body.results.length) {
      $("locationSearchStatus").textContent = t("noLocations");
      return;
    }
    $("locationSearchStatus").textContent = t("chooseLocation");
    renderLocationResults(body.results);
  } catch (_) {
    $("locationSearchStatus").textContent = t("locationSearchError");
  } finally {
    $("searchLocation").disabled = false;
  }
}

/* ---------- Hero: pointer parallax on the farm-tech scene ---------- */
(function setupParallax() {
  const hero = document.querySelector(".hero");
  const layers = Array.from(document.querySelectorAll("#hero-art .layer"));
  const canHover = window.matchMedia("(hover: hover)").matches;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!hero || !layers.length || !canHover || reduce) return;

  let targetX = 0, targetY = 0, currentX = 0, currentY = 0, frame = null;

  function tick() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    layers.forEach((layer) => {
      const depth = Number(layer.dataset.depth) || 0;
      layer.style.transform = `translate(${(-currentX * depth).toFixed(2)}px, ${(-currentY * depth * 0.5).toFixed(2)}px)`;
    });
    const settling = Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001;
    frame = settling ? requestAnimationFrame(tick) : null;
  }
  function start() { if (!frame) frame = requestAnimationFrame(tick); }

  hero.addEventListener("pointermove", (e) => {
    const box = hero.getBoundingClientRect();
    targetX = ((e.clientX - box.left) / box.width - 0.5) * 2;
    targetY = ((e.clientY - box.top) / box.height - 0.5) * 2;
    start();
  });
  hero.addEventListener("pointerleave", () => { targetX = 0; targetY = 0; start(); });
})();

/* ---------- Optional real photo for the hero ----------
   Put a photo at Frontend/images/hero.jpg and it fades in over the
   illustration. If the file is missing, the illustration stays. */
(function setupHeroPhoto() {
  const hero = document.querySelector(".hero");
  const img = $("hero-photo");
  if (!hero || !img) return;
  const probe = new Image();
  probe.onload = () => {
    img.src = probe.src;
    img.hidden = false;
    requestAnimationFrame(() => hero.classList.add("has-photo"));
  };
  probe.src = "images/hero.jpg";
})();

/* ---------- Interactive "where the answer comes from" scene ---------- */
(function setupScene() {
  const hotspots = Array.from(document.querySelectorAll("#scene-svg .hot"));
  if (!hotspots.length) return;

  const STEPS = [
    {
      title: "NASA POWER climate record",
      text: "FieldShift asks NASA POWER for daily temperature, rainfall, humidity and sunlight at your coordinates. It is a historical record of what the climate did, not a forecast."
    },
    {
      title: "Rain, dry days and humidity",
      text: "Total rainfall and the number of dry days (days with under 1 mm of rain) show how much water a season usually offers. They shape which crops look suitable."
    },
    {
      title: "Soil texture",
      text: "Satellite data is not a soil measurement, so you tell FieldShift your soil texture. Each crop profile says which textures it suits."
    },
    {
      title: "Last season's crop",
      text: "What you grew last season matters. Its crop family and season decide which next crops give a real rotation instead of repeating the same family."
    },
    {
      title: "Ranked rotation options",
      text: "Climate fit, soil match, rotation benefit and your priorities are combined in a weighted score. You get three options in order, each with reasons and risks."
    }
  ];

  const stepEl = $("sceneStep");
  const titleEl = $("sceneTitle");
  const textEl = $("sceneText");
  const dotsEl = $("sceneDots");
  const dots = [];

  function select(index) {
    const step = STEPS[index];
    stepEl.textContent = `Point ${index + 1} of ${STEPS.length}`;
    titleEl.textContent = step.title;
    textEl.textContent = step.text;
    hotspots.forEach((h) => h.classList.toggle("active", Number(h.dataset.step) === index));
    dots.forEach((d, i) => d.setAttribute("aria-selected", String(i === index)));
  }

  STEPS.forEach((step, i) => {
    const dot = el("button", { type: "button", role: "tab", "aria-label": step.title, "aria-selected": "false" });
    dot.addEventListener("click", () => select(i));
    dots.push(dot);
    dotsEl.append(dot);
  });

  hotspots.forEach((h) => {
    const index = Number(h.dataset.step);
    h.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") select(index); });
    h.addEventListener("click", () => select(index));
    h.addEventListener("focus", () => select(index));
    h.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(index); }
    });
  });

  select(0);
})();

/* ---------- Start ---------- */
translateStaticContent();
buildForm();
updateLocationSearchText();
$("farm-form").addEventListener("submit", handleSubmit);
$("locate").addEventListener("click", handleLocate);
$("language").addEventListener("change", (event) => changeLanguage(event.target.value));
$("searchLocation").addEventListener("click", searchFarmLocation);
$("locationSearch").addEventListener("keydown", (event) => {
  if (event.key === "Enter") { event.preventDefault(); searchFarmLocation(); }
});
$("latitude").addEventListener("input", clearSelectedFarmLocation);
$("longitude").addEventListener("input", clearSelectedFarmLocation);
detectHomepageLocation();
