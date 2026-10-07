import React, { useState } from "react";

/**
 * Reusable Interactive Doughnut / Pie Chart
 * Props:
 * - data: Array of objects, e.g. [{ label: "Shipped", count: 12, color: "#3B82F6" }]
 * - valueKey: string (default "count" or "value")
 * - centerLabel: string
 * - centerSub: string
 * - size: number
 * - unit: string
 * - emptyMessage: string
 */
export default function DoughnutChart({
  data = [],
  valueKey = "count",
  centerLabel = "Total",
  centerSub = "Units",
  size = 220,
  unit = "",
  emptyMessage = "No distribution data available"
}) {
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const total = data.reduce((sum, d) => sum + (Number(d[valueKey] || d.value || 0)), 0);

  if (!data || data.length === 0 || total === 0) {
    return (
      <div style={{ height: size, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontSize: 13 }}>
        {emptyMessage}
      </div>
    );
  }

  // Calculate arc angles
  const radius = 70;
  const strokeWidth = 26;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;
  const slices = data.map((d) => {
    const val = Number(d[valueKey] || d.value || 0);
    const pct = val / total;
    const strokeDasharray = `${pct * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedPercent * circumference;
    accumulatedPercent += pct;

    return {
      ...d,
      val,
      pctVal: (pct * 100).toFixed(1),
      strokeDasharray,
      strokeDashoffset,
      color: d.color || "#3B82F6"
    };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, userSelect: "none" }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: "rotate(-90deg)", overflow: "visible" }}
        >
          {slices.map((slice, idx) => {
            const isHovered = hoveredSlice && hoveredSlice.label === slice.label;

            return (
              <circle
                key={idx}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={slice.strokeDasharray}
                strokeDashoffset={slice.strokeDashoffset}
                style={{
                  cursor: "pointer",
                  transition: "stroke-width 0.2s ease, opacity 0.2s ease",
                  opacity: isHovered ? 1 : hoveredSlice ? 0.7 : 0.95
                }}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setHoveredSlice(slice);
                  setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
                }}
                onMouseLeave={() => setHoveredSlice(null)}
              />
            );
          })}
        </svg>

        {/* Center Label */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            textAlign: "center"
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>
            {hoveredSlice ? hoveredSlice.label : centerLabel}
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "var(--navy)", marginTop: 2 }}>
            {hoveredSlice ? hoveredSlice.val.toLocaleString() : total.toLocaleString()}
          </div>
          <div style={{ fontSize: 10.5, color: "var(--muted)" }}>
            {hoveredSlice ? `${hoveredSlice.pctVal}%` : centerSub}
          </div>
        </div>
      </div>

      {/* Legend Grid */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px 18px", width: "100%", maxWidth: 360 }}>
        {slices.map((s, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: 6,
              background: hoveredSlice && hoveredSlice.label === s.label ? "var(--bg)" : "transparent"
            }}
            onMouseEnter={() => setHoveredSlice(s)}
            onMouseLeave={() => setHoveredSlice(null)}
          >
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
            <span style={{ color: "var(--text)", fontWeight: 500 }}>{s.label}</span>
            <span style={{ color: "var(--muted)", fontWeight: 700, fontSize: 11 }}>({s.pctVal}%)</span>
          </div>
        ))}
      </div>

      {/* Floating Tooltip */}
      {hoveredSlice && (
        <div
          style={{
            position: "fixed",
            left: tooltipPos.x,
            top: tooltipPos.y - 10,
            transform: "translate(-50%, -100%)",
            background: "#0F172A",
            color: "#FFFFFF",
            padding: "8px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            pointerEvents: "none",
            boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
            zIndex: 99999,
            whiteSpace: "nowrap"
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 2 }}>{hoveredSlice.label}</div>
          <div style={{ color: "#94A3B8", fontSize: "11px" }}>
            Count: <span style={{ color: "#38BDF8", fontWeight: 700 }}>{hoveredSlice.val.toLocaleString()} {unit}</span>
            {" "}({hoveredSlice.pctVal}%)
          </div>
        </div>
      )}
    </div>
  );
}
