/**
 * Centralized Voice Command & Navigation Service
 * Supports English, Tamil, and Hindi natural language commands.
 */

// Route mappings and synonyms
const ROUTE_DEFINITIONS = [
  {
    route: "/admin/employees",
    title: {
      en: "Employee Management",
      ta: "பணியாளர் மேலாண்மை",
      hi: "कर्मचारी प्रबंधन"
    },
    confirmPhrase: {
      en: "Opening Employee Management.",
      ta: "பணியாளர் பக்கத்திற்கு செல்கிறது.",
      hi: "कर्मचारी प्रबंधन पृष्ठ खोला जा रहा है।"
    },
    keywords: {
      en: ["employee", "employees", "employee page", "employee management", "staff page", "staff", "workers", "roster", "show employees", "go to employee", "open employee"],
      ta: ["பணியாளர்", "பணியாளர்கள்", "பணியாளர் பக்கம்", "பணியாளர் பேஜ்", "எம்ப்ளாயி", "எம்ப்ளாய்", "employee page", "employee", "employees", "staff page", "வேலையாட்கள்", "பணியாளர் பக்கத்திற்கு போ", "employee page-ku po", "employee page po", "employees open pannu", "employee open pannu", "employees kaattu", "employee kaattu"],
      hi: ["कर्मचारी", "कर्मचारियों", "स्टाफ", "कर्मचारी पृष्ठ", "employee page", "employees", "staff", "कर्मचारी खोलो", "कर्मचारी पेज पर जाओ", "employee page kholo", "employees dikhao", "karmchari page"]
    }
  },
  {
    route: "/admin/analytics",
    title: {
      en: "Analytics & Reports",
      ta: "பகுப்பாய்வு மற்றும் அறிக்கைகள்",
      hi: "एनालिटिक्स और रिपोर्ट्स"
    },
    confirmPhrase: {
      en: "Opening Analytics & Reports.",
      ta: "பகுப்பாய்வு மற்றும் அறிக்கைகள் பக்கத்தை திறக்கிறது.",
      hi: "एनालिटिक्स और रिपोर्ट्स पृष्ठ खोला जा रहा है।"
    },
    keywords: {
      en: ["analytics", "reports", "dashboard analytics", "analytics page", "show reports", "open analytics", "go to analytics", "view reports", "charts", "kpi"],
      ta: ["பகுப்பாய்வு", "அறிக்கைகள்", "அறிக்கை", "அனலிடிக்ஸ்", "ரிப்போர்ட்", "ரிப்போர்ட்ஸ்", "சார்ட்", "analytics", "reports", "analytics page", "பகுப்பாய்வு பக்கம்", "analytics open pannu", "analytics-ku po", "reports kaattu", "report kaattu", "reports open pannu", "chart kaattu"],
      hi: ["एनालिटिक्स", "रिपोर्ट्स", "रिपोर्ट", "analytics", "reports", "analytics kholo", "analytics par jao", "report dikhao", "chart dikhao", "analitik dikhao"]
    }
  },
  {
    route: "/admin",
    title: {
      en: "Business Dashboard",
      ta: "வணிக முகப்பு",
      hi: "बिजनेस डैशबोर्ड"
    },
    confirmPhrase: {
      en: "Navigating to Business Dashboard.",
      ta: "வணிக டாஷ்போர்டிற்கு செல்கிறது.",
      hi: "डैशबोर्ड पर जाया जा रहा है।"
    },
    keywords: {
      en: ["dashboard", "home", "go to dashboard", "open dashboard", "show dashboard", "home page", "go to home", "main page"],
      ta: ["முகப்பு", "டாஷ்போர்டு", "டேஷ்போர்ட்", "டேஷ்போர்டு", "dashboard", "home", "dashboard-ku po", "dashboard open pannu", "mugappu pakkam po", "home-ku po", "main page"],
      hi: ["डैशबोर्ड", "होम", "मुख्य पृष्ठ", "dashboard", "home", "dashboard par jao", "dashboard kholo", "home page par jao", "mukhya prishth kholo"]
    }
  },
  {
    route: "/admin/production",
    title: {
      en: "Production Batches",
      ta: "உற்பத்தி தொகுதிகள்",
      hi: "उत्पादन बैच"
    },
    confirmPhrase: {
      en: "Opening Production Management.",
      ta: "உற்பத்தி பக்கத்திற்கு செல்கிறது.",
      hi: "उत्पादन पृष्ठ खोला जा रहा है।"
    },
    keywords: {
      en: ["production", "production batches", "batches", "plant production", "go to production", "open production", "show production", "rolling unit"],
      ta: ["உற்பத்தி", "உற்பத்தி தொகுதி", "புரொடக்ஷன்", "production", "batches", "production-ku po", "production open pannu", "urpatti pakkam po", "production kaattu"],
      hi: ["उत्पादन", "बैच", "production", "production kholo", "production par jao", "utpadan dikhao", "production batch dikhao"]
    }
  },
  {
    route: "/admin/inventory",
    title: {
      en: "Inventory & Products",
      ta: "சரக்கு இருப்பு",
      hi: "इन्वेंटरी और उत्पाद"
    },
    confirmPhrase: {
      en: "Opening Inventory Management.",
      ta: "சரக்கு இருப்பு பக்கத்தை திறக்கிறது.",
      hi: "इन्वेंटरी पृष्ठ खोला जा रहा है।"
    },
    keywords: {
      en: ["inventory", "products", "stock items", "open inventory", "go to inventory", "show inventory", "warehouse stock"],
      ta: ["சரக்கு", "சரக்கு இருப்பு", "இன்வெண்டரி", "inventory", "products", "inventory open pannu", "inventory-ku po", "sarakku iruppu kaattu", "inventory kaattu"],
      hi: ["इन्वेंटरी", "उत्पाद", "सामग्री", "inventory", "inventory kholo", "inventory par jao", "inventory dikhao", "samagri dikhao"]
    }
  },
  {
    route: "/admin/orders",
    title: {
      en: "Orders & Shipments",
      ta: "ஆர்டர்கள் மற்றும் ஏற்றுமதி",
      hi: "ऑर्डर और शिपमेंट"
    },
    confirmPhrase: {
      en: "Opening Orders Management.",
      ta: "ஆர்டர்கள் பக்கத்திற்கு செல்கிறது.",
      hi: "ஆर्डर पृष्ठ खोला जा रहा है।"
    },
    keywords: {
      en: ["orders", "order list", "shipments", "sales orders", "open orders", "go to orders", "show orders"],
      ta: ["ஆர்டர்கள்", "ஆர்டர்", "ஆர்ட்டர்", "orders", "orders open pannu", "orders-ku po", "orders kaattu", "order kaattu", "aardar pakkam po", "sales kaattu"],
      hi: ["ऑर्डर", "आदेश", "orders", "orders kholo", "orders par jao", "orders dikhao", "order list dikhao"]
    }
  },
  {
    route: "/admin/stock",
    title: {
      en: "Raw Materials Stock",
      ta: "மூலப்பொருள் இருப்பு",
      hi: "कच्चा माल स्टॉक"
    },
    confirmPhrase: {
      en: "Opening Raw Materials Stock.",
      ta: "இருப்பு விவரங்கள் பக்கத்தை திறக்கிறது.",
      hi: "स्टॉक पृष्ठ खोला जा रहा है।"
    },
    keywords: {
      en: ["stock", "raw materials", "materials", "bamboo sticks", "open stock", "go to stock", "show stock"],
      ta: ["இருப்பு", "மூலப்பொருள்", "ஸ்டாக்", "stock", "stock open pannu", "stock-ku po", "stock kaattu", "iruppu kaattu"],
      hi: ["स्टॉक", "कच्चा माल", "stock", "stock kholo", "stock par jao", "stock dikhao", "kaccha maal dikhao"]
    }
  },
  {
    route: "/admin/profit-loss",
    title: {
      en: "Profit & Loss and Market Shares",
      ta: "லாப நட்டம் மற்றும் சந்தை பங்குகள்",
      hi: "लाभ-हानि और शेयर"
    },
    confirmPhrase: {
      en: "Opening Profit & Loss Overview.",
      ta: "லாப நட்டம் பக்கத்தை திறக்கிறது.",
      hi: "लाभ और हानि पृष्ठ खोला जा रहा है।"
    },
    keywords: {
      en: ["profit", "loss", "profit loss", "finance", "financials", "market shares", "shares", "open profit and loss", "show profit and loss"],
      ta: ["லாபம்", "நட்டம்", "லாப நட்டம்", "பங்குகள்", "profit loss", "shares", "profit loss kaattu", "laaba nattam pakkam po", "finance kaattu"],
      hi: ["लाभ", "हानि", "लाभ और हानि", "शेयर", "फाइनेंस", "profit loss", "profit and loss kholo", "labh hani dikhao", "finance par jao"]
    }
  },
  {
    route: "/admin/customer-reach",
    title: {
      en: "Customer Reach & Live GPS",
      ta: "வாடிக்கையாளர் வரைபடம்",
      hi: "कस्टमर रीच और लाइव जीपीएस"
    },
    confirmPhrase: {
      en: "Opening Live GPS Delivery Tracking.",
      ta: "ஜிபிஎஸ் நேரடி வரைபடத்தை திறக்கிறது.",
      hi: "लाइव जीपीएस ट्रैकिंग खोली जा रही है।"
    },
    keywords: {
      en: ["customer reach", "reach", "gps", "gps map", "live tracking", "live map", "fleet", "fleet tracking"],
      ta: ["வரைபடம்", "ஜிபிஎஸ்", "வாடிக்கையாளர் வரைபடம்", "customer reach", "gps", "gps map kaattu", "customer reach-ku po", "tracking kaattu"],
      hi: ["जीपीएस", "मैप", "ट्रैकिंग", "customer reach", "gps map dikhao", "customer reach par jao", "live tracking dikhao"]
    }
  },
  {
    route: "/admin/settings",
    title: {
      en: "System Settings",
      ta: "அமைப்புகள்",
      hi: "सिस्टम सेटिंग्स"
    },
    confirmPhrase: {
      en: "Opening System Settings.",
      ta: "அமைப்புகள் பக்கத்திற்கு செல்கிறது.",
      hi: "सेटिंग्स पृष्ठ खोला जा रहा है।"
    },
    keywords: {
      en: ["settings", "configuration", "preferences", "go to settings", "open settings", "show settings"],
      ta: ["அமைப்புகள்", "செட்டிங்ஸ்", "settings", "settings open pannu", "settings-ku po", "amaipukal pakkam po"],
      hi: ["सेटिंग्स", "कॉन्फ़िगरेशन", "settings", "settings kholo", "settings par jao", "settings dikhao"]
    }
  }
];

// Go back triggers
const BACK_KEYWORDS = {
  en: ["go back", "back", "previous page", "return"],
  ta: ["பின்னால் போ", "பின்னால்", "back", "munthaiya pakkam", "pinnal po", "back po"],
  hi: ["वापस जाओ", "पीछे जाओ", "वापस", "back", "wapas jao", "piche jao", "back jao"]
};

/**
 * Detect Language from text (Unicode ranges + phonetic matching)
 * Returns 'ta' | 'hi' | 'en'
 */
export function detectLanguage(text) {
  if (!text) return "en";
  const str = text.trim();

  // 1. Tamil script detection
  if (/[\u0B80-\u0BFF]/.test(str)) {
    return "ta";
  }

  // 2. Hindi / Devanagari script detection
  if (/[\u0900-\u097F]/.test(str)) {
    return "hi";
  }

  // 3. Tanglish phonetics detection
  const lower = str.toLowerCase();
  const tanglishWords = ["vanakkam", "kaattu", "po", "pannu", "thira", "enakku", "ethana", "irukku", "sarakku", "urpatti", "velai", "paniyaalar", "mukkiam"];
  if (tanglishWords.some((w) => lower.split(/\s+/).includes(w) || lower.includes(`-${w}`) || lower.includes(`${w}-`))) {
    return "ta";
  }

  // 4. Hinglish phonetics detection
  const hinglishWords = ["namaste", "kholo", "dikhao", "jao", "batao", "chalo", "kitne", "kya", "hai", "karmchari", "utpadan", "mera", "mujhe", "par"];
  if (hinglishWords.some((w) => lower.split(/\s+/).includes(w))) {
    return "hi";
  }

  return "en";
}

/**
 * Process a voice or text command and return structured intent & actions.
 * @param {string} commandText - Spoken or typed string
 * @param {object} appContext - { employees, orders, inventory }
 * @param {string} forcedLang - Optional language override ('en' | 'ta' | 'hi')
 */
export function processVoiceCommand(commandText, appContext = {}, forcedLang = null) {
  if (!commandText || !commandText.trim()) {
    return {
      type: "empty",
      responseText: "Please speak a command or question.",
      spokenText: "Please speak a command.",
      detectedLang: "en"
    };
  }

  const raw = commandText.trim();
  const detectedLang = forcedLang && forcedLang !== "auto" ? forcedLang : detectLanguage(raw);
  const lower = raw.toLowerCase();

  // 1. CHECK BACK NAVIGATION
  const backKeys = [...BACK_KEYWORDS.en, ...BACK_KEYWORDS.ta, ...BACK_KEYWORDS.hi];
  if (backKeys.some((k) => lower.includes(k))) {
    const confirmMap = {
      en: "Going back to previous page.",
      ta: "முந்தைய பக்கத்திற்கு செல்கிறது.",
      hi: "पिछले पृष्ठ पर वापस जाया जा रहा है।"
    };
    return {
      type: "navigation",
      action: "BACK",
      route: -1,
      detectedLang,
      responseText: confirmMap[detectedLang] || confirmMap.en,
      spokenText: confirmMap[detectedLang] || confirmMap.en
    };
  }

  // 2. CHECK REAL-TIME DATA QUERIES (Attendance, Count, Weather, Stock)
  // A. Staff / Employees count query
  if (
    lower.includes("present") ||
    lower.includes("attendance") ||
    lower.includes("how many") ||
    lower.includes("ethana") ||
    lower.includes("kitne") ||
    lower.includes("வருகை") ||
    lower.includes("இருக்கிறார்கள்") ||
    lower.includes("உபஸ்திதி") ||
    lower.includes("उपस्थित")
  ) {
    const employees = appContext.employees || [];
    const presentCount = employees.filter((e) => e.status === "Present").length;
    const totalCount = employees.length || 50;
    const responseMap = {
      en: `👷 Attendance Update: Currently ${presentCount} out of ${totalCount} employees are present today.`,
      ta: `👷 வருகை விவரம்: இன்று ${totalCount} ஊழியர்களில் ${presentCount} பேர் பணியில் உள்ளனர்.`,
      hi: `👷 उपस्थिति विवरण: आज कुल ${totalCount} में से ${presentCount} कर्मचारी उपस्थित हैं।`
    };

    return {
      type: "query",
      detectedLang,
      responseText: responseMap[detectedLang] || responseMap.en,
      spokenText: responseMap[detectedLang] || responseMap.en,
      link: "/admin/employees",
      linkText: "View Employee Roster →",
      cards: employees.slice(0, 3).map((e) => `• ${e.name} (${e.dept}) - ${e.status}`)
    };
  }

  // B. Weather alert / Rain stop work query
  if (
    lower.includes("weather") ||
    lower.includes("rain") ||
    lower.includes("downpour") ||
    lower.includes("மழை") ||
    lower.includes("வானிலை") ||
    lower.includes("मौसम") ||
    lower.includes("बारिश")
  ) {
    const weatherMap = {
      en: "🌧️ Weather Sentinel Alert: Heavy Rain Warning (88% probability). Outdoor sun-drying has been paused, and workers are relocated indoors.",
      ta: "🌧️ வானிலை எச்சரிக்கை: கனமழை வாய்ப்பு (88%). வெளிப்புற உலர்த்தும் பணி நிறுத்தப்பட்டு பணியாளர்கள் உள்ளரங்கிற்கு மாற்றப்பட்டுள்ளனர்.",
      hi: "🌧️ मौसम चेतावनी: भारी बारिश का अलर्ट (88%)। धूप में सुखाने का काम रोक दिया गया है और श्रमिकों को अंदर स्थानांतरित किया गया है।"
    };
    return {
      type: "query",
      detectedLang,
      responseText: weatherMap[detectedLang] || weatherMap.en,
      spokenText: weatherMap[detectedLang] || weatherMap.en,
      link: "/manager",
      linkText: "Open Rain Sentinel Dashboard →",
      cards: [
        "• Sun-Drying Unit: Halted",
        "• Shifted to Indoor Packaging & Moulding",
        "• SMS sent to shift supervisors"
      ]
    };
  }

  // 3. CHECK PAGE NAVIGATION
  for (const def of ROUTE_DEFINITIONS) {
    const allKeywords = [
      ...(def.keywords.en || []),
      ...(def.keywords.ta || []),
      ...(def.keywords.hi || [])
    ];

    const isMatch = allKeywords.some((keyword) => {
      const k = keyword.toLowerCase();
      return lower.includes(k);
    });

    if (isMatch) {
      const title = def.title[detectedLang] || def.title.en;
      const spokenText = def.confirmPhrase[detectedLang] || def.confirmPhrase.en;
      return {
        type: "navigation",
        action: "NAVIGATE",
        route: def.route,
        title,
        detectedLang,
        responseText: `🚀 ${spokenText}`,
        spokenText: spokenText,
        link: def.route,
        linkText: `Go to ${title} →`
      };
    }
  }

  // C. Stock / Raw Material shortages query
  if (
    lower.includes("shortage") ||
    lower.includes("low stock") ||
    lower.includes("குறைந்த") ||
    lower.includes("कम स्टॉक") ||
    lower.includes("bamboo")
  ) {
    const stockMap = {
      en: "📦 Stock Alert: Bamboo sticks and Jigat powder are below reorder threshold. Fresh delivery is expected Thursday.",
      ta: "📦 இருப்பு எச்சரிக்கை: மூங்கில் குச்சிகள் மற்றும் ஜிகட் பவுடர் இருப்பு குறைவாக உள்ளது.",
      hi: "📦 स्टॉक चेतावनी: बांस की तीलियां और जिगट पाउडर का स्टॉक कम है।"
    };
    return {
      type: "query",
      detectedLang,
      responseText: stockMap[detectedLang] || stockMap.en,
      spokenText: stockMap[detectedLang] || stockMap.en,
      link: "/admin/inventory",
      linkText: "Check Raw Materials Stock →"
    };
  }

  // 4. FALLBACK ASSISTANT RESPONSE
  const fallbackMap = {
    en: `🤖 ISE Voice Agent: I heard "${raw}". You can say "Go to Employee page", "Open Analytics", "Show Production", or ask about staff attendance and weather alerts.`,
    ta: `🤖 ISE குரல் உதவியாளர்: "${raw}" என்று கேட்டுள்ளது. "பணியாளர் பக்கத்திற்கு போ", "Analytics open pannu", அல்லது "ஆர்டர்கள் காட்டு" என்று கூறலாம்.`,
    hi: `🤖 ISE वॉइस असिस्टेंट: मैंने "${raw}" सुना। आप कह सकते हैं "कर्मचारी पेज खोलो", "एनालिटिक्स खोलो", या "डैशबोर्ड पर जाओ"।`
  };

  return {
    type: "unknown",
    detectedLang,
    responseText: fallbackMap[detectedLang] || fallbackMap.en,
    spokenText: fallbackMap[detectedLang] || fallbackMap.en,
    link: "/admin",
    linkText: "Go to Dashboard →"
  };
}
