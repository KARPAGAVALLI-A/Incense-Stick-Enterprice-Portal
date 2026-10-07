import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from "react";
import { applyDynamicTheme, generateDynamicPalette, PRESET_THEME_COLORS } from "../utils/dynamicColor";

// 5 Language Dictionaries (English, Tamil, Hindi, Telugu, Malayalam)
const TRANSLATIONS = {
  en: {
    dashboard: "Dashboard",
    analytics: "Analytics & Reports",
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
    analytics: "பகுப்பாய்வு மற்றும் அறிக்கைகள்",
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
    analytics: "एनालिटिक्स और रिपोर्ट्स",
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
    analytics: "విశ్లేషణ & నివేదికలు",
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
    analytics: "അനലിറ്റിക്സ് & റിപ്പോർട്ടുകൾ",
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

export const AVAILABLE_FONTS = [
  { id: "sans", name: "Inter / DM Sans", family: "'DM Sans', 'Inter', sans-serif" },
  { id: "poppins", name: "Poppins", family: "'Poppins', sans-serif" },
  { id: "outfit", name: "Outfit", family: "'Outfit', sans-serif" },
  { id: "jakarta", name: "Plus Jakarta", family: "'Plus Jakarta Sans', sans-serif" },
  { id: "serif", name: "Playfair", family: "'Playfair Display', Georgia, serif" },
  { id: "merriweather", name: "Merriweather", family: "'Merriweather', Georgia, serif" },
  { id: "mono", name: "Fira Code", family: "'Fira Code', Consolas, monospace" },
  { id: "dyslexic", name: "Dyslexic Friendly", family: "'Comic Neue', 'OpenDyslexic', sans-serif" }
];

export function SettingsProvider({ children }) {
  // Supports 5 Languages: 'en' | 'ta' | 'hi' | 'te' | 'ml'
  const [language, setLanguage] = useState(() => localStorage.getItem("ise_lang") || "en");
  const [theme, setTheme] = useState(() => localStorage.getItem("ise_theme") || "light");
  const [fontStyle, setFontStyle] = useState(() => localStorage.getItem("ise_font") || "sans");
  // Primary theme color: can be any HEX or preset, defaults to Teal #1D95AD
  const [primaryColor, setPrimaryColor] = useState(() => localStorage.getItem("ise_primary_color") || localStorage.getItem("ise_accent") || "#1D95AD");

  const renderCountRef = useRef(0);
  useEffect(() => {
    renderCountRef.current += 1;
  });

  // Calculate dynamic palette
  const dynamicPalette = useMemo(() => {
    return generateDynamicPalette(primaryColor, theme === "dark");
  }, [primaryColor, theme]);

  useEffect(() => {
    localStorage.setItem("ise_lang", language);
    localStorage.setItem("ise_theme", theme);
    localStorage.setItem("ise_font", fontStyle);
    localStorage.setItem("ise_primary_color", primaryColor);
    localStorage.setItem("ise_accent", primaryColor);

    const root = document.documentElement;

    const activeFont = AVAILABLE_FONTS.find((f) => f.id === fontStyle);
    const fontFamily = activeFont ? activeFont.family : "'DM Sans', sans-serif";
    root.style.setProperty("--main-font", fontFamily);

    // DYNAMIC COLOR SYSTEM: Automatically generates every UI color from the single primary color
    applyDynamicTheme(primaryColor, theme === "dark");

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
  }, [theme, language, fontStyle, primaryColor]);

  const toggleLanguage = useCallback((lang) => {
    setLanguage(lang);
  }, []);

  const changeTheme = useCallback((newTheme) => {
    setTheme(newTheme);
  }, []);

  const changeFontStyle = useCallback((newFont) => {
    setFontStyle(newFont);
  }, []);

  const changePrimaryColor = useCallback((color) => {
    setPrimaryColor(color);
    localStorage.setItem("ise_primary_color", color);
    localStorage.setItem("ise_accent", color);
  }, []);

  const t = useCallback((key) => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  }, [language]);

  const value = useMemo(() => ({
    language,
    theme,
    fontStyle,
    primaryColor,
    accentColor: primaryColor, // backwards compatibility
    dynamicPalette,
    PRESET_THEME_COLORS,
    AVAILABLE_FONTS,
    toggleLanguage,
    changeTheme,
    changeFontStyle,
    changePrimaryColor,
    changeAccentColor: changePrimaryColor, // backwards compatibility
    t,
    renderCount: renderCountRef.current
  }), [language, theme, fontStyle, primaryColor, dynamicPalette, toggleLanguage, changeTheme, changeFontStyle, changePrimaryColor, t]);

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
