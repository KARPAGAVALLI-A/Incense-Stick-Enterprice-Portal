import React, { useState } from "react";

/**
 * Reusable Interactive Bar Chart
 * Props:
 * - data: Array of objects, e.g. [{ label: "Mon", value: 1500, value2: 1200 }]
 * - series: Array of series configs, e.g. [{ key: "value", name: "Actual", color: "#3B82F6" }, { key: "value2", name: "Target", color: "#94A3B8" }]
 * - height: number (default 260)
 * - unit: string (e.g. "units", "₹L")
 * - emptyMessage: string
 */
export default function BarChart({
  data = [],
  series = [{ key: "value", name: "Value", color: "var(--blue, #3B82F6)" }],
  height = 260,
  unit = "",
  emptyMessage = "No chart data available"
}) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  if (!data || data.length === 0) {
    return (
      <div style={{ height, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontSize: 13 }}>
        {emptyMessage}
      </div>
    );
  }

  // Calculate scales
  let maxValue = 0;
  data.forEach((d) => {
    series.forEach((s) => {
      const val = Number(d[s.key] || 0);
      if (val > maxValue) maxValue = val;
    });
  });
  if (maxValue === 0) maxValue = 100;
  // Add 15% headroom
  const yMax = Math.ceil(maxValue * 1.15);

  const chartPadding = { top: 20, right: 20, bottom: 40, left: 45 };
  const svgWidth = 600;
  const svgHeight = height;
  const plotWidth = svgWidth - chartPadding.left - chartPadding.right;
  const plotHeight = svgHeight - chartPadding.top - chartPadding.bottom;

  const barGroupWidth = plotWidth / data.length;
  const barWidth = Math.max(8, Math.min(28, (barGroupWidth - 14) / series.length));

  // Y-axis ticks (4 ticks)
  const yTicks = [0, Math.round(yMax * 0.33), Math.round(yMax * 0.66), yMax];

  return (
    <div style={{ position: "relative", width: "100%", userSelect: "none" }}>
      {/* Legend */}
      {series.length > 1 && (
        <div style={{ display: "flex", gap: 16, justifyContent: "flex-end", marginBottom: 10, fontSize: 12, color: "var(--muted)" }}>
          {series.map((s) => (
            <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: s.color }} />
              <span>{s.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* SVG Canvas */}
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{ width: "100%", height: "auto", overflow: "visible" }}
      >
        {/* Y Axis Gridlines & Labels */}
        {yTicks.map((tick, idx) => {
          const y = chartPadding.top + plotHeight - (tick / yMax) * plotHeight;
          return (
            <g key={idx}>
              <line
                x1={chartPadding.left}
                y1={y}
                x2={chartPadding.left + plotWidth}
                y2={y}
                stroke="var(--border, #E2E8F0)"
                strokeDasharray={idx === 0 ? "none" : "3 3"}
                strokeWidth={idx === 0 ? 1.5 : 1}
              />
              <text
                x={chartPadding.left - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fill="var(--muted, #64748B)"
                fontWeight="500"
              >
                {tick >= 1000 ? `${(tick / 1000).toFixed(1)}k` : tick}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((item, groupIdx) => {
          const groupCenterX = chartPadding.left + groupIdx * barGroupWidth + barGroupWidth / 2;
          const totalSeriesWidth = series.length * barWidth + (series.length - 1) * 3;
          const startX = groupCenterX - totalSeriesWidth / 2;

          return (
            <g key={groupIdx}>
              {series.map((s, seriesIdx) => {
                const val = Number(item[s.key] || 0);
                const barHeight = Math.max(3, (val / yMax) * plotHeight);
                const x = startX + seriesIdx * (barWidth + 3);
                const y = chartPadding.top + plotHeight - barHeight;
                const isHovered = hoveredItem && hoveredItem.item === item && hoveredItem.seriesKey === s.key;

                return (
                  <rect
                    key={s.key}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx={4}
                    fill={s.color}
                    opacity={isHovered ? 1 : hoveredItem ? 0.75 : 0.92}
                    style={{
                      cursor: "pointer",
                      transition: "opacity 0.2s, transform 0.2s",
                      transformOrigin: `${x + barWidth / 2}px ${y + barHeight}px`,
                      transform: isHovered ? "scaleY(1.03)" : "none"
                    }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoveredItem({
                        item,
                        seriesName: s.name,
                        seriesKey: s.key,
                        value: val,
                        label: item.label || item.date || item.operator || item.dept
                      });
                      setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
                    }}
                    onMouseLeave={() => setHoveredItem(null)}
                  />
                );
              })}

              {/* X Axis Label */}
              <text
                x={groupCenterX}
                y={chartPadding.top + plotHeight + 20}
                textAnchor="middle"
                fontSize="11"
                fill="var(--navy, #1E293B)"
                fontWeight="600"
              >
                {item.label || item.date?.slice(5) || item.operator?.split(" ")[0] || item.dept?.split(" ")[0] || ""}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Interactive Tooltip */}
      {hoveredItem && (
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
          <div style={{ fontWeight: 700, marginBottom: 2 }}>{hoveredItem.label}</div>
          <div style={{ color: "#94A3B8", fontSize: "11px" }}>
            {hoveredItem.seriesName}:{" "}
            <span style={{ color: "#38BDF8", fontWeight: 700 }}>
              {Number(hoveredItem.value).toLocaleString()} {unit}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
