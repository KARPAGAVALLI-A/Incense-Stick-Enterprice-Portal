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
    accentColor,
    toggleLanguage,
    changeTheme,
    changeFontStyle,
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
                <button
                  className={`font-chip ${fontStyle === "sans" ? "selected" : ""}`}
                  onClick={() => changeFontStyle("sans")}
                >
                  Sans-Serif
                </button>
                <button
                  className={`font-chip ${fontStyle === "serif" ? "selected" : ""}`}
                  onClick={() => changeFontStyle("serif")}
                >
                  Serif
                </button>
                <button
                  className={`font-chip ${fontStyle === "mono" ? "selected" : ""}`}
                  onClick={() => changeFontStyle("mono")}
                >
                  Monospace
                </button>
                <button
                  className={`font-chip ${fontStyle === "dyslexic" ? "selected" : ""}`}
                  onClick={() => changeFontStyle("dyslexic")}
                >
                  Dyslexic
                </button>
              </div>
            </div>

            {/* 4. Accent Color Selector */}
            <div className="settings-section">
              <label className="section-label">🎯 {t("accentColor")}</label>
              <div className="color-swatches">
                <button
                  className={`color-dot sapphire ${accentColor === "sapphire" ? "selected" : ""}`}
                  onClick={() => changeAccentColor("sapphire")}
                  title="Sapphire Blue"
                />
                <button
                  className={`color-dot amber ${accentColor === "amber" ? "selected" : ""}`}
                  onClick={() => changeAccentColor("amber")}
                  title="Amber Gold"
                />
                <button
                  className={`color-dot emerald ${accentColor === "emerald" ? "selected" : ""}`}
                  onClick={() => changeAccentColor("emerald")}
                  title="Emerald Green"
                />
                <button
                  className={`color-dot rose ${accentColor === "rose" ? "selected" : ""}`}
                  onClick={() => changeAccentColor("rose")}
                  title="Crimson Rose"
                />
                <button
                  className={`color-dot violet ${accentColor === "violet" ? "selected" : ""}`}
                  onClick={() => changeAccentColor("violet")}
                  title="Royal Violet"
                />
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
