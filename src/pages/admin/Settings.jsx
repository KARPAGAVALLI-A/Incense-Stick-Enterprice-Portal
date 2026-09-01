import React, { useState } from "react";
import { useSettings } from "../../context/SettingsContext";

function Section({ title, subtitle, children }) {
  return (
    <div style={{ background: "var(--card-bg, #fff)", border: "1px solid var(--border)", borderRadius: 14, padding: 22, marginBottom: 20 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--navy)" }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange, label, hint }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: "1px solid var(--border)" }}>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text)" }}>{label}</div>
        {hint && <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{hint}</div>}
      </div>
      <div
        onClick={() => onChange(!checked)}
        style={{ width: 44, height: 24, borderRadius: 99, background: checked ? "var(--blue)" : "var(--border)", position: "relative", cursor: "pointer", flexShrink: 0, transition: "background .2s" }}
      >
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: checked ? 23 : 3, transition: "left .2s" }} />
      </div>
    </div>
  );
}

export default function Settings() {
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

  const [companyName, setCompanyName] = useState("ISE Incense Stick Enterprise");
  const [saved, setSaved] = useState(false);

  const [notifyLowStock, setNotifyLowStock] = useState(true);
  const [notifyOrders, setNotifyOrders] = useState(true);
  const [notifyAttendance, setNotifyAttendance] = useState(true);

  function handleSave(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  return (
    <div style={{ maxWidth: 850 }}>
      {/* Title */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--navy)" }}>
          ⚙️ {t("settings")}
        </h1>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
          {t("language")}, {t("theme")}, {t("fontStyle")}, {t("accentColor")} & Real-time App Customizations
        </p>
      </div>

      <form onSubmit={handleSave}>
        {/* 1. 5 LANGUAGES SELECTION */}
        <Section title={`🌐 ${t("language")} (5 Indian Languages)`} subtitle="Select your preferred language for the enterprise workspace">
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {[
                { code: "en", flag: "🇬🇧", label: "English" },
                { code: "ta", flag: "🇮🇳", label: "தமிழ் (Tamil)" },
                { code: "hi", flag: "🇮🇳", label: "हिन्दी (Hindi)" },
                { code: "te", flag: "🇮🇳", label: "తెలుగు (Telugu)" },
                { code: "ml", flag: "🇮🇳", label: "മലയാളം (Malayalam)" }
              ].map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => toggleLanguage(lang.code)}
                  style={{
                    padding: "10px 16px", borderRadius: 10, border: "2px solid",
                    borderColor: language === lang.code ? "var(--blue)" : "var(--border)",
                    background: language === lang.code ? "var(--blue-xs)" : "var(--card-bg, #fff)",
                    color: language === lang.code ? "var(--blue)" : "var(--text)",
                    fontWeight: 700, fontSize: 13, cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  {lang.flag} {lang.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "var(--navy)", marginBottom: 6 }}>
              Company Name
            </label>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              style={{
                width: "100%", maxWidth: 380, padding: "10px 14px", borderRadius: 8,
                border: "1px solid var(--border)", fontSize: 13, background: "var(--bg)",
                color: "var(--text)", fontFamily: "var(--main-font)"
              }}
            />
          </div>
        </Section>

        {/* 2. THEME MODE CUSTOMIZATION */}
        <Section title={`🎨 ${t("theme")}`} subtitle="Select background theme mode for the enterprise console">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
            {[
              { id: "light", icon: "☀️", label: "Light Mode" },
              { id: "dark", icon: "🌙", label: "Dark Slate" },
              { id: "incense-gold", icon: "🪔", label: "Incense Gold" },
              { id: "royal-purple", icon: "🔮", label: "Royal Purple" },
              { id: "forest-emerald", icon: "🌿", label: "Forest Emerald" }
            ].map((th) => (
              <div
                key={th.id}
                onClick={() => changeTheme(th.id)}
                style={{
                  padding: 14, borderRadius: 12, border: `2px solid ${theme === th.id ? "var(--blue)" : "var(--border)"}`,
                  background: theme === th.id ? "var(--blue-xs)" : "var(--bg)", cursor: "pointer",
                  textAlign: "center", transition: "transform 0.15s ease"
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 4 }}>{th.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--navy)" }}>{th.label}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* 3. FONT STYLE & ACCENT COLOR */}
        <Section title={`🔤 ${t("fontStyle")} & 🎯 ${t("accentColor")}`} subtitle="Customize typography styles and primary UI accent colors">
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "var(--navy)", marginBottom: 8 }}>
              {t("fontStyle")}
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {[
                { id: "sans", label: "Modern Sans (Inter)" },
                { id: "serif", label: "Classic Serif (Playfair)" },
                { id: "mono", label: "Tech Monospace (Fira)" },
                { id: "dyslexic", label: "Dyslexic Friendly" }
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => changeFontStyle(f.id)}
                  style={{
                    padding: "8px 14px", borderRadius: 8, border: "1px solid",
                    borderColor: fontStyle === f.id ? "var(--blue)" : "var(--border)",
                    background: fontStyle === f.id ? "var(--blue)" : "var(--bg)",
                    color: fontStyle === f.id ? "#fff" : "var(--text)",
                    fontWeight: 600, fontSize: 12, cursor: "pointer"
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "var(--navy)", marginBottom: 8 }}>
              {t("accentColor")}
            </label>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              {[
                { id: "sapphire", name: "Sapphire Blue", color: "#2563EB" },
                { id: "amber", name: "Amber Gold", color: "#D97706" },
                { id: "emerald", name: "Emerald Green", color: "#059669" },
                { id: "rose", name: "Crimson Rose", color: "#E11D48" },
                { id: "violet", name: "Royal Violet", color: "#7C3AED" }
              ].map((c) => (
                <div
                  key={c.id}
                  onClick={() => changeAccentColor(c.id)}
                  title={c.name}
                  style={{
                    width: 32, height: 32, borderRadius: "50%", background: c.color,
                    cursor: "pointer", border: accentColor === c.id ? "3px solid var(--navy)" : "2px solid #fff",
                    boxShadow: accentColor === c.id ? `0 0 0 2px ${c.color}` : "0 2px 4px rgba(0,0,0,0.1)",
                    transform: accentColor === c.id ? "scale(1.15)" : "scale(1)",
                    transition: "all 0.15s ease"
                  }}
                />
              ))}
            </div>
          </div>
        </Section>

        {/* 4. NOTIFICATIONS */}
        <Section title={`🔔 ${t("notifications")}`} subtitle="Choose what events fire live in-app alerts">
          <Toggle checked={notifyLowStock} onChange={setNotifyLowStock} label="Low stock alerts" hint="Notify when raw materials drop below reorder thresholds" />
          <Toggle checked={notifyOrders} onChange={setNotifyOrders} label="New orders placed" hint="Notify when clients place a new order" />
          <Toggle checked={notifyAttendance} onChange={setNotifyAttendance} label="Employee attendance" hint="Real-time biometric punch-in alerts" />
        </Section>

        {/* Save Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button type="submit" className="btn btn-primary" style={{ padding: "10px 24px", fontSize: 13, fontWeight: 700 }}>
            💾 Save Settings
          </button>
          {saved && (
            <span style={{ fontSize: 13, color: "#16a34a", fontWeight: 700 }}>
              ✓ {t("applySettings")}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
