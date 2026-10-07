import React from "react";

/**
 * Reusable Summary KPI Card
 * Props:
 * - icon: string/ReactNode
 * - label: string
 * - value: string/number
 * - sub: string
 * - trend: string (e.g. "▲ 8% vs yesterday" or "▼ 0.2%")
 * - tone: "blue" | "green" | "amber" | "purple" | "red"
 */
export default function KpiCard({
  icon = "📊",
  label = "",
  value = "—",
  sub = "",
  trend = "",
  tone = "blue"
}) {
  const tones = {
    blue: { bar: "var(--blue, #3B82F6)", bg: "var(--blue-xs, #EFF6FF)", text: "#2563EB" },
    green: { bar: "#10B981", bg: "#ECFDF5", text: "#059669" },
    amber: { bar: "#F59E0B", bg: "#FFFBEB", text: "#D97706" },
    purple: { bar: "#8B5CF6", bg: "#F5F3FF", text: "#7C3AED" },
    red: { bar: "#EF4444", bg: "#FEF2F2", text: "#DC2626" }
  };

  const currentTone = tones[tone] || tones.blue;

  return (
    <div
      style={{
        background: "var(--card-bg, #fff)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: "16px 18px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease"
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3.5, background: currentTone.bar }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: currentTone.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18
          }}
        >
          {icon}
        </div>
        {trend && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: 20,
              background: trend.includes("▲") ? "#ECFDF5" : trend.includes("▼") ? "#FEF2F2" : "var(--bg)",
              color: trend.includes("▲") ? "#059669" : trend.includes("▼") ? "#DC2626" : "var(--muted)"
            }}
          >
            {trend}
          </span>
        )}
      </div>

      <div style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px" }}>
        {label}
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: "var(--navy)", marginTop: 4, letterSpacing: "-0.5px" }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>
          {sub}
        </div>
      )}
    </div>
  );
}
