import React from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../../context/SettingsContext";

function Kpi({ icon, label, value, sub, tone }) {
  const barColor = { blue: "var(--blue)", green: "#10B981", amber: "#F59E0B", purple: "#8B5CF6" }[tone];
  const chipBg = { blue: "var(--blue-xs)", green: "#ECFDF5", amber: "#FFFBEB", purple: "#F5F3FF" }[tone];
  return (
    <div style={{ background: "var(--card-bg, #fff)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: barColor }} />
      <div style={{ width: 36, height: 36, borderRadius: 9, background: chipBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: "var(--navy)" }}>{value}</div>
      <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{sub}</div>
    </div>
  );
}

export default function Dashboard() {
  const { t, language } = useSettings();

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--navy)" }}>
          📊 {t("dashboard")}
        </h1>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
          {language === "ta" 
            ? "உற்பத்தி, சரக்கு, விற்பனை மற்றும் பணியாளர்கள் - இன்றைய முக்கிய விவரங்கள்"
            : "Production, inventory, sales & staff — one screen, everything that matters today"}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        <Kpi icon="⚙️" label={language === "ta" ? "உற்பத்தி செய்த அகர்பத்திகள்" : "Sticks Produced"} value="42,600" sub="▲ 8% vs yesterday" tone="blue" />
        <Kpi icon="💰" label={language === "ta" ? "இன்றைய வருவாய்" : "Revenue Today"} value="₹3.84L" sub="Diwali season surge" tone="green" />
        <Kpi icon="👷" label={language === "ta" ? "இன்றைய வருகை" : "Present Today"} value="79 / 86" sub="92% attendance" tone="purple" />
        <Kpi icon="⚠️" label={language === "ta" ? "குறைந்த இருப்பு பொருட்கள்" : "Low Stock Items"} value="5" sub="Needs reorder" tone="amber" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
        <Link to="/admin/employees" style={{ background: "var(--card-bg, #fff)", border: "1px solid var(--border)", borderRadius: 14, padding: 24, display: "block", textDecoration: "none" }}>
          <div style={{ fontSize: 26, marginBottom: 10 }}>👷</div>
          <div style={{ fontWeight: 700, color: "var(--navy)", marginBottom: 6 }}>{t("employees")} →</div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            {language === "ta" ? "பணியாளர் வருகை, உற்பத்தி வெளியீடு மற்றும் முந்தைய பதிவுகள்." : "Attendance, production output & past employee records."}
          </div>
        </Link>
        <Link to="/admin/production" style={{ background: "var(--card-bg, #fff)", border: "1px solid var(--border)", borderRadius: 14, padding: 24, display: "block", textDecoration: "none" }}>
          <div style={{ fontSize: 26, marginBottom: 10 }}>⚙️</div>
          <div style={{ fontWeight: 700, color: "var(--navy)", marginBottom: 6 }}>{t("production")} →</div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            {language === "ta" ? "காலெண்டர் தேதி வடிப்பான், மூலப்பொருள் இருப்பு மற்றும் ஆர்டர்கள்." : "Calendar date filter, raw material availability & orders."}
          </div>
        </Link>
      </div>
    </div>
  );
}
