import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from "react";

// 5 Language Dictionaries (English, Tamil, Hindi, Telugu, Malayalam)
const TRANSLATIONS = {
  en: {
    dashboard: "Dashboard",
    employees: "Employees",
    production: "Production",
    inventory: "Inventory",
    orders: "Orders",
    stock: "Stock",
    team: "Team Overview",
    profitLoss: "Profit & Loss",
    settings: "Settings",
    signOut: "Sign Out",
    adminConsole: "ADMIN CONSOLE",
    managerConsole: "MANAGER CONSOLE",
    employeeApp: "EMPLOYEE APP",
    searchPlaceholder: "Search employees, products...",
    notifications: "Notifications",
    language: "Language",
    theme: "Theme Mode",
    fontStyle: "Font Family",
    accentColor: "Accent Color",
    dateFilter: "Filter by Date",
    allDates: "All Dates",
    today: "Today",
    thisWeek: "This Week",
    productionOverview: "Production Overview",
    batchLog: "📅 Production Batch Log",
    quickSettings: "Quick Settings",
    applySettings: "Settings Applied Successfully!"
  },
  ta: {
    dashboard: "முகப்பு",
    employees: "பணியாளர்கள்",
    production: "உற்பத்தி",
    inventory: "சரக்கு இருப்பு",
    orders: "ஆர்டர்கள்",
    stock: "இருப்பு",
    team: "குழு மேலோட்டம்",
    profitLoss: "லாப நட்டம்",
    settings: "அமைப்புகள்",
    signOut: "வெளியேறு",
    adminConsole: "நிர்வாகி கன்சோல்",
    managerConsole: "மேலாளர் கன்சோல்",
    employeeApp: "பணியாளர் செயலி",
    searchPlaceholder: "பணியாளர்கள், தயாரிப்புகளைத் தேடுக...",
    notifications: "அறிவிப்புகள்",
    language: "மொழி",
    theme: "கருப்பொருள்",
    fontStyle: "எழுத்து நடை",
    accentColor: "எழுத்து வண்ணம்",
    dateFilter: "தேதி வடிப்பான்",
    allDates: "அனைத்து தேதிகளும்",
    today: "இன்று",
    thisWeek: "இந்த வாரம்",
    productionOverview: "உற்பத்தி மேலோட்டம்",
    batchLog: "📅 உற்பத்தி தொகுதி பதிவு",
    quickSettings: "விரைவு அமைப்புகள்",
    applySettings: "அமைப்புகள் வெற்றிகரமாக பயன்படுத்தப்பட்டன!"
  },
  hi: {
    dashboard: "डैशबोर्ड",
    employees: "कर्मचारी",
    production: "उत्पादन",
    inventory: "इन्वेंटरी",
    orders: "ऑर्डर",
    stock: "स्टॉक",
    team: "टीम अवलोकन",
    profitLoss: "लाभ और हानि",
    settings: "सेटिंग्स",
    signOut: "साइन आउट",
    adminConsole: "एडमिन कंसोल",
    managerConsole: "मैनेजर कंसोल",
    employeeApp: "कर्मचारी ऐप",
    searchPlaceholder: "कर्मचारी, उत्पाद खोजें...",
    notifications: "सूचनाएं",
    language: "भाषा",
    theme: "थीम मोड़",
    fontStyle: "फ़ॉन्ट शैली",
    accentColor: "रंग चुनें",
    dateFilter: "तिथि अनुसार फ़िल्टर करें",
    allDates: "सभी तिथियां",
    today: "आज",
    thisWeek: "इस सप्ताह",
    productionOverview: "उत्पादन अवलोकन",
    batchLog: "📅 उत्पादन बैच लॉग",
    quickSettings: "त्वरित सेटिंग्स",
    applySettings: "सेटिंग्स सफलतापूर्वक लागू की गईं!"
  },
  te: {
    dashboard: "డాష్‌బోర్డ్",
    employees: "ఉద్యోగులు",
    production: "ఉత్పత్తి",
    inventory: "ఇన్వెంటరీ",
    orders: "ఆర్డర్లు",
    stock: "స్టాక్",
    team: "టీమ్ అవలోకనం",
    profitLoss: "లాభ నష్టాలు",
    settings: "సెట్టింగ్‌లు",
    signOut: "సైన్ అవుట్",
    adminConsole: "అడ్మిన్ కన్సోల్",
    managerConsole: "మేనేజర్ కన్సోల్",
    employeeApp: "ఉద్యోగి యాప్",
    searchPlaceholder: "ఉద్యోగులు, ఉత్పత్తులను శోధించండి...",
    notifications: "నోటిఫికేషన్‌లు",
    language: "భాష",
    theme: "థీమ్ మోడ్",
    fontStyle: "ఫాంట్ శైలి",
    accentColor: "రంగు ఎంచుకోండి",
    dateFilter: "తేదీ ద్వారా ఫిల్టర్ చేయండి",
    allDates: "అన్ని తేదీలు",
    today: "ఈ రోజు",
    thisWeek: "ఈ వారం",
    productionOverview: "ఉత్పత్తి అవలోకనం",
    batchLog: "📅 ఉత్పత్తి బ్యాచ్ లాగ్",
    quickSettings: "త్వరిత సెట్టింగ్‌లు",
    applySettings: "సెట్టింగ్‌లు విజయవంతంగా అన్వయించబడ్డాయి!"
  },
  ml: {
    dashboard: "ഡാഷ്‌ബോർഡ്",
    employees: "ജീവനക്കാർ",
    production: "ഉത്പാദനം",
    inventory: "ഇൻവെന്ററി",
    orders: "ഓർഡറുകൾ",
    stock: "സ്റ്റോക്ക്",
    team: "ടീം അവലോകനം",
    profitLoss: "ലാഭ നഷ്ടം",
    settings: "ക്രമീകരണങ്ങൾ",
    signOut: "സൈൻ ഔട്ട്",
    adminConsole: "അഡ്മിൻ കൺസോൾ",
    managerConsole: "മാനേജർ കൺസോൾ",
    employeeApp: "എംപ്ലോയി ആപ്പ്",
    searchPlaceholder: "തിരയുക...",
    notifications: "അറിയിപ്പുകൾ",
    language: "ഭാഷ",
    theme: "തീം മോഡ്",
    fontStyle: "ഫോണ്ട് ശൈലി",
    accentColor: "നിറം തിരഞ്ഞെടുക്കുക",
    dateFilter: "തീയതി ഫിൽട്ടർ",
    allDates: "എല്ലാ തീയതികളും",
    today: "ഇന്ന്",
    thisWeek: "ഈ ആഴ്ച",
    productionOverview: "ഉത്പാദന അവലോകനം",
    batchLog: "📅 ഉത്പാദന ബാച്ച് ലോഗ്",
    quickSettings: "പെട്ടെന്നുള്ള ക്രമീകരണങ്ങൾ",
    applySettings: "ക്രമീകരണങ്ങൾ വിജയകരമായി പ്രയോഗിച്ചു!"
  }
};

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  // Supports 5 Languages: 'en' | 'ta' | 'hi' | 'te' | 'ml'
  const [language, setLanguage] = useState(() => localStorage.getItem("ise_lang") || "en");
  const [theme, setTheme] = useState(() => localStorage.getItem("ise_theme") || "light");
  const [fontStyle, setFontStyle] = useState(() => localStorage.getItem("ise_font") || "sans");
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem("ise_accent") || "sapphire");

  const renderCountRef = useRef(0);
  useEffect(() => {
    renderCountRef.current += 1;
  });

  useEffect(() => {
    localStorage.setItem("ise_lang", language);
    localStorage.setItem("ise_theme", theme);
    localStorage.setItem("ise_font", fontStyle);
    localStorage.setItem("ise_accent", accentColor);

    const root = document.documentElement;

    let fontFamily = "'DM Sans', sans-serif";
    if (fontStyle === "serif") fontFamily = "'Playfair Display', Georgia, serif";
    else if (fontStyle === "mono") fontFamily = "'Fira Code', Consolas, monospace";
    else if (fontStyle === "dyslexic") fontFamily = "'Comic Neue', 'OpenDyslexic', sans-serif";
    root.style.setProperty("--main-font", fontFamily);

    const colors = {
      sapphire: { primary: "#2563EB", hover: "#1D4ED8", light: "#EFF6FF", border: "#BFDBFE" },
      amber: { primary: "#D97706", hover: "#B45309", light: "#FFFBEB", border: "#FDE68A" },
      emerald: { primary: "#059669", hover: "#047857", light: "#ECFDF5", border: "#A7F3D0" },
      rose: { primary: "#E11D48", hover: "#BE123C", light: "#FFF1F2", border: "#FECDD3" },
      violet: { primary: "#7C3AED", hover: "#6D28D9", light: "#F5F3FF", border: "#DDD6FE" }
    };
    const selColor = colors[accentColor] || colors.sapphire;
    root.style.setProperty("--blue", selColor.primary);
    root.style.setProperty("--blue-hover", selColor.hover);
    root.style.setProperty("--blue-xs", selColor.light);

    if (theme === "dark") {
      root.style.setProperty("--bg", "#0F172A");
      root.style.setProperty("--navy", "#F8FAFC");
      root.style.setProperty("--text", "#E2E8F0");
      root.style.setProperty("--muted", "#94A3B8");
      root.style.setProperty("--border", "#334155");
      root.style.setProperty("--card-bg", "#1E293B");
    } else if (theme === "incense-gold") {
      root.style.setProperty("--bg", "#FFFBEB");
      root.style.setProperty("--navy", "#78350F");
      root.style.setProperty("--text", "#451A03");
      root.style.setProperty("--muted", "#92400E");
      root.style.setProperty("--border", "#FDE68A");
      root.style.setProperty("--card-bg", "#FFFFFF");
    } else if (theme === "royal-purple") {
      root.style.setProperty("--bg", "#FAF5FF");
      root.style.setProperty("--navy", "#581C87");
      root.style.setProperty("--text", "#3B0764");
      root.style.setProperty("--muted", "#7E22CE");
      root.style.setProperty("--border", "#E9D5FF");
      root.style.setProperty("--card-bg", "#FFFFFF");
    } else if (theme === "forest-emerald") {
      root.style.setProperty("--bg", "#F0FDF4");
      root.style.setProperty("--navy", "#14532D");
      root.style.setProperty("--text", "#064E3B");
      root.style.setProperty("--muted", "#15803D");
      root.style.setProperty("--border", "#BBF7D0");
      root.style.setProperty("--card-bg", "#FFFFFF");
    } else {
      root.style.setProperty("--bg", "#F8FAFC");
      root.style.setProperty("--navy", "#1E2A3A");
      root.style.setProperty("--text", "#1E293B");
      root.style.setProperty("--muted", "#64748B");
      root.style.setProperty("--border", "#E2E8F0");
      root.style.setProperty("--card-bg", "#FFFFFF");
    }
  }, [theme, language, fontStyle, accentColor]);

  const toggleLanguage = useCallback((lang) => {
    setLanguage(lang);
  }, []);

  const changeTheme = useCallback((newTheme) => {
    setTheme(newTheme);
  }, []);

  const changeFontStyle = useCallback((newFont) => {
    setFontStyle(newFont);
  }, []);

  const changeAccentColor = useCallback((newAccent) => {
    setAccentColor(newAccent);
  }, []);

  const t = useCallback((key) => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  }, [language]);

  const value = useMemo(() => ({
    language,
    theme,
    fontStyle,
    accentColor,
    toggleLanguage,
    changeTheme,
    changeFontStyle,
    changeAccentColor,
    t,
    renderCount: renderCountRef.current
  }), [language, theme, fontStyle, accentColor, toggleLanguage, changeTheme, changeFontStyle, changeAccentColor, t]);

  return (
    <SettingsContext.Provider value={value}>
      <div style={{ fontFamily: "var(--main-font)" }}>
        {children}
      </div>
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
