"use strict";

const API_BASE_URL = "https://agriveya.onrender.com";
const apiUrl = (path) => `${API_BASE_URL}${path}`;

const LANGUAGE_TEXT = {
  ne: {
    "Home": "गृहपृष्ठ", "How it works": "कसरी काम गर्छ", "Planner": "योजना", "About the data": "तथ्याङ्कबारे", "Plan my season": "मेरो मौसम योजना बनाउनुहोस्",
    "Climate-smart rotation": "जलवायु-स्मार्ट बाली चक्र", "Built on NASA POWER climate data": "NASA POWER जलवायु तथ्याङ्क",
    "Plan the next season.": "अर्को मौसममा के लगाउने?", "Grow with the climate.": "जलवायु हेरेर योजना बनाउनुहोस्।",
    "Climate observations, your soil, and crop preferences help rank practical annual plans for your field.": "जलवायु अवलोकन, माटो र तपाईंको रोजाइका बालीले खेतका लागि व्यावहारिक वार्षिक योजना क्रमबद्ध गर्न मद्दत गर्छन्।",
    "Choose your location and field details to compare regional crop rotations.": "क्षेत्रअनुसारका बाली चक्र तुलना गर्न स्थान र खेतको विवरण छान्नुहोस्।",
    "Clear rules connect your location, soil and priorities to each crop plan.": "स्पष्ट नियमले स्थान, माटो र प्राथमिकतालाई हरेक बाली योजनासँग जोड्छ।",
    "Historical temperature, rainfall, humidity and sunlight for your location.": "तपाईंको स्थानको ऐतिहासिक तापक्रम, वर्षा, आर्द्रता र घामको तथ्याङ्क।",
    "Your soil, local climate, and preferred crops inform each annual plan.": "माटो, स्थानीय जलवायु र रोजाइका बालीले हरेक वार्षिक योजनालाई दिशा दिन्छन्।",
    "Choose what matters most: water, climate resilience or soil health.": "पानी, जलवायु सहनशीलता वा माटोको स्वास्थ्यमध्ये महत्त्वपूर्ण कुरा छान्नुहोस्।",
    "Compare crop plans with clear benefits, scores and risks.": "स्पष्ट फाइदा, अङ्क र जोखिमसहितका बाली योजना तुलना गर्नुहोस्।",
    "Highlight this plan": "यो योजना हाइलाइट गर्नुहोस्", "Highlighted plan": "हाइलाइट गरिएको योजना",
    "Plan my season": "मेरो मौसम योजना बनाउनुहोस्", "How it works": "कसरी काम गर्छ", "Climate snapshot": "जलवायु झलक",
    "Average temperature": "औसत तापक्रम", "Average humidity": "औसत आर्द्रता", "Dry days": "सुख्खा दिन", "Historical observations, not a forecast.": "ऐतिहासिक तथ्याङ्क, पूर्वानुमान होइन।",
    "NASA climate measures": "NASA जलवायु मापन", "crops compared": "बालीहरूको तुलना", "ranked rotations": "क्रमबद्ध बाली चक्र", "days of observations by default": "दिनको तथ्याङ्क पूर्वनिर्धारित",
    "How AgriVeya decides": "AgriVeyaले कसरी निर्णय गर्छ", "Every score comes from the same simple, open rules. You can see which facts pushed a crop up or down.": "हरेक अङ्क सरल र खुला नियमबाट आउँछ। कुन तथ्यले बालीको स्तर बढायो वा घटायो हेर्न सक्नुहुन्छ।",
    "NASA climate record": "NASA जलवायु अभिलेख", "Temperature, rainfall, humidity and sunlight for your exact coordinates, taken from NASA POWER.": "तपाईंका निर्देशाङ्कका तापक्रम, वर्षा, आर्द्रता र घामको NASA POWER तथ्याङ्क।",
    "Soil and crop preferences": "माटो र बालीका प्राथमिकता",
    "Your priorities": "तपाईंका प्राथमिकता", "Say how much water saving, climate resilience and soil health matter to you. The ranking shifts with you.": "पानी बचत, जलवायु सहनशीलता र माटोको स्वास्थ्यको महत्त्व छान्नुहोस्। क्रम त्यहीअनुसार बदलिन्छ।",
    "Ranked rotations": "क्रमबद्ध बाली चक्र", "Three annual rotation options to compare, each with timing, risks and a clear score.": "समय, जोखिम र स्पष्ट अङ्कसहित तुलना गर्न तीन वार्षिक बाली चक्र विकल्प।",
    "Plan your next season": "अर्को मौसमको योजना बनाउनुहोस्", "Enter your farm details. AgriVeya fetches the climate record for your coordinates and ranks your options.": "खेतको विवरण भर्नुहोस्। AgriVeya ले निर्देशाङ्कअनुसार जलवायु तथ्याङ्क ल्याएर विकल्प क्रमबद्ध गर्छ।",
    "Farm location": "खेतको स्थान", "Search for a place": "स्थान खोज्नुहोस्", "City, district, or country": "सहर, जिल्ला वा देश",
    "Latitude": "अक्षांश", "Longitude": "देशान्तर", "Use my current location": "मेरो हालको स्थान प्रयोग गर्नुहोस्",
    "Your field": "तपाईंको खेत", "Soil texture": "माटोको बनावट",
    "Preferred crops": "रोजाइका बाली", "Optional": "ऐच्छिक",
    "Choose crops you are interested in. Recommendations still prioritize local and seasonal suitability.": "आफूलाई रुचि भएका बाली छान्नुहोस्। सिफारिसले स्थानीय र मौसमी उपयुक्ततालाई प्राथमिकता दिन्छ।",
    "Seasonal crop compatibility and rotation diversity considered": "मौसमी बाली अनुकूलता र चक्र विविधता विचार गरिएको",
    "What matters most": "सबैभन्दा महत्त्वपूर्ण कुरा", "Water conservation": "पानी संरक्षण", "Prefer crops that need less water.": "कम पानी चाहिने बाली रोज्नुहोस्।",
    "Climate resilience": "जलवायु सहनशीलता", "Prefer crops that cope with heat and dry spells.": "गर्मी र खडेरी सहन सक्ने बाली रोज्नुहोस्।",
    "Soil health": "माटोको स्वास्थ्य", "Prefer rotations that rebuild the soil, such as legumes after cereals.": "माटो सुधार्ने चक्र रोज्नुहोस्, जस्तै अन्नपछि दलहन।",
    "Low": "कम", "Medium": "मध्यम", "High": "उच्च", "Climate period (optional)": "जलवायु अवधि (ऐच्छिक)",
    "Leave empty to use the last complete calendar year. To choose your own period, set both dates.": "पछिल्लो पूरा पात्रो वर्ष प्रयोग गर्न खाली छोड्नुहोस्। अवधि छान्न दुवै मिति राख्नुहोस्।",
    "Start": "सुरु", "End": "अन्त्य", "Get rotation options": "बाली चक्रका विकल्प हेर्नुहोस्",
    "Your rotation options will appear here": "तपाईंका बाली चक्रका विकल्प यहाँ देखिनेछन्",
    "Fill in your farm details and choose": "खेतको विवरण भरेर छान्नुहोस्", "You'll see a climate-screened plan for summer, monsoon and winter, or the best feasible alternative when a season is unsupported.": "गर्मी, मनसुन र हिउँदका लागि जलवायु जाँच गरिएको योजना वा कुनै मौसमका लागि विकल्प नभए उपलब्ध व्यावहारिक योजना देखिनेछ।",
    "Data. Rules.": "तथ्याङ्क। नियम।", "Rotation.": "बाली चक्र।",
    "AgriVeya is built to be checked, not trusted blindly. The same inputs always give the same answer, and every score can be traced back to a reason.": "AgriVeya पारदर्शिताका लागि बनाइएको हो। एउटै जानकारीले एउटै नतिजा दिन्छ र हरेक अङ्कको कारण जाँच्न सकिन्छ।",
    "Historical NASA POWER observations for your coordinates": "तपाईंका निर्देशाङ्कका ऐतिहासिक NASA POWER तथ्याङ्क",
    "A transparent weighted score, with no hidden model": "लुकेको मोडेलबिनाको पारदर्शी भारित अङ्क",
    "Risks listed next to every recommendation": "हरेक सिफारिससँगै जोखिम",
    "What AgriVeya does not do": "AgriVeya ले के गर्दैन", "It is not a weather forecast.": "यो मौसम पूर्वानुमान होइन।",
    "It shows what the climate did in the past.": "यसले विगतको जलवायु देखाउँछ।", "It does not predict yield.": "यसले उत्पादनको भविष्यवाणी गर्दैन।",
    "Scores rank crops, they do not promise harvests.": "अङ्कले बाली क्रमबद्ध गर्छ, उत्पादनको ग्यारेन्टी गर्दैन।",
    "It does not measure your soil.": "यसले तपाईंको माटो मापन गर्दैन।", "You tell it the soil texture.": "माटोको बनावट तपाईंले दिनुहुन्छ।",
    "Crop profiles are simplified.": "बालीका विवरण सरल बनाइएका छन्।",
    "They are illustrative, so confirm with local advice before planting.": "यी उदाहरणका लागि हुन्, रोप्नुअघि स्थानीय सल्लाह लिनुहोस्।",
    "Ready for the next season?": "अर्को मौसमका लागि तयार हुनुहुन्छ?", "It takes one form and a few seconds.": "एउटा फारम भर्न केही सेकेन्ड मात्र लाग्छ।",
    "Language": "भाषा", "Location results © OpenStreetMap contributors": "स्थान तथ्याङ्क © OpenStreetMap योगदानकर्ताहरू",
    "Sand": "बालुवा", "Loamy Sand": "बलौटे दोमट", "Sandy Loam": "बलौटे दोमट", "Loam": "दोमट",
    "Silt Loam": "पाँगो दोमट", "Silt": "पाँगो", "Sandy Clay Loam": "बलौटे चिम्ट्याइलो दोमट",
    "Clay Loam": "चिम्ट्याइलो दोमट", "Silty Clay Loam": "पाँगो चिम्ट्याइलो दोमट",
    "Sandy Clay": "बलौटे चिम्ट्याइलो", "Silty Clay": "पाँगो चिम्ट्याइलो", "Clay": "चिम्ट्याइलो",
    "Don't Know — I'm not sure about my soil texture.": "थाहा छैन — म माटोको बनावटबारे निश्चित छैन।",
    "Loading crop options for this location…": "यस स्थानका लागि बालीका विकल्प ल्याउँदैछ…",
    "Regional crop options loaded for this location.": "यस स्थानका क्षेत्रीय बालीका विकल्प उपलब्ध छन्।",
    "Country-level fallback; local crop calendars and farm conditions may differ.": "देश-स्तरका विकल्प हुन्; स्थानीय बाली पात्रो र खेतको अवस्था फरक हुन सक्छ।",
    "Broader regional fallback; confirm local crops with agricultural extension services.": "व्यापक क्षेत्रका विकल्प हुन्; स्थानीय कृषि प्राविधिकसँग पुष्टि गर्नुहोस्।",
    "No curated crop coverage for this location. No crops have been guessed.": "यस स्थानका लागि सङ्कलित बाली विवरण छैन। कुनै बाली अनुमान गरिएको छैन।",
    "A broad regional crop set, not farm-level planting advice.": "यी व्यापक क्षेत्रीय बाली हुन्, खेत-स्तरको रोपाइँ सल्लाह होइनन्।",
    "Crop options could not be loaded. Please try selecting the location again.": "बालीका विकल्प ल्याउन सकिएन। स्थान फेरि छान्नुहोस्।",
    "Enter valid coordinates to load crop options.": "बालीका विकल्प ल्याउन मान्य निर्देशाङ्क राख्नुहोस्।",
    "Soil texture is unknown; no soil-specific compatibility was assumed.": "माटोको बनावट थाहा छैन; माटोअनुसारको उपयुक्तता अनुमान गरिएको छैन।",
    "Low water need": "कम पानी चाहिने", "Moderate water need": "मध्यम पानी चाहिने", "High water need": "धेरै पानी चाहिने",
    "Soil texture matches profile": "माटोको बनावट विवरणसँग मिल्छ",
    "Soil texture is not a direct profile match": "माटोको बनावट विवरणसँग सीधै मिल्दैन",
    "How preferences fit": "बालीका प्राथमिकता कसरी मिल्छन्",
    "Included in a recommended plan.": "सिफारिस गरिएको योजनामा समावेश छ।",
    "Not included in this location's regional crop profiles.": "यस स्थानका क्षेत्रीय बाली विवरणमा समावेश छैन।",
    "Seasonal temperature observations did not fit this crop's screening range.": "मौसमी तापक्रम अवलोकन यस बालीको जाँच दायरासँग मिलेन।",
    "The selected soil texture is not a direct match for this crop profile.": "छानिएको माटोको बनावट यो बाली विवरणसँग सीधै मिल्दैन।",
    "Passed initial screens but did not appear in the top three plans.": "प्रारम्भिक जाँचमा मिल्यो, तर उत्कृष्ट तीन योजनामा परेन।",
    "Alternatives in the plan:": "योजनामा विकल्प:",
    "Location details unavailable": "स्थानको विवरण उपलब्ध छैन",
    "Finding location name…": "स्थानको नाम खोज्दै…",
    "Current location detected automatically.": "हालको स्थान स्वतः पत्ता लाग्यो।",
    "Detecting current location…": "हालको स्थान पत्ता लगाउँदै…",
    "Current location detected; address could not be resolved.": "हालको स्थान पत्ता लाग्यो; ठेगाना पत्ता लगाउन सकिएन।",
    "Location ready.": "स्थान तयार भयो।",
    "Choose a location suggestion to use your search.": "खोजी प्रयोग गर्न स्थान सुझाव छान्नुहोस्।",
    "Please select or resolve a farm location first.": "पहिले खेतको स्थान छान्नुहोस् वा पत्ता लगाउनुहोस्।",
    "Annual crop rotation plans": "वार्षिक बाली चक्र योजना",
    "Monsoon": "मनसुन",
    "Plant": "रोपाइँ",
    "Harvest": "कटानी",
    "Planting to harvest": "रोपाइँदेखि कटानीसम्म",
    "AD": "ई.सं.",
    "BS": "वि.सं.",
    "BS conversion unavailable for this date.": "यो मितिका लागि वि.सं. रूपान्तरण उपलब्ध छैन।",
    "Jan": "जनवरी", "Feb": "फेब्रुअरी", "Mar": "मार्च", "Apr": "अप्रिल",
    "May": "मे", "Jun": "जुन", "Jul": "जुलाई", "Aug": "अगस्ट",
    "Sep": "सेप्टेम्बर", "Oct": "अक्टोबर", "Nov": "नोभेम्बर", "Dec": "डिसेम्बर",
    "next cycle": "अर्को चक्र",
    "Duration": "अवधि",
    "Climate profile fits": "जलवायु विवरणसँग मेल",
    "Climate profile needs local review": "जलवायु विवरण स्थानीय रूपमा जाँच्नुहोस्",
    "Rainfall profile fits": "वर्षा विवरणसँग मेल",
    "Soil profile fit": "माटोको विवरणसँग मेल",
    "Soil needs local review": "माटो स्थानीय रूपमा जाँच्नुहोस्",
    "Different crop family": "फरक बाली परिवार",
    "Legume rotation benefit": "दलहन चक्रको फाइदा",
    "Why this crop?": "यो बाली किन?",
    "More details": "थप विवरण",
    "days": "दिन",
    "month": "महिना",
    "months": "महिना",
    "Estimated gap": "अनुमानित खाली अवधि",
    "No full idle month between crops": "बालीबीच पूरा खाली महिना छैन",
    "Harvest and planting may overlap": "कटानी र रोपाइँको समय एकैपटक पर्न सक्छ",
    "Indicative calendar; confirm local dates before planting.": "यो सामान्य बाली पात्रो हो; रोप्नुअघि स्थानीय समय पुष्टि गर्नुहोस्।",
    "Some seasons are not shown because local crop coverage or climate screening did not support them.": "स्थानीय बाली विवरण वा जलवायु जाँचले समर्थन नगरेका मौसमहरू देखाइएका छैनन्।",
    "Not included": "समावेश छैन",
    "Complete three-season plan": "तीनै मौसमको योजना",
    "Best feasible seasonal alternative": "उपलब्ध व्यावहारिक मौसमी विकल्प",
    "A cereal-to-legume change can support crop-family diversity when locally suitable.": "स्थानीय रूपमा उपयुक्त भए अन्नबालीपछि दलहन लगाउँदा बाली परिवारको विविधता बढ्न सक्छ।",
    "Crop families change across seasons, supporting rotation diversity.": "मौसमअनुसार बाली परिवार परिवर्तन गर्दा चक्रको विविधता बढ्छ।",
    "Highest combined fit across summer, monsoon, and winter among the screened plans.": "जाँचिएका योजनामध्ये गर्मी, मनसुन र हिउँदका लागि सबैभन्दा मिल्दो योजना।",
    "An alternative three-season plan using the same screening rules.": "उही जाँच नियममा आधारित अर्को तीन-मौसम योजना।",
    "Best available seasonal alternative; the omitted season lacked a suitable regional crop profile.": "उपलब्ध राम्रो मौसमी विकल्प; छुटेको मौसमका लागि उपयुक्त क्षेत्रीय बाली विवरण थिएन।",
    "A complete three-season plan was unavailable; the omitted seasons are shown in the plan.": "पूरा तीन-मौसम योजना उपलब्ध भएन; छुटेका मौसम योजना विवरणमा देखाइएका छन्।",
    "Historical seasonal temperatures did not match a crop's broad screening band for at least one season.": "कम्तीमा एक मौसमको ऐतिहासिक तापक्रम कुनै बालीको सामान्य जाँच सीमासँग मिलेन्।",
    "No crop sequence was available from the regional profiles and climate screening.": "क्षेत्रीय बाली विवरण र जलवायु जाँचबाट कुनै बाली क्रम उपलब्ध भएन।",
    "Water access and irrigation were not provided; historical rainfall cannot confirm available water.": "पानीको पहुँच र सिँचाइको विवरण छैन; ऐतिहासिक वर्षाले उपलब्ध पानी पुष्टि गर्दैन।",
    "Planting and harvest windows are indicative South Asian calendar ranges; confirm local dates and crop duration with agricultural extension advice.": "रोपाइँ र कटानीको समय दक्षिण एसियाको सामान्य पात्रोमा आधारित छ; स्थानीय कृषि प्राविधिकसँग पुष्टि गर्नुहोस्।",
    "Regional crop coverage is unavailable; these climate-screened profiles are not locally confirmed choices.": "क्षेत्रीय बाली विवरण उपलब्ध छैन; जलवायुका आधारमा छानिएका बाली स्थानीय रूपमा पुष्टि गरिएका होइनन्।",
    "A broader country-level crop list was used for a season missing regional options.": "क्षेत्रीय विकल्प नभएको मौसमका लागि देश-स्तरको व्यापक बाली सूची प्रयोग गरियो।",
    "Season-specific climate observations were incomplete; annual climate values were used where needed.": "मौसमअनुसारका जलवायु अवलोकन अपूरा थिए; आवश्यक ठाउँमा वार्षिक मान प्रयोग गरियो।",
    "Winter–summer rotation plans": "हिउँद–गर्मी बाली चक्र योजना",
    "No complete winter–summer plan found for this location.": "यस स्थानका लागि पूरा हिउँद–गर्मी योजना भेटिएन।",
    "Winter": "हिउँद", "Summer": "गर्मी", "crop": "बाली", "observations": "अवलोकन",
    "Rotation benefit": "बाली चक्रको फाइदा", "Selected farm location": "छानिएको खेतको स्थान",
    "Screening score": "जाँच अङ्क",
    "Why this plan?": "यो योजना किन?",
    "Nov–Feb": "नोभेम्बर–फेब्रुअरी", "Mar–May": "मार्च–मे",
    "Highest combined winter and summer fit among available options.": "उपलब्ध विकल्पमध्ये हिउँद र गर्मीका लागि सबैभन्दा मिल्दो योजना।",
    "An alternative winter–summer plan using the same screening rules.": "उही जाँच नियममा आधारित अर्को हिउँद–गर्मी योजना।",
    "A winter cereal followed by a summer legume can support crop-family diversity.": "हिउँदे अन्नबालीपछि गर्मीको दलहन लगाउँदा बाली परिवारको विविधता बढ्न सक्छ।",
    "Different crop families alternate across growing seasons.": "विभिन्न बाली परिवारलाई फरक मौसममा लगाइन्छ।",
    "Family diversity is limited in this sequence.": "यस चक्रमा बाली परिवारको विविधता सीमित छ।",
    "Water access and irrigation were not provided; historical rainfall cannot confirm available water.": "पानीको पहुँच र सिँचाइको विवरण छैन; ऐतिहासिक वर्षाले उपलब्ध पानी पुष्टि गर्दैन।",
    "NASA POWER observations": "NASA POWER अवलोकन",
    "Scores rank crops by simple rules and do not predict yield.": "अङ्कले सरल नियमअनुसार बाली क्रमबद्ध गर्छ, उत्पादनको भविष्यवाणी गर्दैन।",
    "Some climate values were missing, so scores that depend on them are less certain.": "केही जलवायु मान उपलब्ध थिएनन्, त्यसैले तीमा आधारित अङ्क कम निश्चित छन्।",
    "Historical NASA POWER observations support climate context only; they are not a weather forecast or yield prediction.": "ऐतिहासिक NASA POWER अवलोकनले जलवायुको सन्दर्भ मात्र दिन्छ; यो मौसम पूर्वानुमान वा उत्पादनको भविष्यवाणी होइन।",
    "Soil texture is farmer-reported and is not a direct soil measurement.": "माटोको बनावट किसानले दिएको जानकारी हो, प्रत्यक्ष माटो परीक्षण होइन।",
    "Late-season heat can be a risk": "मौसमको अन्त्यतिरको गर्मी जोखिम हुन सक्छ।",
    "Following another cereal reduces crop-family diversity": "अर्को अन्नबालीपछि लगाउँदा बाली परिवारको विविधता घट्छ।",
    "Waterlogging and disease pressure need local management": "पानी जम्ने र रोगको जोखिम स्थानीय व्यवस्थापन चाहिन्छ।",
    "Planting window must fit the local crop calendar": "रोपाइँको समय स्थानीय बाली पात्रोसँग मिल्नुपर्छ।",
    "Needs local pest and disease management": "स्थानीय कीरा तथा रोग व्यवस्थापन चाहिन्छ।",
    "Flowering can be sensitive to unsuitable heat conditions": "अनुपयुक्त गर्मीले फूल लाग्ने चरणमा असर गर्न सक्छ।",
    "Poor drainage and excessive moisture can be problematic": "निकास कमजोर र अत्यधिक चिस्यान समस्या हुन सक्छ।",
    "Requires local variety and disease advice": "स्थानीय जात र रोगसम्बन्धी सल्लाह आवश्यक छ।",
    "Both crops are in the Fabaceae family, so family diversity is limited.": "दुवै बाली Fabaceae परिवारका भएकाले परिवारगत विविधता सीमित छ।",
    "Average relative humidity is unavailable.": "औसत सापेक्षिक आर्द्रता उपलब्ध छैन।",
    "Average solar radiation is unavailable.": "औसत सौर्य विकिरण उपलब्ध छैन।",
    "Average temperature is unavailable, reducing climate confidence.": "औसत तापक्रम उपलब्ध छैन, त्यसैले जलवायु मूल्याङ्कन कम निश्चित छ।",
    "Historical average temperature is outside this profile's illustrative suitability band.": "ऐतिहासिक औसत तापक्रम यस बालीको उदाहरणीय उपयुक्तता सीमाभन्दा बाहिर छ।",
    "Total precipitation is unavailable, reducing water-availability confidence.": "कुल वर्षा उपलब्ध छैन, त्यसैले पानीको उपलब्धता मूल्याङ्कन कम निश्चित छ।",
    "Historical precipitation differs from this profile's illustrative water band; irrigation or drainage may matter.": "ऐतिहासिक वर्षा यस बालीको उदाहरणीय पानी सीमाभन्दा फरक छ; सिँचाइ वा निकास महत्त्वपूर्ण हुन सक्छ।",
    "Some historical environmental observations are missing; scores use available values only.": "केही ऐतिहासिक वातावरणीय तथ्याङ्क छैनन्; उपलब्ध तथ्याङ्क मात्र अङ्कमा प्रयोग गरिएका छन्।",
    "Water-demanding without dependable rainfall or irrigation": "भरपर्दो वर्षा वा सिँचाइ नहुँदा धेरै पानी चाहिन्छ।",
    "Repeated cereal rotations can reduce diversity": "बारम्बार अन्नबाली लगाउँदा विविधता घट्न सक्छ।",
    "Sensitive to prolonged water stress around flowering": "फूल लाग्ने समयमा लामो पानीको अभावले असर गर्न सक्छ।",
    "Cereal-after-cereal sequences reduce family diversity": "लगातार अन्नबाली लगाउँदा परिवारगत विविधता घट्छ।",
    "Waterlogging can be damaging": "खेतमा पानी जम्दा क्षति हुन सक्छ।",
    "Requires local disease and market assessment": "स्थानीय रोग र बजारबारे मूल्याङ्कन आवश्यक छ।",
    "A broader crop list was used where location-specific seasonal coverage was unavailable.": "स्थानअनुसारको मौसमी विवरण नभएकाले फराकिलो बाली सूची प्रयोग गरियो।",
    "Regional crop coverage is unavailable; these climate-screened profiles are not locally confirmed choices.": "क्षेत्रीय बाली विवरण उपलब्ध छैन; यी जलवायुमा आधारित विकल्प स्थानीय रूपमा पुष्टि भएका होइनन्।",
    "Season-specific climate observations were incomplete; annual climate values were used where needed.": "मौसमअनुसारको जलवायु अवलोकन अधुरो थियो; आवश्यक ठाउँमा वार्षिक तथ्याङ्क प्रयोग गरियो।",
    "No winter-to-summer crop pair is available in the regional and crop profiles.": "क्षेत्रीय तथा बाली विवरणमा हिउँददेखि गर्मीसम्मको बाली जोडी उपलब्ध छैन।",
    "Rice": "धान", "Maize": "मकै", "Wheat": "गहुँ", "Lentil": "मसुरो", "Mustard": "तोरी", "Chickpea": "चना", "Millet": "कोदो", "Mung bean": "मूँग",
    "Not provided.": "उपलब्ध छैन।", "No suitable options found": "उपयुक्त विकल्प भेटिएन",
    "The available regional crop profiles and seasonal screening did not produce a plan. Review the location and soil details.": "उपलब्ध क्षेत्रीय बाली विवरण र मौसमी जाँचबाट योजना बनेन। स्थान र माटोको विवरण जाँच्नुहोस्।",
    "Your three rotation options for the next season": "अर्को मौसमका लागि तपाईंका तीन बाली चक्र विकल्प",
    "Things to keep in mind": "ध्यान दिनुपर्ने कुरा", "Overall reasons": "समग्र कारणहरू",
    "How AgriVeya scores crops": "AgriVeya ले बालीलाई कसरी अङ्क दिन्छ", "Data sources": "तथ्याङ्कका स्रोत",
    "Raw response (for debugging)": "कच्चा जवाफ (त्रुटि पहिचानका लागि)", "What the climate has done here": "यहाँको जलवायु इतिहास",
    "Total rainfall": "कुल वर्षा", "Average sunlight": "औसत घाम", "NASA POWER observations.": "NASA POWER अवलोकन।",
    "How the score was built": "अङ्क कसरी बन्यो", "Best match": "सबैभन्दा उपयुक्त", "Option": "विकल्प",
    "Strong fit": "धेरै उपयुक्त", "Moderate fit": "मध्यम उपयुक्त", "Weak fit": "कम उपयुक्त",
    "Suitability score": "उपयुक्तता अङ्क", "Why it ranked here": "यो क्रमको कारण",
    "Why it fits": "किन उपयुक्त", "Risks and trade-offs": "जोखिम र असर",
    "No benefits listed.": "फाइदा उल्लेख गरिएको छैन।", "No specific risks listed.": "विशेष जोखिम उल्लेख गरिएको छैन।",
    "Then": "त्यसपछि", "season": "मौसम", "Climate data: NASA POWER (historical observations, not a forecast). Scores come from a simple, explainable rule set and do not predict yield.": "जलवायु तथ्याङ्क: NASA POWER (ऐतिहासिक अवलोकन, पूर्वानुमान होइन)। अङ्क सरल र व्याख्या गर्न मिल्ने नियममा आधारित छन् र उत्पादनको भविष्यवाणी गर्दैनन्।",
    "Location selected. Coordinates updated.": "स्थान छानियो। निर्देशाङ्क अद्यावधिक भए।",
    "Location suggestions": "स्थान सुझावहरू",
    "Location permission unavailable; search still works.": "स्थान अनुमति उपलब्ध भएन; खोजी भने चल्छ।",
    "Current location set; nearby results are prioritized.": "हालको स्थान सेट भयो; नजिकका नतिजालाई प्राथमिकता दिइनेछ।",
    "Could not refresh the location name in the selected language.": "छानिएको भाषामा स्थानको नाम अद्यावधिक गर्न सकिएन।",
    "Historical observations, not a forecast.": "ऐतिहासिक अवलोकन, पूर्वानुमान होइन।",
    "Searching locations…": "स्थान खोज्दै…", "No matching places found.": "मिल्दो स्थान भेटिएन।",
    "Location search is unavailable. Please try again.": "स्थान खोज्न सकिएन। फेरि प्रयास गर्नुहोस्।",
    "Getting climate data from NASA POWER": "NASA POWER बाट जलवायु तथ्याङ्क ल्याउँदै",
    "This usually takes a few seconds. Your options will appear here.": "यसमा केही सेकेन्ड लाग्छ। तपाईंका विकल्प यहाँ देखिनेछन्।",
    "Working…": "काम हुँदैछ…", "Can't reach the AgriVeya server": "AgriVeya सर्भरमा जडान हुन सकेन",
    "Something went wrong on the server": "सर्भरमा समस्या आयो", "Check your details": "विवरण जाँच्नुहोस्",
    "The request took too long": "अनुरोधमा धेरै समय लाग्यो", "NASA climate data is unavailable": "NASA जलवायु तथ्याङ्क उपलब्ध छैन",
    "The server could not use these details": "सर्भरले यी विवरण प्रयोग गर्न सकेन",
    "Location not available": "स्थान उपलब्ध छैन", "Couldn't get your location": "तपाईंको स्थान पत्ता लागेन",
    "Start the backend to load NASA POWER data. AgriVeya never shows made-up climate values.": "NASA POWER तथ्याङ्कका लागि ब्याकएन्ड सुरु गर्नुहोस्। AgriVeya ले बनावटी जलवायु तथ्याङ्क देखाउँदैन।",
    "days": "दिन", "climate data unavailable": "जलवायु तथ्याङ्क उपलब्ध छैन",
    "Allow location access in your browser, or enter the coordinates by hand.": "ब्राउजरमा स्थान अनुमति दिनुहोस् वा निर्देशाङ्क आफैँ भर्नुहोस्।",
    "This browser can't share your location. Enter the coordinates by hand.": "यो ब्राउजरले स्थान साझा गर्न सक्दैन। निर्देशाङ्क आफैँ भर्नुहोस्।",
    "Latitude must be a number between -90 and 90.": "अक्षांश -90 र 90 बीचको सङ्ख्या हुनुपर्छ।",
    "Longitude must be a number between -180 and 180.": "देशान्तर -180 र 180 बीचको सङ्ख्या हुनुपर्छ।",
    "Set both a start and an end date, or leave both empty.": "सुरु र अन्त्य दुवै मिति राख्नुहोस् वा दुवै खाली छोड्नुहोस्।",
    "The start date must be before the end date.": "सुरु मिति अन्त्य मितिभन्दा अघिको हुनुपर्छ।",
    "NASA POWER did not answer in time. Wait a moment and try again.": "NASA POWER बाट समयमै जवाफ आएन। केहीबेर पर्खेर फेरि प्रयास गर्नुहोस्।",
    "Adjust the form and try again.": "फारम सच्याएर फेरि प्रयास गर्नुहोस्।",
    "Listen": "सुन्नुहोस्", "Listen to this plan in English.": "यो योजना अंग्रेजीमा सुन्नुहोस्।",
    "Pause": "रोक्नुहोस्", "Resume": "जारी राख्नुहोस्", "Stop": "बन्द गर्नुहोस्",
    "Speech synthesis is unavailable in this browser.": "यो ब्राउजरमा बोली सुविधा उपलब्ध छैन।",
    "No English voice is available in this browser.": "यो ब्राउजरमा अंग्रेजी आवाज उपलब्ध छैन।",
    "Speech playback failed. Try again.": "बोली चलाउन सकिएन। फेरि प्रयास गर्नुहोस्।"
  },
  hi: {
    "Home": "होम", "How it works": "यह कैसे काम करता है", "Planner": "योजना", "About the data": "डेटा के बारे में", "Plan my season": "मेरे मौसम की योजना बनाएं",
    "Climate-smart rotation": "जलवायु-स्मार्ट फसल चक्र", "Built on NASA POWER climate data": "NASA POWER से जलवायु डेटा",
    "Plan the next season.": "अगले मौसम में क्या उगाएँ?", "Grow with the climate.": "जलवायु देखकर योजना बनाएं।",
    "Climate observations, your soil, and crop preferences help rank practical annual plans for your field.": "जलवायु अवलोकन, मिट्टी और आपकी पसंद की फसलें आपके खेत के लिए व्यावहारिक वार्षिक योजनाएं चुनने में मदद करती हैं।",
    "Choose your location and field details to compare regional crop rotations.": "क्षेत्रीय फसल चक्रों की तुलना के लिए स्थान और खेत का विवरण चुनें।",
    "Clear rules connect your location, soil and priorities to each crop plan.": "स्पष्ट नियम स्थान, मिट्टी और प्राथमिकताओं को हर फसल योजना से जोड़ते हैं।",
    "Historical temperature, rainfall, humidity and sunlight for your location.": "आपके स्थान के ऐतिहासिक तापमान, वर्षा, आर्द्रता और धूप का डेटा।",
    "Your soil, local climate, and preferred crops inform each annual plan.": "मिट्टी, स्थानीय जलवायु और पसंद की फसलें हर वार्षिक योजना को दिशा देती हैं।",
    "Choose what matters most: water, climate resilience or soil health.": "पानी, जलवायु सहनशीलता या मिट्टी के स्वास्थ्य में प्राथमिकता चुनें।",
    "Compare crop plans with clear benefits, scores and risks.": "स्पष्ट लाभ, स्कोर और जोखिम के साथ फसल योजनाओं की तुलना करें।",
    "Highlight this plan": "इस योजना को हाइलाइट करें", "Highlighted plan": "हाइलाइट की गई योजना",
    "Plan my season": "मेरे मौसम की योजना बनाएं", "How it works": "यह कैसे काम करता है", "Climate snapshot": "जलवायु झलक",
    "Average temperature": "औसत तापमान", "Average humidity": "औसत आर्द्रता", "Dry days": "सूखे दिन", "Historical observations, not a forecast.": "ऐतिहासिक अवलोकन, पूर्वानुमान नहीं।",
    "NASA climate measures": "NASA जलवायु माप", "crops compared": "फसलों की तुलना", "ranked rotations": "क्रमबद्ध फसल चक्र", "days of observations by default": "दिनों का अवलोकन डिफ़ॉल्ट रूप से",
    "How AgriVeya decides": "AgriVeya कैसे निर्णय लेता है", "Every score comes from the same simple, open rules. You can see which facts pushed a crop up or down.": "हर स्कोर सरल और खुले नियमों से आता है। देखें कि किन तथ्यों ने फसल की रैंक बढ़ाई या घटाई।",
    "NASA climate record": "NASA जलवायु रिकॉर्ड", "Temperature, rainfall, humidity and sunlight for your exact coordinates, taken from NASA POWER.": "आपके सटीक निर्देशांकों के तापमान, वर्षा, आर्द्रता और धूप का NASA POWER डेटा।",
    "Soil and crop preferences": "मिट्टी और फसल प्राथमिकताएं",
    "Your priorities": "आपकी प्राथमिकताएं", "Say how much water saving, climate resilience and soil health matter to you. The ranking shifts with you.": "पानी की बचत, जलवायु सहनशीलता और मिट्टी के स्वास्थ्य की प्राथमिकता चुनें। रैंक उसी अनुसार बदलेगी।",
    "Ranked rotations": "क्रमबद्ध फसल चक्र", "Three annual rotation options to compare, each with timing, risks and a clear score.": "समय, जोखिम और स्पष्ट स्कोर के साथ तुलना के लिए तीन वार्षिक फसल चक्र विकल्प।",
    "Plan your next season": "अगले मौसम की योजना बनाएं", "Enter your farm details. AgriVeya fetches the climate record for your coordinates and ranks your options.": "खेत का विवरण भरें। AgriVeya आपके निर्देशांकों का जलवायु डेटा लेकर विकल्पों को क्रम देता है।",
    "Farm location": "खेत का स्थान", "Search for a place": "स्थान खोजें", "City, district, or country": "शहर, जिला या देश",
    "Latitude": "अक्षांश", "Longitude": "देशांतर", "Use my current location": "मेरी वर्तमान स्थिति का उपयोग करें",
    "Your field": "आपका खेत", "Soil texture": "मिट्टी की बनावट",
    "Preferred crops": "पसंदीदा फसलें", "Optional": "वैकल्पिक",
    "Choose crops you are interested in. Recommendations still prioritize local and seasonal suitability.": "अपनी पसंद की फसलें चुनें। सुझावों में स्थानीय और मौसमी उपयुक्तता प्राथमिकता रहेगी।",
    "Seasonal crop compatibility and rotation diversity considered": "मौसमी फसल अनुकूलता और चक्र विविधता पर विचार",
    "What matters most": "सबसे महत्वपूर्ण", "Water conservation": "जल संरक्षण", "Prefer crops that need less water.": "कम पानी वाली फसलों को प्राथमिकता दें।",
    "Climate resilience": "जलवायु सहनशीलता", "Prefer crops that cope with heat and dry spells.": "गर्मी और सूखे को सहने वाली फसलें चुनें।",
    "Soil health": "मिट्टी का स्वास्थ्य", "Prefer rotations that rebuild the soil, such as legumes after cereals.": "मिट्टी सुधारने वाले चक्र चुनें, जैसे अनाज के बाद दलहन।",
    "Low": "कम", "Medium": "मध्यम", "High": "उच्च", "Climate period (optional)": "जलवायु अवधि (वैकल्पिक)",
    "Leave empty to use the last complete calendar year. To choose your own period, set both dates.": "पिछले पूरे कैलेंडर वर्ष के लिए खाली छोड़ें। अवधि चुनने के लिए दोनों तारीखें भरें।",
    "Start": "शुरू", "End": "अंत", "Get rotation options": "फसल चक्र विकल्प देखें",
    "Your rotation options will appear here": "आपके फसल चक्र विकल्प यहां दिखेंगे",
    "Fill in your farm details and choose": "खेत का विवरण भरें और चुनें", "You'll see a climate-screened plan for summer, monsoon and winter, or the best feasible alternative when a season is unsupported.": "गर्मी, मानसून और सर्दी के लिए जलवायु-जांची योजना या किसी मौसम के लिए विकल्प न होने पर सबसे अच्छा उपलब्ध विकल्प दिखेगा।",
    "Data. Rules.": "डेटा। नियम।", "Rotation.": "फसल चक्र।",
    "AgriVeya is built to be checked, not trusted blindly. The same inputs always give the same answer, and every score can be traced back to a reason.": "AgriVeya पारदर्शिता के लिए बनाया गया है। समान जानकारी से समान परिणाम मिलता है और हर स्कोर का कारण जांचा जा सकता है।",
    "Historical NASA POWER observations for your coordinates": "आपके निर्देशांकों का ऐतिहासिक NASA POWER डेटा",
    "A transparent weighted score, with no hidden model": "बिना छिपे मॉडल के पारदर्शी भारित स्कोर",
    "Risks listed next to every recommendation": "हर सुझाव के साथ जोखिम",
    "What AgriVeya does not do": "AgriVeya क्या नहीं करता", "It is not a weather forecast.": "यह मौसम पूर्वानुमान नहीं है।",
    "It shows what the climate did in the past.": "यह अतीत की जलवायु दिखाता है।", "It does not predict yield.": "यह उपज का पूर्वानुमान नहीं करता।",
    "Scores rank crops, they do not promise harvests.": "स्कोर फसलों को क्रम देते हैं, उपज की गारंटी नहीं।",
    "It does not measure your soil.": "यह आपकी मिट्टी नहीं मापता।", "You tell it the soil texture.": "मिट्टी की बनावट आप बताते हैं।",
    "Crop profiles are simplified.": "फसल प्रोफाइल सरल किए गए हैं।",
    "They are illustrative, so confirm with local advice before planting.": "ये उदाहरण हैं, बुवाई से पहले स्थानीय सलाह लें।",
    "Ready for the next season?": "अगले मौसम के लिए तैयार हैं?", "It takes one form and a few seconds.": "एक फॉर्म भरने में कुछ सेकंड लगते हैं।",
    "Language": "भाषा", "Location results © OpenStreetMap contributors": "स्थान परिणाम © OpenStreetMap योगदानकर्ता",
    "Sand": "रेतीली मिट्टी", "Loamy Sand": "दोमट रेतीली मिट्टी", "Sandy Loam": "बलुई दोमट",
    "Loam": "दोमट मिट्टी", "Silt Loam": "गाद दोमट", "Silt": "गाद",
    "Sandy Clay Loam": "बलुई चिकनी दोमट", "Clay Loam": "चिकनी दोमट",
    "Silty Clay Loam": "गाद वाली चिकनी दोमट", "Sandy Clay": "बलुई चिकनी मिट्टी",
    "Silty Clay": "गाद वाली चिकनी मिट्टी", "Clay": "चिकनी मिट्टी",
    "Don't Know — I'm not sure about my soil texture.": "पता नहीं — मुझे अपनी मिट्टी की बनावट का पता नहीं है।",
    "Loading crop options for this location…": "इस स्थान के लिए फसल विकल्प लोड हो रहे हैं…",
    "Regional crop options loaded for this location.": "इस स्थान के क्षेत्रीय फसल विकल्प उपलब्ध हैं।",
    "Country-level fallback; local crop calendars and farm conditions may differ.": "देश-स्तर के विकल्प; स्थानीय फसल कैलेंडर और खेत की स्थिति अलग हो सकती है।",
    "Broader regional fallback; confirm local crops with agricultural extension services.": "व्यापक क्षेत्र के विकल्प; स्थानीय कृषि विशेषज्ञ से पुष्टि करें।",
    "No curated crop coverage for this location. No crops have been guessed.": "इस स्थान के लिए संकलित फसल जानकारी नहीं है। कोई फसल अनुमान से नहीं जोड़ी गई।",
    "A broad regional crop set, not farm-level planting advice.": "ये व्यापक क्षेत्रीय फसलें हैं, खेत के लिए रोपाई की सलाह नहीं।",
    "Crop options could not be loaded. Please try selecting the location again.": "फसल विकल्प लोड नहीं हो सके। स्थान फिर से चुनें।",
    "Enter valid coordinates to load crop options.": "फसल विकल्पों के लिए मान्य निर्देशांक दर्ज करें।",
    "Soil texture is unknown; no soil-specific compatibility was assumed.": "मिट्टी की बनावट अज्ञात है; मिट्टी के अनुसार उपयुक्तता नहीं मानी गई।",
    "Low water need": "कम पानी की जरूरत", "Moderate water need": "मध्यम पानी की जरूरत", "High water need": "अधिक पानी की जरूरत",
    "Soil texture matches profile": "मिट्टी की बनावट प्रोफाइल से मेल खाती है",
    "Soil texture is not a direct profile match": "मिट्टी की बनावट प्रोफाइल से सीधे मेल नहीं खाती",
    "How preferences fit": "पसंदीदा फसलें कितनी उपयुक्त हैं",
    "Included in a recommended plan.": "सुझाई गई योजना में शामिल है।",
    "Not included in this location's regional crop profiles.": "इस स्थान की क्षेत्रीय फसल प्रोफाइल में शामिल नहीं है।",
    "Seasonal temperature observations did not fit this crop's screening range.": "मौसमी तापमान इस फसल की जांच सीमा से मेल नहीं खाता।",
    "The selected soil texture is not a direct match for this crop profile.": "चुनी गई मिट्टी की बनावट इस फसल प्रोफाइल से सीधे मेल नहीं खाती।",
    "Passed initial screens but did not appear in the top three plans.": "प्रारंभिक जांच में सही रही, लेकिन शीर्ष तीन योजनाओं में नहीं आई।",
    "Alternatives in the plan:": "योजना में विकल्प:",
    "Location details unavailable": "स्थान का विवरण उपलब्ध नहीं है",
    "Finding location name…": "स्थान का नाम खोजा जा रहा है…",
    "Current location detected automatically.": "वर्तमान स्थान अपने-आप पता चला।",
    "Detecting current location…": "वर्तमान स्थान का पता लगाया जा रहा है…",
    "Current location detected; address could not be resolved.": "वर्तमान स्थान पता चला; पता नहीं मिल सका।",
    "Location ready.": "स्थान तैयार है।",
    "Choose a location suggestion to use your search.": "खोज लागू करने के लिए स्थान का सुझाव चुनें।",
    "Please select or resolve a farm location first.": "पहले खेत का स्थान चुनें या पता करें।",
    "Annual crop rotation plans": "वार्षिक फसल चक्र योजना",
    "Monsoon": "मानसून",
    "Plant": "बुवाई",
    "Harvest": "कटाई",
    "Planting to harvest": "बुवाई से कटाई तक",
    "AD": "ईस्वी",
    "BS": "वि.सं.",
    "BS conversion unavailable for this date.": "इस तारीख के लिए वि.सं. रूपांतरण उपलब्ध नहीं है।",
    "Jan": "जनवरी", "Feb": "फ़रवरी", "Mar": "मार्च", "Apr": "अप्रैल",
    "May": "मई", "Jun": "जून", "Jul": "जुलाई", "Aug": "अगस्त",
    "Sep": "सितंबर", "Oct": "अक्टूबर", "Nov": "नवंबर", "Dec": "दिसंबर",
    "next cycle": "अगला चक्र",
    "Duration": "अवधि",
    "Climate profile fits": "जलवायु प्रोफाइल से मेल",
    "Climate profile needs local review": "जलवायु प्रोफाइल की स्थानीय जांच जरूरी",
    "Rainfall profile fits": "वर्षा प्रोफाइल से मेल",
    "Soil profile fit": "मिट्टी प्रोफाइल से मेल",
    "Soil needs local review": "मिट्टी की स्थानीय जांच जरूरी",
    "Different crop family": "अलग फसल परिवार",
    "Legume rotation benefit": "दलहन चक्र का लाभ",
    "Why this crop?": "यह फसल क्यों?",
    "More details": "अधिक जानकारी",
    "days": "दिन",
    "month": "महीना",
    "months": "महीने",
    "Estimated gap": "अनुमानित खाली अवधि",
    "No full idle month between crops": "फसलों के बीच पूरा खाली महीना नहीं",
    "Harvest and planting may overlap": "कटाई और बुवाई का समय एक-दूसरे से टकरा सकता है",
    "Indicative calendar; confirm local dates before planting.": "यह सामान्य फसल कैलेंडर है; बुवाई से पहले स्थानीय समय की पुष्टि करें।",
    "Some seasons are not shown because local crop coverage or climate screening did not support them.": "स्थानीय फसल जानकारी या जलवायु जांच से समर्थन न मिलने पर कुछ मौसम नहीं दिखाए गए हैं।",
    "Not included": "शामिल नहीं",
    "Complete three-season plan": "तीनों मौसमों की योजना",
    "Best feasible seasonal alternative": "सबसे अच्छा उपलब्ध मौसमी विकल्प",
    "A cereal-to-legume change can support crop-family diversity when locally suitable.": "स्थानीय रूप से उपयुक्त होने पर अनाज के बाद दलहन लगाने से फसल-परिवार विविधता बढ़ सकती है।",
    "Crop families change across seasons, supporting rotation diversity.": "मौसम के साथ फसल-परिवार बदलने से चक्र विविधता को समर्थन मिलता है।",
    "Highest combined fit across summer, monsoon, and winter among the screened plans.": "जांची गई योजनाओं में गर्मी, मानसून और सर्दी के लिए सबसे अच्छा संयुक्त मेल।",
    "An alternative three-season plan using the same screening rules.": "उन्हीं जांच नियमों पर आधारित दूसरी तीन-मौसम योजना।",
    "Best available seasonal alternative; the omitted season lacked a suitable regional crop profile.": "सबसे अच्छा उपलब्ध मौसमी विकल्प; छूटे मौसम के लिए उपयुक्त क्षेत्रीय फसल जानकारी नहीं थी।",
    "A complete three-season plan was unavailable; the omitted seasons are shown in the plan.": "पूरी तीन-मौसम योजना उपलब्ध नहीं थी; छूटे मौसम योजना में दिखाए गए हैं।",
    "Historical seasonal temperatures did not match a crop's broad screening band for at least one season.": "कम से कम एक मौसम का ऐतिहासिक तापमान किसी फसल की सामान्य जांच सीमा से मेल नहीं खाता।",
    "No crop sequence was available from the regional profiles and climate screening.": "क्षेत्रीय फसल जानकारी और जलवायु जांच से कोई फसल क्रम उपलब्ध नहीं हुआ।",
    "Water access and irrigation were not provided; historical rainfall cannot confirm available water.": "पानी और सिंचाई की जानकारी नहीं दी गई; ऐतिहासिक वर्षा उपलब्ध पानी की पुष्टि नहीं करती।",
    "Planting and harvest windows are indicative South Asian calendar ranges; confirm local dates and crop duration with agricultural extension advice.": "बुवाई और कटाई का समय दक्षिण एशिया के सामान्य कैलेंडर पर आधारित है; स्थानीय कृषि विशेषज्ञ से पुष्टि करें।",
    "Regional crop coverage is unavailable; these climate-screened profiles are not locally confirmed choices.": "क्षेत्रीय फसल जानकारी उपलब्ध नहीं है; जलवायु जांच वाले विकल्प स्थानीय रूप से पुष्ट नहीं हैं।",
    "A broader country-level crop list was used for a season missing regional options.": "क्षेत्रीय विकल्प न होने वाले मौसम के लिए व्यापक देश-स्तरीय फसल सूची उपयोग की गई।",
    "Season-specific climate observations were incomplete; annual climate values were used where needed.": "मौसम-विशिष्ट जलवायु अवलोकन अधूरे थे; जहां जरूरी था वहां वार्षिक मान लिए गए।",
    "Winter–summer rotation plans": "सर्दी–गर्मी फसल चक्र योजनाएं",
    "No complete winter–summer plan found for this location.": "इस स्थान के लिए पूरी सर्दी–गर्मी योजना नहीं मिली।",
    "Winter": "सर्दी", "Summer": "गर्मी", "crop": "फसल", "observations": "अवलोकन",
    "Rotation benefit": "फसल चक्र का लाभ", "Selected farm location": "चुना गया खेत स्थान",
    "Screening score": "जांच स्कोर",
    "Why this plan?": "यह योजना क्यों?",
    "Nov–Feb": "नवंबर–फ़रवरी", "Mar–May": "मार्च–मई",
    "Highest combined winter and summer fit among available options.": "उपलब्ध विकल्पों में सर्दी और गर्मी के लिए सबसे उपयुक्त योजना।",
    "An alternative winter–summer plan using the same screening rules.": "उन्हीं जांच नियमों पर आधारित दूसरी सर्दी–गर्मी योजना।",
    "A winter cereal followed by a summer legume can support crop-family diversity.": "सर्दी के अनाज के बाद गर्मी की दलहन से फसल-परिवार की विविधता बढ़ सकती है।",
    "Different crop families alternate across growing seasons.": "अलग-अलग मौसम में अलग फसल-परिवार लगाए जाते हैं।",
    "Family diversity is limited in this sequence.": "इस चक्र में फसल-परिवार की विविधता सीमित है।",
    "Water access and irrigation were not provided; historical rainfall cannot confirm available water.": "पानी और सिंचाई की जानकारी नहीं दी गई; पुरानी वर्षा से उपलब्ध पानी की पुष्टि नहीं होती।",
    "NASA POWER observations": "NASA POWER अवलोकन",
    "Scores rank crops by simple rules and do not predict yield.": "स्कोर सरल नियमों से फसलों को क्रम देते हैं, उपज का पूर्वानुमान नहीं करते।",
    "Some climate values were missing, so scores that depend on them are less certain.": "कुछ जलवायु मान उपलब्ध नहीं थे, इसलिए उन पर निर्भर स्कोर कम निश्चित हैं।",
    "Historical NASA POWER observations support climate context only; they are not a weather forecast or yield prediction.": "ऐतिहासिक NASA POWER अवलोकन केवल जलवायु संदर्भ देते हैं; यह मौसम या उपज का पूर्वानुमान नहीं है।",
    "Soil texture is farmer-reported and is not a direct soil measurement.": "मिट्टी की बनावट किसान द्वारा बताई गई है, प्रत्यक्ष मिट्टी जांच नहीं।",
    "Late-season heat can be a risk": "मौसम के अंत में गर्मी जोखिम हो सकती है।",
    "Following another cereal reduces crop-family diversity": "लगातार अनाज फसलें लगाने से फसल-परिवार की विविधता घटती है।",
    "Waterlogging and disease pressure need local management": "जलभराव और रोग के जोखिम के लिए स्थानीय प्रबंधन जरूरी है।",
    "Planting window must fit the local crop calendar": "बुवाई का समय स्थानीय फसल कैलेंडर के अनुसार होना चाहिए।",
    "Needs local pest and disease management": "स्थानीय कीट और रोग प्रबंधन जरूरी है।",
    "Flowering can be sensitive to unsuitable heat conditions": "अनुपयुक्त गर्मी फूल आने के चरण को प्रभावित कर सकती है।",
    "Poor drainage and excessive moisture can be problematic": "खराब जल निकासी और अधिक नमी समस्या पैदा कर सकती है।",
    "Requires local variety and disease advice": "स्थानीय किस्म और रोग संबंधी सलाह जरूरी है।",
    "Both crops are in the Fabaceae family, so family diversity is limited.": "दोनों फसलें Fabaceae परिवार की हैं, इसलिए परिवार विविधता सीमित है।",
    "Average relative humidity is unavailable.": "औसत सापेक्ष आर्द्रता उपलब्ध नहीं है।",
    "Average solar radiation is unavailable.": "औसत सौर विकिरण उपलब्ध नहीं है।",
    "Average temperature is unavailable, reducing climate confidence.": "औसत तापमान उपलब्ध नहीं है, इसलिए जलवायु आकलन कम निश्चित है।",
    "Historical average temperature is outside this profile's illustrative suitability band.": "ऐतिहासिक औसत तापमान इस फसल की उदाहरणात्मक उपयुक्तता सीमा से बाहर है।",
    "Total precipitation is unavailable, reducing water-availability confidence.": "कुल वर्षा उपलब्ध नहीं है, इसलिए पानी की उपलब्धता का आकलन कम निश्चित है।",
    "Historical precipitation differs from this profile's illustrative water band; irrigation or drainage may matter.": "ऐतिहासिक वर्षा इस फसल की उदाहरणात्मक जल सीमा से अलग है; सिंचाई या जल निकासी महत्वपूर्ण हो सकती है।",
    "Some historical environmental observations are missing; scores use available values only.": "कुछ ऐतिहासिक पर्यावरणीय अवलोकन उपलब्ध नहीं हैं; स्कोर में केवल उपलब्ध मान लिए गए हैं।",
    "Water-demanding without dependable rainfall or irrigation": "भरोसेमंद बारिश या सिंचाई के बिना अधिक पानी चाहिए।",
    "Repeated cereal rotations can reduce diversity": "बार-बार अनाज फसलें लगाने से विविधता घट सकती है।",
    "Sensitive to prolonged water stress around flowering": "फूल आने के समय लंबे जल तनाव से असर हो सकता है।",
    "Cereal-after-cereal sequences reduce family diversity": "लगातार अनाज फसलें लगाने से परिवार विविधता घटती है।",
    "Waterlogging can be damaging": "खेत में जलभराव से नुकसान हो सकता है।",
    "Requires local disease and market assessment": "स्थानीय रोग और बाजार का आकलन जरूरी है।",
    "A broader crop list was used where location-specific seasonal coverage was unavailable.": "स्थान-विशिष्ट मौसमी जानकारी न होने पर व्यापक फसल सूची उपयोग की गई।",
    "Regional crop coverage is unavailable; these climate-screened profiles are not locally confirmed choices.": "क्षेत्रीय फसल जानकारी उपलब्ध नहीं; जलवायु-आधारित विकल्प स्थानीय रूप से पुष्ट नहीं हैं।",
    "Season-specific climate observations were incomplete; annual climate values were used where needed.": "मौसम-विशिष्ट जलवायु अवलोकन अधूरे थे; जहां जरूरी था वहां वार्षिक डेटा लिया गया।",
    "No winter-to-summer crop pair is available in the regional and crop profiles.": "क्षेत्रीय और फसल डेटा में सर्दी से गर्मी तक की फसल जोड़ी उपलब्ध नहीं है।",
    "Rice": "चावल", "Maize": "मक्का", "Wheat": "गेहूं", "Lentil": "मसूर", "Mustard": "सरसों", "Chickpea": "चना", "Millet": "बाजरा", "Mung bean": "मूंग",
    "Not provided.": "उपलब्ध नहीं।", "No suitable options found": "उपयुक्त विकल्प नहीं मिले",
    "The available regional crop profiles and seasonal screening did not produce a plan. Review the location and soil details.": "उपलब्ध क्षेत्रीय फसल प्रोफाइल और मौसमी जांच से योजना नहीं बनी। स्थान और मिट्टी का विवरण देखें।",
    "Your three rotation options for the next season": "अगले मौसम के लिए आपके तीन फसल चक्र विकल्प",
    "Things to keep in mind": "ध्यान रखने योग्य बातें", "Overall reasons": "समग्र कारण",
    "How AgriVeya scores crops": "AgriVeya फसलों को कैसे स्कोर करता है", "Data sources": "डेटा स्रोत",
    "Raw response (for debugging)": "कच्चा जवाब (डिबगिंग के लिए)", "What the climate has done here": "यहां की जलवायु का इतिहास",
    "Total rainfall": "कुल वर्षा", "Average sunlight": "औसत धूप", "NASA POWER observations.": "NASA POWER अवलोकन।",
    "How the score was built": "स्कोर कैसे बना", "Best match": "सबसे उपयुक्त", "Option": "विकल्प",
    "Strong fit": "बहुत उपयुक्त", "Moderate fit": "मध्यम उपयुक्त", "Weak fit": "कम उपयुक्त",
    "Suitability score": "उपयुक्तता स्कोर", "Why it ranked here": "इस रैंक का कारण",
    "Why it fits": "क्यों उपयुक्त", "Risks and trade-offs": "जोखिम और समझौते",
    "No benefits listed.": "कोई लाभ सूचीबद्ध नहीं।", "No specific risks listed.": "कोई विशेष जोखिम सूचीबद्ध नहीं।",
    "Then": "फिर", "season": "मौसम", "Climate data: NASA POWER (historical observations, not a forecast). Scores come from a simple, explainable rule set and do not predict yield.": "जलवायु डेटा: NASA POWER (ऐतिहासिक अवलोकन, पूर्वानुमान नहीं)। स्कोर सरल, समझने योग्य नियमों पर आधारित हैं और उपज का पूर्वानुमान नहीं करते।",
    "Location selected. Coordinates updated.": "स्थान चुना गया। निर्देशांक अपडेट हुए।",
    "Location suggestions": "स्थान सुझाव",
    "Location permission unavailable; search still works.": "स्थान की अनुमति उपलब्ध नहीं है; खोज फिर भी काम करेगी।",
    "Current location set; nearby results are prioritized.": "वर्तमान स्थान सेट हुआ; पास के नतीजों को प्राथमिकता मिलेगी।",
    "Could not refresh the location name in the selected language.": "चुनी गई भाषा में स्थान का नाम अपडेट नहीं हो सका।",
    "Historical observations, not a forecast.": "ऐतिहासिक अवलोकन, पूर्वानुमान नहीं।",
    "Searching locations…": "स्थान खोजे जा रहे हैं…", "No matching places found.": "कोई मिलती-जुलती जगह नहीं मिली।",
    "Location search is unavailable. Please try again.": "स्थान खोज उपलब्ध नहीं है। फिर कोशिश करें।",
    "Getting climate data from NASA POWER": "NASA POWER से जलवायु डेटा प्राप्त हो रहा है",
    "This usually takes a few seconds. Your options will appear here.": "इसमें कुछ सेकंड लगते हैं। आपके विकल्प यहां दिखेंगे।",
    "Working…": "काम हो रहा है…", "Can't reach the AgriVeya server": "AgriVeya सर्वर से कनेक्ट नहीं हो सका",
    "Something went wrong on the server": "सर्वर में समस्या हुई", "Check your details": "अपना विवरण जांचें",
    "The request took too long": "अनुरोध में बहुत समय लगा", "NASA climate data is unavailable": "NASA जलवायु डेटा उपलब्ध नहीं है",
    "The server could not use these details": "सर्वर इन विवरणों का उपयोग नहीं कर सका",
    "Location not available": "स्थान उपलब्ध नहीं", "Couldn't get your location": "आपकी स्थिति नहीं मिल सकी",
    "Start the backend to load NASA POWER data. AgriVeya never shows made-up climate values.": "NASA POWER डेटा के लिए बैकएंड शुरू करें। AgriVeya काल्पनिक जलवायु डेटा नहीं दिखाता।",
    "days": "दिन", "climate data unavailable": "जलवायु डेटा उपलब्ध नहीं है",
    "Allow location access in your browser, or enter the coordinates by hand.": "ब्राउज़र में स्थान की अनुमति दें या निर्देशांक स्वयं भरें।",
    "This browser can't share your location. Enter the coordinates by hand.": "यह ब्राउज़र स्थान साझा नहीं कर सकता। निर्देशांक स्वयं भरें।",
    "Latitude must be a number between -90 and 90.": "अक्षांश -90 और 90 के बीच होना चाहिए।",
    "Longitude must be a number between -180 and 180.": "देशांतर -180 और 180 के बीच होना चाहिए।",
    "Set both a start and an end date, or leave both empty.": "शुरू और समाप्ति दोनों तारीखें भरें या दोनों खाली छोड़ें।",
    "The start date must be before the end date.": "शुरू की तारीख समाप्ति तारीख से पहले होनी चाहिए।",
    "NASA POWER did not answer in time. Wait a moment and try again.": "NASA POWER से समय पर जवाब नहीं मिला। थोड़ी देर बाद फिर कोशिश करें।",
    "Adjust the form and try again.": "फॉर्म में बदलाव करके फिर कोशिश करें।",
    "Listen": "सुनें", "Listen to this plan in English.": "इस योजना को अंग्रेज़ी में सुनें।",
    "Pause": "रोकें", "Resume": "फिर चलाएं", "Stop": "बंद करें",
    "Speech synthesis is unavailable in this browser.": "इस ब्राउज़र में वाक् सुविधा उपलब्ध नहीं है।",
    "No English voice is available in this browser.": "इस ब्राउज़र में अंग्रेज़ी आवाज़ उपलब्ध नहीं है।",
    "Speech playback failed. Try again.": "आवाज़ नहीं चल सकी। फिर कोशिश करें।"
  }
};

const originalText = new WeakMap();
let snapshotData = null;
let latestRecommendationData = null;
let focusedRotationIndex = 0;
let speechSessionId = 0;
let activeSpeechControls = null;
let activeSpeechState = "idle";
function applyLanguage() {
  const language = $("language-select") ? $("language-select").value : "en";
  document.documentElement.lang = language;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (!originalText.has(node)) originalText.set(node, node.nodeValue);
    const source = originalText.get(node);
    const key = source.trim();
    if (!key) continue;
    const optionMatch = key.match(/^Option (\d+)$/);
    const translated = language === "en" ? key : (LANGUAGE_TEXT[language][key] || (optionMatch ? `${translatedText("Option", language)} ${optionMatch[1]}` : key));
    node.nodeValue = source.replace(key, translated);
  }
  const search = $("location-search");
  const suggestions = $("location-suggestions");
  if (search) {
    search.placeholder = language === "ne" ? "सहर, जिल्ला वा देश" : language === "hi" ? "शहर, जिला या देश" : "City, district, or country";
    search.setAttribute("aria-label", LANGUAGE_TEXT[language] && LANGUAGE_TEXT[language]["Search for a place"] || "Search for a place");
  }
  if (suggestions) {
    suggestions.setAttribute("aria-label", LANGUAGE_TEXT[language] && LANGUAGE_TEXT[language]["Location suggestions"] || "Location suggestions");
  }
  document.title = language === "ne" ? "AgriVeya: जलवायु-स्मार्ट बाली चक्र" : language === "hi" ? "AgriVeya: जलवायु-स्मार्ट फसल चक्र" : "AgriVeya: Climate-smart rotation";
  const nav = document.querySelector(".menu");
  if (nav) nav.setAttribute("aria-label", language === "en" ? "Main navigation" : language === "ne" ? "मुख्य नेभिगेसन" : "मुख्य नेविगेशन");
  const brand = document.querySelector(".brand");
  if (brand) brand.setAttribute("aria-label", language === "en" ? "AgriVeya home" : language === "ne" ? "AgriVeya गृहपृष्ठ" : "AgriVeya होम");
  const menuToggle = $("menu-toggle");
  if (menuToggle) menuToggle.setAttribute("aria-label", language === "en" ? "Open menu" : language === "ne" ? "मेनु खोल्नुहोस्" : "मेनू खोलें");
  if (snapshotData) updateSnapshot(snapshotData, language);
}

function translatedText(english, language = $("language-select") && $("language-select").value) {
  return language === "en" || !LANGUAGE_TEXT[language] ? english : LANGUAGE_TEXT[language][english] || english;
}

function updateSnapshot(data, language) {
  const summary = data.summary || {};
  const range = data.dateRange || {};
  const days = Array.isArray(data.dailyObservations) ? data.dailyObservations.length : null;
  const translate = (text) => translatedText(text, language);
  $("snapPeriod").textContent = `${CONFIG.snapshot.label}, ${range.start || "?"} – ${range.end || "?"}`;
  $("snapTemp").textContent = `${fmt(summary.averageTemperatureC, 1)} °C`;
  $("snapHum").textContent = `${fmtInt(summary.averageRelativeHumidityPercent)}%`;
  $("snapDry").textContent = days ? `${summary.dryDays} / ${days} ${translate("days")}` : `${summary.dryDays ?? "n/a"} ${translate("days")}`;
  $("snapFoot").textContent = `${translate("Total rainfall")} ${fmtInt(summary.totalPrecipitationMm)} mm. ${translate("Historical observations, not a forecast.")}`;
}

/* ==========================================================
   CONFIG: edit these lists if the backend rejects a value.
   The "value" must match what Backend/data/cropDataset.js and
   Backend/services/recommendationEngine.js accept.
   If the backend says a value is unsupported, the message is
   shown on the page and tells you what to change here.
   ========================================================== */
const CONFIG = {
  soilTypes: [
    { value: "sand", label: "Sand" },
    { value: "loamy-sand", label: "Loamy Sand" },
    { value: "sandy-loam", label: "Sandy Loam" },
    { value: "loam", label: "Loam" },
    { value: "silt-loam", label: "Silt Loam" },
    { value: "silt", label: "Silt" },
    { value: "sandy-clay-loam", label: "Sandy Clay Loam" },
    { value: "clay-loam", label: "Clay Loam" },
    { value: "silty-clay-loam", label: "Silty Clay Loam" },
    { value: "sandy-clay", label: "Sandy Clay" },
    { value: "silty-clay", label: "Silty Clay" },
    { value: "clay", label: "Clay" },
    { value: "unknown", label: "Don't Know — I'm not sure about my soil texture." }
  ],
  cropLabels: {
    rice: "Rice",
    maize: "Maize",
    wheat: "Wheat",
    lentil: "Lentil",
    mustard: "Mustard",
    chickpea: "Chickpea",
    millet: "Millet",
    "mung-bean": "Mung bean"
  },
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
  stopRecommendationSpeech();
  resultsEl.replaceChildren(...nodes);
  applyLanguage();
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
      text: period.start && period.end
        ? `${translatedText("NASA POWER observations")} (${period.start} – ${period.end}).`
        : "NASA POWER observations."
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
function normaliseSequence(rec) {
  let seq = pick(rec, ["sequence", "cropSequence", "rotation", "rotationSequence"]);
  if (typeof seq === "string") seq = seq.split(/→|->|>/).map((s) => s.trim()).filter(Boolean);

  if (Array.isArray(seq) && seq.length) {
    return seq.map((item) =>
      typeof item === "string"
        ? { name: item }
        : { name: pick(item, ["name", "crop", "cropName", "id"]) || "Crop", season: pick(item, ["season", "sowingSeason"]) }
    );
  }

  // Fallback to the recommended crop when older responses omit a sequence.
  const next = pick(rec, ["crop", "cropName", "name"]);
  const nextName = next && typeof next === "object" ? pick(next, ["name", "id"]) : next;
  return nextName ? [{ name: nextName, season: pick(rec, ["season"]) }] : [];
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
  const sequence = normaliseSequence(rec);
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

function speechIcon(name) {
  const svg = el("svg", { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" });
  if (name === "speaker") {
    svg.append(
      el("path", { d: "M4 10v4h3l5 4V6l-5 4H4z", fill: "currentColor" }),
      el("path", { d: "M15 9a5 5 0 0 1 0 6M17.5 6.5a8.5 8.5 0 0 1 0 11", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round" })
    );
  } else if (name === "pause") {
    svg.append(el("path", { d: "M8 5h3v14H8zM15 5h3v14h-3z", fill: "currentColor" }));
  } else if (name === "resume") {
    svg.append(el("path", { d: "M7 4.5v15l12-7.5-12-7.5z", fill: "currentColor" }));
  } else {
    svg.append(el("path", { d: "M6 6h12v12H6z", fill: "currentColor" }));
  }
  return svg;
}

function setSpeechControls(controls, state, message = "") {
  const listen = controls.querySelector(".speech-listen");
  const pause = controls.querySelector(".speech-pause");
  const stop = controls.querySelector(".speech-stop");
  const paused = state === "paused";
  const playing = state === "speaking" || paused;

  listen.hidden = playing;
  pause.hidden = !playing;
  stop.hidden = !playing;
  pause.replaceChildren(
    speechIcon(paused ? "resume" : "pause"),
    el("span", { text: translatedText(paused ? "Resume" : "Pause") })
  );
  pause.setAttribute("aria-label", translatedText(paused ? "Resume" : "Pause"));
  pause.title = translatedText(paused ? "Resume" : "Pause");
  stop.setAttribute("aria-label", translatedText("Stop"));
  stop.title = translatedText("Stop");
  controls.querySelector(".speech-status").textContent = message;
}

function stopRecommendationSpeech() {
  speechSessionId += 1;
  const controls = activeSpeechControls;
  activeSpeechControls = null;
  activeSpeechState = "idle";
  if (typeof window !== "undefined" && window.speechSynthesis && typeof window.speechSynthesis.cancel === "function") {
    window.speechSynthesis.cancel();
  }
  if (controls) setSpeechControls(controls, "idle");
}

function startRecommendationSpeech(controls, text) {
  const synthesis = typeof window !== "undefined" ? window.speechSynthesis : null;
  if (!synthesis || typeof synthesis.speak !== "function" || typeof SpeechSynthesisUtterance === "undefined") {
    setSpeechControls(controls, "idle", translatedText("Speech synthesis is unavailable in this browser."));
    return;
  }

  stopRecommendationSpeech();
  const sessionId = speechSessionId;
  let utterance;
  try {
    utterance = new SpeechSynthesisUtterance(text);
  } catch {
    setSpeechControls(controls, "idle", translatedText("Speech playback failed. Try again."));
    return;
  }
  utterance.lang = "en-US";
  const voices = (typeof synthesis.getVoices === "function" ? synthesis.getVoices() : []) || [];
  const englishVoice = voices.find((voice) => /^en(?:-|$)/i.test(voice.lang));
  if (englishVoice) utterance.voice = englishVoice;

  activeSpeechControls = controls;
  activeSpeechState = "speaking";
  setSpeechControls(controls, "speaking");

  const finish = (message = "") => {
    if (sessionId !== speechSessionId || activeSpeechControls !== controls) return;
    activeSpeechControls = null;
    activeSpeechState = "idle";
    setSpeechControls(controls, "idle", message);
  };
  utterance.onend = () => finish();
  utterance.onerror = (event) => finish(translatedText(
    event.error === "voice-unavailable"
      ? "No English voice is available in this browser."
      : "Speech playback failed. Try again."
  ));

  try {
    synthesis.speak(utterance);
  } catch {
    finish(translatedText("Speech playback failed. Try again."));
  }
}

function createSpeechControls(text) {
  const controls = el("div", {
    class: "speech-controls",
    role: "group",
    "aria-label": translatedText("Listen to this plan in English.")
  });
  const listen = el("button", {
    type: "button",
    class: "speech-button speech-listen",
    "aria-label": translatedText("Listen to this plan in English."),
    title: translatedText("Listen to this plan in English.")
  }, speechIcon("speaker"), el("span", { text: translatedText("Listen") }));
  const pause = el("button", {
    type: "button",
    class: "speech-button speech-pause",
    "aria-label": translatedText("Pause"),
    title: translatedText("Pause"),
    hidden: ""
  }, speechIcon("pause"), el("span", { text: translatedText("Pause") }));
  const stop = el("button", {
    type: "button",
    class: "speech-button speech-stop",
    "aria-label": translatedText("Stop"),
    title: translatedText("Stop"),
    hidden: ""
  }, speechIcon("stop"), el("span", { text: translatedText("Stop") }));
  const status = el("span", { class: "speech-status", "aria-live": "polite" });
  controls.append(listen, pause, stop, status);
  listen.addEventListener("click", () => startRecommendationSpeech(controls, text));
  pause.addEventListener("click", () => {
    if (activeSpeechControls !== controls || !window.speechSynthesis) return;
    try {
      if (activeSpeechState === "paused") {
        window.speechSynthesis.resume();
        activeSpeechState = "speaking";
        setSpeechControls(controls, "speaking");
      } else {
        window.speechSynthesis.pause();
        activeSpeechState = "paused";
        setSpeechControls(controls, "paused");
      }
    } catch {
      stopRecommendationSpeech();
      setSpeechControls(controls, "idle", translatedText("Speech playback failed. Try again."));
    }
  });
  stop.addEventListener("click", stopRecommendationSpeech);
  return controls;
}

const SEASON_MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatSeasonMonthWindow(months, language, season, period) {
  if (!Array.isArray(months) || months.length !== 2 ||
      months.some((month) => !Number.isInteger(month) || month < 1 || month > 12)) return "";
  const monthIndex = period === "planting" ? 0 : 1;
  if (language === "ne") {
    const formatted = AgriVeyaCalendar.formatMonthWindow(
      months, season, period, AgriVeyaCalendar.getPlanStartYear(), language
    );
    if (!formatted) return "";
    const monthNames = formatted.split(" – ").map((range) => range.trim().split(/\s+/)[1]);
    return monthNames.length === 2 && monthNames[monthIndex] ? monthNames[monthIndex] : "";
  }
  return translatedText(SEASON_MONTH_NAMES[months[monthIndex] - 1], language);
}

function formatElapsedDurationMonths(durationDays, language) {
  if (!Array.isArray(durationDays) || durationDays.length !== 2 ||
      !durationDays.every((days) => Number.isFinite(days) && days > 0)) return "";
  const monthRange = durationDays
    .map((days) => Math.max(1, Math.round(days / (365 / 12))))
    .sort((left, right) => left - right);
  const value = monthRange[0] === monthRange[1]
    ? String(monthRange[0])
    : `${monthRange[0]}–${monthRange[1]}`;
  return `${value} ${translatedText(monthRange[1] === 1 ? "month" : "months", language)}`;
}

function buildAnnualPlanSpeechText(rec, index, plan, phases) {
  const parts = [];
  const add = (value) => {
    if (value) parts.push(String(value).trim());
  };
  const score = pick(rec, ["suitabilityScore"]);

  add(plan.coverage === "partial" ? "Best feasible seasonal alternative." : index === 0 ? "Best match." : `Option ${index + 1}.`);
  if (Number.isFinite(score)) add(`Screening score: ${score} out of 100.`);
  if (plan.coverage === "complete") {
    add("Complete three-season plan.");
  } else if (plan.coverage === "partial") {
    add("Some seasons are not shown because local crop coverage or climate screening did not support them.");
    if (Array.isArray(plan.omittedSeasons) && plan.omittedSeasons.length) {
      add(`Not included: ${plan.omittedSeasons.join(", ")}.`);
    }
  }

  phases.forEach((phase, phaseIndex) => {
    const season = typeof phase.season === "string" ? phase.season : "Season";
    const seasonLabel = season.charAt(0).toUpperCase() + season.slice(1);
    const rawCrop = typeof phase.crop === "string" ? phase.crop : toText(phase.crop);
    const crop = CONFIG.cropLabels[phase.cropId] || CONFIG.cropLabels[rawCrop] || rawCrop || "Not provided";
    add(`${seasonLabel} crop: ${crop}.`);

    const planting = formatSeasonMonthWindow(phase.plantingMonths, "en", season, "planting");
    const harvest = formatSeasonMonthWindow(phase.harvestMonths, "en", season, "harvest");
    const duration = formatElapsedDurationMonths(phase.durationDays, "en");
    if (planting && harvest) {
      add(`Planting to harvest: ${planting} to ${harvest}${duration ? ` (${duration})` : ""}.`);
    } else {
      if (planting) add(`Plant: ${planting}.`);
      if (harvest) add(`Harvest: ${harvest}.`);
      if (duration) add(`Duration: ${duration}.`);
    }
    if (!planting && !harvest && phase.monthRange) add(`${phase.monthRange}.`);

    const waterNeeds = { low: "Low water need", medium: "Moderate water need", high: "High water need" };
    if (waterNeeds[phase.waterNeed]) add(`${waterNeeds[phase.waterNeed]}.`);
    if (phase.soilFit === true) add("Soil texture matches profile.");
    else if (phase.soilFit === false) add("Soil texture is not a direct profile match.");

    const climate = phase.climate || {};
    if (Number.isFinite(climate.averageTemperatureC)) {
      add(`Average temperature: ${fmt(climate.averageTemperatureC, 1)} degrees Celsius.`);
    }
    if (Number.isFinite(climate.observationDays)) add(`${climate.observationDays} climate observations.`);

    const reasons = toList(phase.reasons);
    const risks = toList(phase.risks);
    if (reasons.length) add(`Why this crop: ${reasons.join(" ")}`);
    if (risks.length) add(`Crop risks: ${risks.join(" ")}`);

    const transition = phase.transitionAfter;
    if (transition && phaseIndex < phases.length - 1) {
      if (transition.type === "overlap") {
        add(`Harvest and planting may overlap by ${transition.months} ${transition.months === 1 ? "month" : "months"}.`);
      } else if (transition.months === 0) {
        add("No full idle month between crops.");
      } else {
        add(`Estimated gap: ${transition.months} ${transition.months === 1 ? "month" : "months"}.`);
      }
    }
  });

  const cycleTransition = plan.cycleTransition;
  if (cycleTransition) {
    const transition = cycleTransition.type === "overlap"
      ? `Harvest and planting may overlap by ${cycleTransition.months} ${cycleTransition.months === 1 ? "month" : "months"}.`
      : cycleTransition.months === 0
        ? "No full idle month between crops."
        : `Estimated gap: ${cycleTransition.months} ${cycleTransition.months === 1 ? "month" : "months"}.`;
    add(`Winter to Summer next cycle: ${transition}`);
  }
  if (phases.length) add("Indicative calendar; confirm local dates before planting.");
  if (plan.rotationBenefit) add(`Rotation benefit: ${plan.rotationBenefit}`);
  const risks = toList(rec.risks);
  if (risks.length) add(`Risks and trade-offs: ${risks.join(" ")}`);
  return parts.join(" ");
}

function renderAnnualRotationPlan(rec, index, focusedIndex = 0) {
  const plan = rec.seasonalPlan || {};
  const language = $("language-select") ? $("language-select").value : "en";
  const legacyPhases = ["summer", "monsoon", "winter"].map((season) => plan[season])
    .filter(Boolean)
    .map((phase) => ({ ...phase, season: phase.season || (phase.cropId === "mung-bean" ? "summer" : "winter") }));
  const phases = Array.isArray(plan.phases) ? plan.phases : legacyPhases;
  const phaseCard = (phase) => {
    const season = phase.season;
    const climate = phase.climate || {};
    const observations = Number.isFinite(climate.observationDays)
      ? `${climate.observationDays} ${translatedText("observations")}`
      : "";
    const temperature = Number.isFinite(climate.averageTemperatureC)
      ? `${translatedText("Average temperature")}: ${fmt(climate.averageTemperatureC, 1)} °C`
      : "";
    const planting = formatSeasonMonthWindow(phase.plantingMonths, language, season, "planting");
    const harvest = formatSeasonMonthWindow(phase.harvestMonths, language, season, "harvest");
    const duration = formatElapsedDurationMonths(phase.durationDays, language);
    const timing = planting && harvest
      ? `${translatedText("Planting to harvest", language)}: ${planting} → ${harvest}${duration ? ` (${duration})` : ""}`
      : [planting ? `${translatedText("Plant", language)}: ${planting}` : "",
        harvest ? `${translatedText("Harvest", language)}: ${harvest}` : "", duration]
        .filter(Boolean)
        .join(" · ");
    const waterNeedLabels = {
      low: "Low water need",
      medium: "Moderate water need",
      high: "High water need"
    };
    const conditions = [
      waterNeedLabels[phase.waterNeed] ? translatedText(waterNeedLabels[phase.waterNeed]) : "",
      phase.soilFit === true ? translatedText("Soil texture matches profile")
        : phase.soilFit === false ? translatedText("Soil texture is not a direct profile match") : ""
    ].filter(Boolean);
    const reasons = toList(phase.reasons);
    const cropNotes = [...reasons, ...toList(phase.risks)]
      .filter((note, noteIndex, notes) => notes.indexOf(note) === noteIndex);
    const climateDetails = temperature || observations
      ? `${temperature}${temperature && observations ? " · " : ""}${observations}`
      : "";
    const compactReason = (reason) => {
      if (reason.includes("Historical average temperature is within")) return "Climate profile fits";
      if (reason.includes("Historical average temperature is outside")) return "Climate profile needs local review";
      if (reason.includes("Historical annual precipitation is within")) return "Rainfall profile fits";
      if (reason.includes("is marked compatible with the selected")) return "Soil profile fit";
      if (reason.includes("not a direct match for the selected")) return "Soil needs local review";
      if (reason.startsWith("Changes crop family")) return "Different crop family";
      if (reason.startsWith("Adds a legume")) return "Legume rotation benefit";
      return reason;
    };
    const icon = season === "summer" ? "☀" : season === "monsoon" ? "☂" : "❄";
    return el(
      "section",
      { class: `season-phase ${season}` },
      el("span", { class: "season-icon", "aria-hidden": "true", text: icon }),
      el("div", {},
        el("h4", { text: `${translatedText(season[0].toUpperCase() + season.slice(1))} ${translatedText("crop")}` }),
        el("strong", { text: translatedText(phase.crop || "Not provided.") }),
        timing
          ? el("div", { class: "season-dates" }, el("small", { text: timing }))
          : el("small", { text: language === "ne"
            ? translatedText("BS conversion unavailable for this date.", language)
            : translatedText(phase.monthRange || "", language) }),
        conditions.length
          ? el("div", { class: "season-conditions" },
            conditions.map((condition) => el("span", { class: "season-condition", text: condition }))
          )
          : null,
        reasons.length
          ? el("p", { class: "season-reason", text: translatedText(compactReason(reasons[0])) })
          : null,
        cropNotes.length
          ? el("details", { class: "phase-notes" },
            el("summary", { text: "Why this crop?" }),
            climateDetails ? el("p", { class: "season-climate", text: climateDetails }) : null,
            bulletList(cropNotes.map((note) => translatedText(note)))
          )
          : null,
      )
    );
  };
  const transitionText = (transition) => {
    if (!transition) return "";
    if (transition.type === "overlap") {
      return `${translatedText("Harvest and planting may overlap")}: ${transition.months} ${translatedText(transition.months === 1 ? "month" : "months")}`;
    }
    return transition.months === 0
      ? translatedText("No full idle month between crops")
      : `${translatedText("Estimated gap")}: ${transition.months} ${translatedText(transition.months === 1 ? "month" : "months")}`;
  };
  const timeline = [];
  phases.forEach((phase, phaseIndex) => {
    timeline.push(phaseCard(phase));
    if (phaseIndex < phases.length - 1) {
      const transition = phase.transitionAfter;
      timeline.push(el("div", { class: `season-transition${transition && transition.type === "overlap" ? " overlap" : ""}` },
        el("span", { class: "transition-arrow", "aria-hidden": "true", text: "→" }),
        el("small", { text: transitionText(transition) })
      ));
    }
  });
  const risks = toList(rec.risks);
  const score = pick(rec, ["suitabilityScore"]);
  const isFocused = index === focusedIndex;
  const speechText = buildAnnualPlanSpeechText(rec, index, plan, phases);
  const focusButton = el("button", {
    type: "button",
    class: "plan-focus",
    "data-plan-index": index,
    "aria-pressed": String(isFocused),
    text: translatedText(isFocused ? "Highlighted plan" : "Highlight this plan")
  });
  const actions = el("div", { class: "rotation-plan-actions" },
    focusButton,
    createSpeechControls(speechText)
  );

  return el(
    "article",
    { class: `glass rotation-plan${index === 0 ? " top" : ""}${isFocused ? " focused" : ""}` },
    el("div", { class: "rotation-plan-heading" },
      el("span", { class: "badge", text: plan.coverage === "partial"
        ? translatedText("Best feasible seasonal alternative")
        : index === 0 ? "Best match" : `Option ${index + 1}` }),
      Number.isFinite(score) ? el("span", { class: "screening-score", text: `${translatedText("Screening score")}: ${score}/100` }) : null,
      actions
    ),
    plan.coverage === "complete"
      ? el("p", { class: "coverage-label", text: translatedText("Complete three-season plan") })
      : plan.coverage === "partial"
        ? el("div", { class: "coverage-label partial" },
        el("p", { text: translatedText("Some seasons are not shown because local crop coverage or climate screening did not support them.") }),
        plan.omittedSeasons && plan.omittedSeasons.length
          ? el("small", { text: `${translatedText("Not included")}: ${plan.omittedSeasons.map((season) => translatedText(season[0].toUpperCase() + season.slice(1))).join(", ")}` })
          : null
        )
        : null,
    el("div", { class: "season-phases" }, ...timeline),
    plan.cycleTransition
      ? el("p", { class: `cycle-transition${plan.cycleTransition.type === "overlap" ? " overlap" : ""}` },
        el("strong", { text: `${translatedText("Winter")} → ${translatedText("Summer")} ${translatedText("next cycle")}: ` }),
        transitionText(plan.cycleTransition)
      )
      : null,
    el("small", { class: "calendar-note", text: translatedText("Indicative calendar; confirm local dates before planting.") }),
    plan.rotationBenefit ? el("p", { class: "rotation-benefit" },
      el("strong", { text: `${translatedText("Rotation benefit")}: ` }),
      translatedText(plan.rotationBenefit)
    ) : null,
    el("details", { class: "plan-details" },
      el("summary", { text: "More details" }),
      risks.length ? el("div", { class: "risks" }, el("h4", { text: "Risks and trade-offs" }), bulletList(risks)) : null
    )
  );
}

/* ---------- Whole result page ---------- */
function renderResults(data, shouldScroll = true) {
  const recs = Array.isArray(data.recommendations) ? data.recommendations : [];
  const stack = el("div", { class: "results-stack" });
  const period = data.climatePeriod || {};

  const locationName = data.location && (data.location.displayName || data.location.name || data.location.context);
  if (locationName) {
    stack.append(el("section", { class: "glass selected-location-summary" },
      el("span", { class: "location-pin", "aria-hidden": "true", text: "⌖" }),
      el("div", {}, el("small", { text: "Selected farm location" }), el("strong", { text: locationName }))
    ));
  }
  const farm = data.farmProfile || {};
  const soilType = CONFIG.soilTypes.find((soil) => soil.value === farm.soilType);
  const preferredCrops = Array.isArray(farm.preferredCrops) ? farm.preferredCrops : [];
  if (soilType || preferredCrops.length) {
    stack.append(el("div", { class: "farm-indicators" },
      soilType ? el("div", { class: "farm-indicator soil-indicator" },
        el("span", { class: "indicator-icon", "aria-hidden": "true", text: "◉" }),
        el("span", {}, el("small", { text: "Soil texture" }), el("strong", { text: translatedText(soilType.label) }))
      ) : null,
      preferredCrops.length ? el("div", { class: "farm-indicator crop-indicator" },
        el("span", { class: "indicator-icon", "aria-hidden": "true", text: "☆" }),
        el("span", {}, el("small", { text: "Preferred crops" }), el("strong", {
          text: preferredCrops.map((crop) => translatedText(CONFIG.cropLabels[crop.id] || crop.name)).join(", ")
        }))
      ) : null
    ));
  }
  const preferenceStatuses = {
    included: "Included in a recommended plan.",
    "not-regional": "Not included in this location's regional crop profiles.",
    "climate-screened": "Seasonal temperature observations did not fit this crop's screening range.",
    "soil-mismatch": "The selected soil texture is not a direct match for this crop profile.",
    "not-ranked": "Passed initial screens but did not appear in the top three plans."
  };
  const preferenceNotes = Array.isArray(data.preferenceAssessment) ? data.preferenceAssessment : [];
  if (preferenceNotes.length) {
    stack.append(el("details", { class: "glass preference-assessment" },
      el("summary", { text: "How preferences fit" }),
      bulletList(preferenceNotes.map((assessment) => {
        const cropName = translatedText(CONFIG.cropLabels[assessment.cropId] || assessment.cropId);
        const status = translatedText(preferenceStatuses[assessment.status] || "Not ranked.");
        const alternatives = Array.isArray(assessment.alternatives)
          ? [...new Set(assessment.alternatives)]
              .map((id) => translatedText(CONFIG.cropLabels[id] || id))
              .join(", ")
          : "";
        return `${cropName}: ${status}${alternatives
          ? ` ${translatedText("Alternatives in the plan:")} ${alternatives}.`
          : ""}`;
      }))
    ));
  }

  stack.append(
    el(
      "div",
      { class: "notice" },
      el("p", {
        text: `${translatedText("NASA POWER observations")}${period.start ? ` (${period.start} – ${period.end})` : ""}. ${translatedText("Historical observations, not a forecast.")} ${translatedText("Scores rank crops by simple rules and do not predict yield.")}`
      }),
      toList(data.missingClimateData).length
        ? el("p", { text: translatedText("Some climate values were missing, so scores that depend on them are less certain.") })
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
        el("p", { text: "The available regional crop profiles and seasonal screening did not produce a plan. Review the location and soil details." })
      )
    );
  } else if (data.rotationMode === "annual-rotation" || data.rotationMode === "winter-summer") {
    stack.append(el("h3", { class: "results-title", text: "Annual crop rotation plans" }));
    if (data.rotationMode === "winter-summer") {
      stack.lastChild.textContent = translatedText("Winter–summer rotation plans");
    }
    recs.forEach((rec, index) => stack.append(renderAnnualRotationPlan(rec, index, focusedRotationIndex)));
  } else {
    stack.append(el("h3", { class: "results-title", text: "Your three rotation options for the next season" }));
    recs.forEach((rec, i) => stack.append(renderRecommendation(rec, i, data)));
  }

  const flags = toList(data.riskFlags);
  if (flags.length) {
    stack.append(el("details", { class: "glass flags flags-details" },
      el("summary", { text: "Things to keep in mind" }),
      bulletList(flags)
    ));
  }

  const more = el("section", { class: "glass more" });
  const reasons = toList(data.reasons);
  if (reasons.length) more.append(el("details", {}, el("summary", { text: "Overall reasons" }), bulletList(reasons)));
  if (data.methodology) more.append(el("details", {}, el("summary", { text: "How AgriVeya scores crops" }), renderAny(data.methodology)));
  if (data.dataSources) more.append(el("details", {}, el("summary", { text: "Data sources" }), renderAny(data.dataSources)));
  more.append(el("details", {}, el("summary", { text: "Raw response (for debugging)" }), el("pre", { text: JSON.stringify(data, null, 2) })));
  stack.append(more);

  const focusButtons = [...stack.querySelectorAll(".plan-focus")];
  focusButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const focusedIndex = Number(button.dataset.planIndex);
      focusedRotationIndex = focusedIndex;
      focusButtons.forEach((candidate) => {
        const isFocused = Number(candidate.dataset.planIndex) === focusedIndex;
        candidate.setAttribute("aria-pressed", String(isFocused));
        candidate.textContent = translatedText(isFocused ? "Highlighted plan" : "Highlight this plan");
        candidate.closest(".rotation-plan").classList.toggle("focused", isFocused);
      });
    });
  });

  showState(stack);
  if (shouldScroll) scrollToResults();
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
  if (locationSelectionPending) {
    throw new Error("Choose a location suggestion to use your search.");
  }
  if (!selectedFarmLocation) {
    throw new Error("Please select or resolve a farm location first.");
  }
  if (Math.abs(Number(selectedFarmLocation.latitude) - latitude) > 0.000001 ||
      Math.abs(Number(selectedFarmLocation.longitude) - longitude) > 0.000001) {
    throw new Error("Selected location coordinates must match form coordinates.");
  }

  const farmerPriorities = {};
  CONFIG.priorities.forEach((p) => {
    const checked = document.querySelector(`input[name="${p.key}"]:checked`);
    farmerPriorities[p.key] = checked ? checked.value : CONFIG.defaultPriorityLevel;
  });

  const payload = {
    latitude,
    longitude,
    location: { ...selectedFarmLocation, latitude, longitude },
    language: $("language-select").value,
    soilType: $("soilType").value,
    preferredCropIds: [...$("preferred-crops").querySelectorAll('input[type="checkbox"]:checked')]
      .map((input) => input.value),
    farmerPriorities
  };
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
    const response = await fetch(apiUrl("/api/recommendations"), {
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
  applyLanguage();
  showLoading();
  latestRecommendationData = null;
  scrollToResults();

  try {
    const data = await requestRecommendations(payload);
    latestRecommendationData = data;
    focusedRotationIndex = 0;
    renderResults(data);
  } catch (error) {
    if (error.name === "AbortError") {
      showError("The request took too long", "NASA POWER did not answer in time. Wait a moment and try again.");
    } else if (error.status === 502) {
      showError("NASA climate data is unavailable", error.message, "AgriVeya does not guess climate values, so no recommendations are shown. Try again shortly.");
    } else if (error.status === 400) {
      showError("The server could not use these details", error.message, "Adjust the form and try again.");
    } else if (error.status) {
      showError("Something went wrong on the server", error.message);
    } else {
      showError("Can't reach the AgriVeya server", "Make sure the backend is running (npm start in the Backend folder) and open the app at http://localhost:3000/index.html (the default port).");
    }
  } finally {
    button.disabled = false;
    button.textContent = "Get rotation options";
    applyLanguage();
  }
}

/* ---------- Use my location ---------- */
let currentLocationReference = null;
let locationPermissionRequest = null;
let currentLocationTask = null;
let refreshLocationSearchLanguage = () => {};
let lastLocationSearchQuery = "";
let regionalCropRequest = null;
let regionalCropRequestId = 0;
let selectedFarmLocation = null;
let locationSelectionPending = true;
let locationResolutionRequestId = 0;

async function requestLocationDetails(coordinates) {
  const parameters = new URLSearchParams({
    latitude: String(coordinates.latitude),
    longitude: String(coordinates.longitude),
    language: $("language-select").value
  });
  const response = await fetch(apiUrl(`/api/locations/reverse?${parameters}`));
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `Location lookup failed (${response.status}).`);
  return data.location || {};
}

async function resolveFarmLocation(coordinates, source) {
  const requestId = ++locationResolutionRequestId;
  const input = $("location-search");
  const status = $("location-status");
  const latitude = Number($("latitude").value);
  const longitude = Number($("longitude").value);

  locationSelectionPending = true;
  selectedFarmLocation = null;
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
      !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    input.value = "";
    status.textContent = "Enter valid coordinates to load crop options.";
    applyLanguage();
    return;
  }
  input.value = translatedText("Finding location name…");
  status.textContent = "Finding location name…";
  applyLanguage();

  try {
    const location = await requestLocationDetails(coordinates);
    if (requestId !== locationResolutionRequestId) return;

    selectedFarmLocation = { ...location, latitude, longitude, source };
    const label = location.displayName || location.name;
    input.value = label || translatedText("Location details unavailable");
    locationSelectionPending = false;
    status.textContent = label
      ? source === "current" ? "Current location detected automatically." : "Location ready."
      : source === "current"
        ? "Current location detected; address could not be resolved."
        : "Location details unavailable";
    applyLanguage();
    loadRegionalCropOptions(selectedFarmLocation);
  } catch (error) {
    if (requestId !== locationResolutionRequestId) return;
    console.error("Could not resolve the selected farm location:", error);
    selectedFarmLocation = { latitude, longitude, source };
    input.value = translatedText("Location details unavailable");
    locationSelectionPending = false;
    status.textContent = source === "current"
      ? "Current location detected; address could not be resolved."
      : "Location details unavailable";
    applyLanguage();
    loadRegionalCropOptions(selectedFarmLocation);
  }
}

async function refreshResolvedLocationLanguage() {
  const location = selectedFarmLocation;
  if (!location || location.source === "search" || locationSelectionPending) return;
  const requestId = locationResolutionRequestId;
  try {
    const refreshed = await requestLocationDetails(location);
    if (requestId !== locationResolutionRequestId || selectedFarmLocation !== location) return;
    selectedFarmLocation = { ...location, ...refreshed, source: location.source };
    $("location-search").value = refreshed.displayName || refreshed.name ||
      translatedText("Location details unavailable");
  } catch (error) {
    console.warn("Could not refresh the resolved location label:", error.message);
    $("location-status").textContent = "Could not refresh the location name in the selected language.";
    applyLanguage();
  }
}

function renderRegionalCropOptions(cropIds) {
  const container = $("preferred-crops");
  const selectedIds = new Set(
    [...container.querySelectorAll('input[type="checkbox"]:checked')].map((input) => input.value)
  );
  const options = [...new Set(cropIds)]
    .filter((id) => Object.prototype.hasOwnProperty.call(CONFIG.cropLabels, id))
    .map((id) => {
      const input = el("input", { type: "checkbox", name: "preferredCropIds", value: id });
      input.checked = selectedIds.has(id);
      const label = el("label", { class: `preferred-crop-option${input.checked ? " selected" : ""}` },
        input,
        el("span", { text: CONFIG.cropLabels[id] })
      );
      input.addEventListener("change", () => label.classList.toggle("selected", input.checked));
      return label;
    });
  container.replaceChildren(...options);
}

async function loadRegionalCropOptions(location) {
  const requestId = ++regionalCropRequestId;
  if (regionalCropRequest) regionalCropRequest.abort();
  regionalCropRequest = new AbortController();
  const signal = regionalCropRequest.signal;
  const container = $("preferred-crops");
  const status = $("crop-options-status");
  const latitude = Number(location && location.latitude !== undefined ? location.latitude : $("latitude").value);
  const longitude = Number(location && location.longitude !== undefined ? location.longitude : $("longitude").value);
  const latitudeText = String(location && location.latitude !== undefined ? location.latitude : $("latitude").value).trim();
  const longitudeText = String(location && location.longitude !== undefined ? location.longitude : $("longitude").value).trim();

  container.querySelectorAll("input").forEach((input) => { input.disabled = true; });
  status.textContent = "Loading crop options for this location…";
  applyLanguage();

  if (!latitudeText || !longitudeText || !Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
      !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    renderRegionalCropOptions([]);
    status.textContent = "Enter valid coordinates to load crop options.";
    container.querySelectorAll("input").forEach((input) => { input.disabled = false; });
    applyLanguage();
    return;
  }

  try {
    const parameters = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      language: $("language-select").value
    });
    if (location && location.countryCode) parameters.set("countryCode", location.countryCode);
    if (location && location.region) parameters.set("region", location.region);
    if (location && location.district) parameters.set("district", location.district);
    if (location && location.country) parameters.set("country", location.country);
    if (location && location.locality) parameters.set("locality", location.locality);
    if (location && location.name) parameters.set("name", location.name);
    if (location && location.displayName) parameters.set("displayName", location.displayName);

    const response = await fetch(apiUrl(`/api/crops/regional?${parameters}`), { signal });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || `Regional crop lookup failed (${response.status}).`);
    if (requestId !== regionalCropRequestId) return;

    renderRegionalCropOptions(Array.isArray(data.cropIds) ? data.cropIds : []);
    if (data.level === "subregion") {
      status.replaceChildren(
        el("span", { text: "Regional crop options loaded for this location." }),
        document.createTextNode(" "),
        el("span", { text: data.note })
      );
    } else {
      status.textContent = data.note || "No curated crop coverage for this location. No crops have been guessed.";
    }
  } catch (error) {
    if (error.name !== "AbortError" && requestId === regionalCropRequestId) {
      console.error("Could not load regional crop options:", error);
      renderRegionalCropOptions([]);
      status.textContent = "Crop options could not be loaded. Please try selecting the location again.";
    }
  } finally {
    if (requestId === regionalCropRequestId) {
      container.querySelectorAll("input").forEach((input) => { input.disabled = false; });
      applyLanguage();
    }
  }
}

function setupLocationSearch() {
  const input = $("location-search");
  const list = $("location-suggestions");
  const status = $("location-status");
  let timer;
  let controller;
  let activeIndex = -1;
  let locations = [];
  let selectedLocation = null;

  function searchUrl(query) {
    const parameters = new URLSearchParams({
      q: query,
      language: $("language-select").value
    });
    if (currentLocationReference) {
      parameters.set("latitude", String(currentLocationReference.latitude));
      parameters.set("longitude", String(currentLocationReference.longitude));
    }
    return apiUrl(`/api/locations/search?${parameters}`);
  }

  function closeList() {
    list.hidden = true;
    list.replaceChildren();
    locations = [];
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    activeIndex = -1;
  }

  function setStatus(message) {
    status.textContent = message;
    applyLanguage();
  }

  function selectLocation(location) {
    selectedLocation = location;
    $("latitude").value = Number(location.latitude).toFixed(6);
    $("longitude").value = Number(location.longitude).toFixed(6);
    locationResolutionRequestId += 1;
    selectedFarmLocation = {
      ...location,
      latitude: Number($("latitude").value),
      longitude: Number($("longitude").value),
      source: "search"
    };
    locationSelectionPending = false;
    input.value = location.displayName || location.name;
    setStatus("Location selected. Coordinates updated.");
    closeList();
    loadRegionalCropOptions(location);
  }

  function setActive(index) {
    activeIndex = (index + locations.length) % locations.length;
    [...list.children].forEach((option, i) => {
      option.setAttribute("aria-selected", String(i === activeIndex));
    });
    const active = list.children[activeIndex];
    if (active) {
      input.setAttribute("aria-activedescendant", active.id);
      active.scrollIntoView({ block: "nearest" });
    }
  }

  input.addEventListener("input", () => {
    clearTimeout(timer);
    if (controller) controller.abort();
    const query = input.value.trim();
    lastLocationSearchQuery = query;
    selectedLocation = null;
    locationSelectionPending = true;
    closeList();
    locations = [];
    setStatus("Choose a location suggestion to use your search.");
    if (query.length < 2) return;

    timer = setTimeout(async () => {
      controller = new AbortController();
      setStatus("Searching locations…");
      try {
        const response = await fetch(searchUrl(query), { signal: controller.signal });
        const data = await response.json();
        if (input.value.trim() !== query) return;
        if (!response.ok) throw new Error(data.error || `Location search failed (${response.status}).`);
        locations = Array.isArray(data.results) ? data.results.filter((item) =>
          Number.isFinite(Number(item.latitude)) && Number.isFinite(Number(item.longitude))
        ) : [];
        if (!locations.length) {
          setStatus("No matching places found.");
          return;
        }
        list.replaceChildren(...locations.map((location, index) => {
          const option = el("button", {
            id: `location-option-${index}`,
            class: "location-option",
            type: "button",
            role: "option",
            "aria-selected": "false"
          }, el("span", { text: location.name || location.displayName }), location.context ? el("small", { text: location.context }) : null);
          option.addEventListener("click", () => selectLocation(location));
          return option;
        }));
        list.hidden = false;
        input.setAttribute("aria-expanded", "true");
        setStatus("");
      } catch (error) {
        if (error.name !== "AbortError") {
          setStatus("Location search is unavailable. Please try again.");
        }
      }
    }, 350);
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" && locations.length) {
      event.preventDefault();
      setActive(activeIndex + 1);
    } else if (event.key === "ArrowUp" && locations.length) {
      event.preventDefault();
      setActive(activeIndex < 0 ? locations.length - 1 : activeIndex - 1);
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      selectLocation(locations[activeIndex]);
    } else if (event.key === "Escape") {
      closeList();
    }
  });

  refreshLocationSearchLanguage = async () => {
    if (!selectedLocation) {
      if (selectedFarmLocation && selectedFarmLocation.source !== "search") {
        await refreshResolvedLocationLanguage();
      } else if (lastLocationSearchQuery && input.value.trim() === lastLocationSearchQuery) {
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
      return;
    }
    if (!lastLocationSearchQuery) return;

    if (controller) controller.abort();
    controller = new AbortController();
    try {
      const response = await fetch(searchUrl(lastLocationSearchQuery), { signal: controller.signal });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Location search failed (${response.status}).`);
      const localized = (Array.isArray(data.results) ? data.results : []).find((item) => item.id === selectedLocation.id);
      if (localized) {
        selectedLocation = localized;
        selectedFarmLocation = {
          ...selectedFarmLocation,
          ...localized,
          latitude: selectedFarmLocation.latitude,
          longitude: selectedFarmLocation.longitude,
          source: "search"
        };
        input.value = localized.displayName || localized.name;
      }
    } catch (error) {
      if (error.name !== "AbortError") setStatus("Could not refresh the location name in the selected language.");
    }
  };

  document.addEventListener("click", (event) => {
    if (!input.contains(event.target) && !list.contains(event.target)) closeList();
  });

  let coordinateUpdateTimer;
  ["latitude", "longitude"].forEach((id) => {
    $(id).addEventListener("input", () => {
      selectedLocation = null;
      locationResolutionRequestId += 1;
      selectedFarmLocation = null;
      locationSelectionPending = true;
      input.value = translatedText("Finding location name…");
      setStatus("Finding location name…");
      clearTimeout(coordinateUpdateTimer);
      coordinateUpdateTimer = setTimeout(() => {
        resolveFarmLocation({
          latitude: Number($("latitude").value),
          longitude: Number($("longitude").value)
        }, "coordinates");
      }, 500);
    });
  });
}

async function handleLocate() {
  const button = $("locate");
  if (!navigator.geolocation) {
    $("location-status").textContent = "Location permission unavailable; search still works.";
    applyLanguage();
    return;
  }
  if (currentLocationTask) return currentLocationTask;
  if (!locationPermissionRequest) {
    locationPermissionRequest = new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        maximumAge: 300000,
        timeout: 10000
      });
    });
  }

  button.disabled = true;
  $("location-status").textContent = "Detecting current location…";
  applyLanguage();
  currentLocationTask = (async () => {
    try {
      const position = await locationPermissionRequest;
      currentLocationReference = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      $("latitude").value = position.coords.latitude.toFixed(6);
      $("longitude").value = position.coords.longitude.toFixed(6);
      await resolveFarmLocation({
        latitude: Number($("latitude").value),
        longitude: Number($("longitude").value)
      }, "current");
    } catch (error) {
      console.warn("Could not detect the current location:", error.message);
      $("location-status").textContent = "Location permission unavailable; search still works.";
      applyLanguage();
    } finally {
      button.disabled = false;
      currentLocationTask = null;
    }
  })();
  return currentLocationTask;
}

/* ---------- Hero climate snapshot (real data from GET /api/climate) ---------- */
async function loadSnapshot() {
  const { latitude, longitude, label } = CONFIG.snapshot;
  try {
    const response = await fetch(apiUrl(`/api/climate?latitude=${latitude}&longitude=${longitude}`));
    if (!response.ok) throw new Error("climate request failed");
    const data = await response.json();
    snapshotData = data;
    updateSnapshot(data, $("language-select").value);
    const summary = data.summary || {};
    const observations = Array.isArray(data.dailyObservations) ? data.dailyObservations : [];

    // Bars: temperature on a 0 to 40 °C scale, humidity in %, dry days as a share of the period.
    const bars = [
      ["snapTempBar", (summary.averageTemperatureC / 40) * 100],
      ["snapHumBar", summary.averageRelativeHumidityPercent],
      ["snapDryBar", observations.length ? (summary.dryDays / observations.length) * 100 : NaN]
    ];
    requestAnimationFrame(() => {
      bars.forEach(([id, pct]) => {
        if (Number.isFinite(pct)) $(id).style.width = `${clampPct(pct)}%`;
      });
    });
    applyLanguage();
  } catch (_) {
    $("snapPeriod").textContent = `${label}, ${translatedText("climate data unavailable")}`;
    ["snapTemp", "snapHum", "snapDry"].forEach((id) => ($(id).textContent = "n/a"));
    $("snapFoot").textContent = "Start the backend to load NASA POWER data. AgriVeya never shows made-up climate values.";
    applyLanguage();
  }
}

/* ---------- Start ---------- */
window.addEventListener("pagehide", stopRecommendationSpeech);
buildForm();
$("farm-form").addEventListener("submit", handleSubmit);
$("locate").addEventListener("click", handleLocate);
$("language-select").addEventListener("change", () => {
  applyLanguage();
  if (latestRecommendationData) renderResults(latestRecommendationData, false);
  refreshLocationSearchLanguage();
});
setupLocationSearch();
applyLanguage();
resolveFarmLocation({
  latitude: Number($("latitude").value),
  longitude: Number($("longitude").value)
}, "coordinates");
loadSnapshot();
