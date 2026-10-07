import React from "react";
import { useSettings } from "../../context/SettingsContext";
import "./CustomerReach.css";

const STATE_REACH_DATA = [
  { state: "Tamil Nadu (Home)", households: "1,850,000", share: "38.5%", rating: "4.9★", topProduct: "Chandan Supreme 100g", status: "Market Leader" },
  { state: "Karnataka", households: "920,000", share: "19.1%", rating: "4.8★", topProduct: "Rose Gold Cone 50p", status: "High Growth" },
  { state: "Kerala", households: "640,000", share: "13.3%", rating: "4.9★", topProduct: "Jasmine Mogra Stick", status: "High Growth" },
  { state: "Maharashtra", households: "510,000", share: "10.6%", rating: "4.7★", topProduct: "Sambrani Cup Premium", status: "Expanding" },
  { state: "Andhra Pradesh / Telangana", households: "480,000", share: "10.0%", rating: "4.8★", topProduct: "Dhoop Cones Assorted", status: "Expanding" },
  { state: "International Exports (USA, UAE, SG)", households: "410,000", share: "8.5%", rating: "4.95★", topProduct: "Incense Stick Festival Box", status: "Export Leader" }
];

export default function CustomerReach() {
  const { t } = useSettings();

  return (
    <div className="reach-page">
      {/* Title */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--navy)" }}>
          🌐 Customer Reach &amp; Market Penetration Analytics
        </h1>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
          Live breakdown of how ISE Incense products reach millions of households across India &amp; global export destinations.
        </p>
      </div>

      {/* KPI Cards Strip */}
      <div className="reach-kpi-grid">
        <div className="reach-kpi-card gold">
          <div className="rk-icon">🏠</div>
          <div className="rk-val">4.8 Million</div>
          <div className="rk-lbl">Total Households Reached</div>
          <div className="rk-sub">▲ 24% YoY Growth</div>
        </div>

        <div className="reach-kpi-card blue">
          <div className="rk-icon">🗺️</div>
          <div className="rk-val">18 States</div>
          <div className="rk-lbl">Indian Domestic Coverage</div>
          <div className="rk-sub">Salem &amp; Chennai Factories</div>
        </div>

        <div className="reach-kpi-card green">
          <div className="rk-icon">✈️</div>
          <div className="rk-val">5 Countries</div>
          <div className="rk-lbl">Global Export Destinations</div>
          <div className="rk-sub">USA, UAE, Singapore, Malaysia, UK</div>
        </div>

        <div className="reach-kpi-card purple">
          <div className="rk-icon">⭐</div>
          <div className="rk-val">4.9 / 5.0</div>
          <div className="rk-lbl">Customer Satisfaction Score</div>
          <div className="rk-sub">Based on 142,000+ Reviews</div>
        </div>
      </div>

      {/* State & Global Reach Table */}
      <div style={{ background: "var(--card-bg, #fff)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", marginBottom: 24 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", background: "var(--bg)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14.5, fontWeight: 700, color: "var(--navy)" }}>📊 State-by-State Distribution &amp; Demand Breakdown</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)" }}>Updated Today</span>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
          <thead style={{ background: "var(--bg)" }}>
            <tr>
              {["Region / State", "Households Reached", "Market Share %", "Top Product Demand", "Satisfaction", "Status"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "12px 18px", fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STATE_REACH_DATA.map((row, idx) => (
              <tr key={idx} style={{ borderTop: "1px solid var(--border)" }}>
                <td style={{ padding: "14px 18px", fontWeight: 700, color: "var(--navy)" }}>{row.state}</td>
                <td style={{ padding: "14px 18px", color: "var(--text)", fontWeight: 600 }}>{row.households}</td>
                <td style={{ padding: "14px 18px", color: "var(--blue)", fontWeight: 700 }}>{row.share}</td>
                <td style={{ padding: "14px 18px", color: "var(--text)" }}>🪔 {row.topProduct}</td>
                <td style={{ padding: "14px 18px", fontWeight: 700, color: "#D97706" }}>{row.rating}</td>
                <td style={{ padding: "14px 18px" }}>
                  <span className="badge badge-green" style={{ fontSize: 11.5 }}>{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
