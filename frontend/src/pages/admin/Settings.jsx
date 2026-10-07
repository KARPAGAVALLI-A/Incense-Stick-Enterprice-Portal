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
    primaryColor,
    accentColor,
    dynamicPalette,
    AVAILABLE_FONTS,
    toggleLanguage,
    changeTheme,
    changeFontStyle,
    changePrimaryColor,
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

        {/* 3. FONT & THEME COLOR */}
        <Section title={`🔤 ${t("fontStyle")} & 🎯 ${t("accentColor")}`}>
          {/* FONT FAMILY SELECTION */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--navy)", marginBottom: 10 }}>
              {t("fontStyle")}
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 10 }}>
              {(AVAILABLE_FONTS || [
                { id: "sans", name: "Inter / DM Sans", family: "'DM Sans', 'Inter', sans-serif" },
                { id: "poppins", name: "Poppins", family: "'Poppins', sans-serif" },
                { id: "outfit", name: "Outfit", family: "'Outfit', sans-serif" },
                { id: "jakarta", name: "Plus Jakarta", family: "'Plus Jakarta Sans', sans-serif" },
                { id: "serif", name: "Playfair", family: "'Playfair Display', Georgia, serif" },
                { id: "merriweather", name: "Merriweather", family: "'Merriweather', Georgia, serif" },
                { id: "mono", name: "Fira Code", family: "'Fira Code', monospace" },
                { id: "dyslexic", name: "Dyslexic Friendly", family: "'Comic Neue', sans-serif" }
              ]).map((f) => {
                const isSelected = fontStyle === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => changeFontStyle(f.id)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: isSelected ? "2px solid var(--blue)" : "1px solid var(--border)",
                      background: isSelected ? "var(--blue)" : "var(--bg)",
                      color: isSelected ? "var(--blue-contrast, #fff)" : "var(--text)",
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: "pointer",
                      fontFamily: f.family,
                      textAlign: "center",
                      transition: "all 0.15s ease",
                      boxShadow: isSelected ? "0 2px 8px var(--blue-glow)" : "none"
                    }}
                  >
                    {f.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* THEME COLOR SELECTION - PURE COLOR CIRCLES WITHOUT TEXT */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--navy)" }}>
                {t("accentColor")}
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="color"
                  value={primaryColor || "#1D95AD"}
                  onChange={(e) => changePrimaryColor(e.target.value)}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    border: "2px solid var(--border)",
                    cursor: "pointer",
                    padding: 0,
                    background: "none"
                  }}
                  title="Pick custom color"
                />
                <input
                  type="text"
                  value={primaryColor || "#1D95AD"}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.startsWith("#") && val.length <= 7) changePrimaryColor(val);
                  }}
                  style={{
                    width: 86,
                    padding: "6px 8px",
                    borderRadius: 6,
                    border: "1px solid var(--border)",
                    fontSize: 12,
                    fontFamily: "monospace",
                    fontWeight: 700,
                    color: "var(--navy)",
                    textAlign: "center"
                  }}
                />
              </div>
            </div>

            {/* PURE COLOR DOTS (NO TEXT LABELS) */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
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
                { id: "indigo", hex: "#6366F1" },
                { id: "emerald", hex: "#059669" },
                { id: "rose", hex: "#E11D48" }
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
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: c.hex,
                      border: "none",
                      cursor: "pointer",
                      boxShadow: isSelected
                        ? `0 0 0 3px var(--card-bg, #fff), 0 0 0 6px ${c.hex}`
                        : "0 2px 5px rgba(0,0,0,0.15)",
                      transform: isSelected ? "scale(1.18)" : "scale(1)",
                      transition: "all 0.15s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 16,
                      fontWeight: 700
                    }}
                  >
                    {isSelected ? "✓" : ""}
                  </button>
                );
              })}
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
