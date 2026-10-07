import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import { useAuth } from "../context/AuthContext";
import "./SettingsDropdown.css";

const LANG_LABELS = {
  en: "EN",
  ta: "தமிழ்",
  hi: "हिन्दी",
  te: "తెలుగు",
  ml: "മലയാളം"
};

export default function SettingsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const {
    language,
    theme,
    fontStyle,
    primaryColor,
    accentColor,
    toggleLanguage,
    changeTheme,
    changeFontStyle,
    changePrimaryColor,
    changeAccentColor,
    t
  } = useSettings();

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  function handleSignOut() {
    logout();
    navigate("/login");
  }

  return (
    <div className="settings-dropdown-wrapper" ref={dropdownRef}>
      {/* Topbar Settings Button right next to Notification Bell */}
      <button
        className={`settings-topbar-btn ${isOpen ? "active" : ""}`}
        onClick={handleToggle}
        title={t("settings")}
        aria-label={t("settings")}
      >
        <span className="settings-icon">⚙️</span>
        <span className="settings-lang-badge">{LANG_LABELS[language] || "EN"}</span>
      </button>

      {/* Settings Popup Modal */}
      {isOpen && (
        <div className="settings-modal-panel">
          <div className="settings-modal-header">
            <div className="title">⚙️ {t("quickSettings")}</div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="settings-modal-body">
            {/* 1. 5 Languages Selection */}
            <div className="settings-section">
              <label className="section-label">🌐 {t("language")}</label>
              <div className="grid-opts">
                <button
                  className={`theme-chip ${language === "en" ? "selected" : ""}`}
                  onClick={() => toggleLanguage("en")}
                >
                  🇬🇧 English
                </button>
                <button
                  className={`theme-chip ${language === "ta" ? "selected" : ""}`}
                  onClick={() => toggleLanguage("ta")}
                >
                  🇮🇳 தமிழ்
                </button>
                <button
                  className={`theme-chip ${language === "hi" ? "selected" : ""}`}
                  onClick={() => toggleLanguage("hi")}
                >
                  🇮🇳 हिन्दी
                </button>
                <button
                  className={`theme-chip ${language === "te" ? "selected" : ""}`}
                  onClick={() => toggleLanguage("te")}
                >
                  🇮🇳 తెలుగు
                </button>
                <button
                  className={`theme-chip ${language === "ml" ? "selected" : ""}`}
                  onClick={() => toggleLanguage("ml")}
                >
                  🇮🇳 മലയാളം
                </button>
              </div>
            </div>

            {/* 2. Theme Selector */}
            <div className="settings-section">
              <label className="section-label">🎨 {t("theme")}</label>
              <div className="grid-opts">
                <button
                  className={`theme-chip ${theme === "light" ? "selected" : ""}`}
                  onClick={() => changeTheme("light")}
                >
                  ☀️ Light
                </button>
                <button
                  className={`theme-chip ${theme === "dark" ? "selected" : ""}`}
                  onClick={() => changeTheme("dark")}
                >
                  🌙 Dark
                </button>
                <button
                  className={`theme-chip ${theme === "incense-gold" ? "selected" : ""}`}
                  onClick={() => changeTheme("incense-gold")}
                >
                  🪔 Incense Gold
                </button>
                <button
                  className={`theme-chip ${theme === "royal-purple" ? "selected" : ""}`}
                  onClick={() => changeTheme("royal-purple")}
                >
                  🔮 Royal Purple
                </button>
                <button
                  className={`theme-chip ${theme === "forest-emerald" ? "selected" : ""}`}
                  onClick={() => changeTheme("forest-emerald")}
                >
                  🌿 Forest Emerald
                </button>
              </div>
            </div>

            {/* 3. Font Family Selector */}
            <div className="settings-section">
              <label className="section-label">🔤 {t("fontStyle")}</label>
              <div className="grid-opts">
                {[
                  { id: "sans", label: "Inter / DM Sans" },
                  { id: "poppins", label: "Poppins" },
                  { id: "outfit", label: "Outfit" },
                  { id: "jakarta", label: "Plus Jakarta" },
                  { id: "serif", label: "Playfair" },
                  { id: "merriweather", label: "Merriweather" },
                  { id: "mono", label: "Fira Code" },
                  { id: "dyslexic", label: "Dyslexic Friendly" }
                ].map((f) => (
                  <button
                    key={f.id}
                    className={`font-chip ${fontStyle === f.id ? "selected" : ""}`}
                    onClick={() => changeFontStyle(f.id)}
                    style={{ fontSize: 11, padding: "5px 9px" }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Theme Color Selector - PURE COLOR CIRCLES */}
            <div className="settings-section">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label className="section-label">🎯 {t("accentColor") || "Theme Color"}</label>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <input
                    type="color"
                    value={primaryColor || "#1D95AD"}
                    onChange={(e) => changePrimaryColor(e.target.value)}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      border: "1px solid var(--border)",
                      cursor: "pointer",
                      padding: 0,
                      background: "none"
                    }}
                    title="Click for custom color"
                  />
                  <span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--navy)", fontWeight: 700 }}>
                    {primaryColor || "#1D95AD"}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                {[
                  { id: "teal", hex: "#1D95AD" },
                  { id: "pink", hex: "#C2185B" },
                  { id: "red", hex: "#D32F2F" },
                  { id: "purple", hex: "#7B1FA2" },
                  { id: "green", hex: "#388E3C" },
                  { id: "sapphire", hex: "#2563EB" },
                  { id: "amber", hex: "#D97706" },
                  { id: "skyblue", hex: "#0EA5E9" },
                  { id: "orange", hex: "#F97316" },
                  { id: "indigo", hex: "#6366F1" }
                ].map((c) => {
                  const isSelected =
                    (primaryColor || "").toLowerCase() === c.hex.toLowerCase() ||
                    (primaryColor || "").toLowerCase() === c.id;
                  return (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => changePrimaryColor(c.hex)}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: c.hex,
                        border: "none",
                        cursor: "pointer",
                        boxShadow: isSelected
                          ? `0 0 0 2px var(--card-bg, #fff), 0 0 0 4px ${c.hex}`
                          : "0 1px 3px rgba(0,0,0,0.15)",
                        transform: isSelected ? "scale(1.15)" : "scale(1)",
                        transition: "all 0.15s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 700
                      }}
                    >
                      {isSelected ? "✓" : ""}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="settings-modal-footer" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Link
              to="/admin/settings"
              className="full-settings-link"
              onClick={() => setIsOpen(false)}
            >
              🔧 Open Full Settings Page →
            </Link>
            {/* Quick Sign Out Button */}
            <button
              onClick={handleSignOut}
              style={{
                width: "100%", padding: "8px 0", borderRadius: 8, border: "1px solid #FECACA",
                background: "#FEF2F2", color: "#DC2626", fontSize: 12, fontWeight: 700,
                cursor: "pointer"
              }}
            >
              ↩ {t("signOut")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
