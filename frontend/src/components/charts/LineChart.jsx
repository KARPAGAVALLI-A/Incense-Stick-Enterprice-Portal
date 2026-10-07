import React, { useState } from "react";

/**
 * Reusable Interactive Line Chart
 * Props:
 * - data: Array of objects, e.g. [{ label: "08-04", value: 1900 }, ...]
 * - series: Array of series configs, e.g. [{ key: "value", name: "Production", color: "#3B82F6" }]
 * - height: number
 * - unit: string
 * - emptyMessage: string
 */
export default function LineChart({
  data = [],
  series = [{ key: "sticks", name: "Sticks Produced", color: "#3B82F6" }],
  height = 260,
  unit = "units",
  emptyMessage = "No line chart data available"
}) {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  if (!data || data.length === 0) {
    return (
      <div style={{ height, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontSize: 13 }}>
        {emptyMessage}
      </div>
    );
  }

  // Find max value
  let maxValue = 0;
  data.forEach((d) => {
    series.forEach((s) => {
      const val = Number(d[s.key] || 0);
      if (val > maxValue) maxValue = val;
    });
  });
  if (maxValue === 0) maxValue = 100;
  const yMax = Math.ceil(maxValue * 1.15);

  const chartPadding = { top: 20, right: 25, bottom: 40, left: 45 };
  const svgWidth = 600;
  const svgHeight = height;
  const plotWidth = svgWidth - chartPadding.left - chartPadding.right;
  const plotHeight = svgHeight - chartPadding.top - chartPadding.bottom;

  const yTicks = [0, Math.round(yMax * 0.33), Math.round(yMax * 0.66), yMax];

  // Helper to calculate X and Y
  const getX = (idx) => {
    if (data.length === 1) return chartPadding.left + plotWidth / 2;
    return chartPadding.left + (idx / (data.length - 1)) * plotWidth;
  };

  const getY = (val) => {
    return chartPadding.top + plotHeight - (val / yMax) * plotHeight;
  };

  // Generate SVG path for a line
  const generatePath = (s) => {
    return data.map((d, idx) => {
      const x = getX(idx);
      const y = getY(Number(d[s.key] || 0));
      return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ");
  };

  // Generate Area fill path
  const generateAreaPath = (s) => {
    if (data.length === 0) return "";
    const firstX = getX(0);
    const lastX = getX(data.length - 1);
    const bottomY = chartPadding.top + plotHeight;
    const linePath = data.map((d, idx) => `${idx === 0 ? "M" : "L"} ${getX(idx)} ${getY(Number(d[s.key] || 0))}`).join(" ");
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  return (
    <div style={{ position: "relative", width: "100%", userSelect: "none" }}>
      {/* Legend */}
      {series.length > 1 && (
        <div style={{ display: "flex", gap: 16, justifyContent: "flex-end", marginBottom: 10, fontSize: 12, color: "var(--muted)" }}>
          {series.map((s) => (
            <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 12, height: 3, borderRadius: 2, background: s.color }} />
              <span>{s.name}</span>
            </div>
          ))}
        </div>
      )}

      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{ width: "100%", height: "auto", overflow: "visible" }}
      >
        <defs>
          {series.map((s) => (
            <linearGradient key={`grad-${s.key}`} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.28" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0.0" />
            </linearGradient>
          ))}
        </defs>

        {/* Y-axis gridlines */}
        {yTicks.map((tick, idx) => {
          const y = getY(tick);
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

        {/* Areas & Lines */}
        {series.map((s) => (
          <g key={s.key}>
            {data.length > 1 && (
              <path
                d={generateAreaPath(s)}
                fill={`url(#grad-${s.key})`}
              />
            )}
            <path
              d={generatePath(s)}
              fill="none"
              stroke={s.color}
              strokeWidth={2.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        ))}

        {/* Data points & X-axis labels */}
        {data.map((item, idx) => {
          const x = getX(idx);
          const label = item.label || item.date || item.week || `Pt ${idx + 1}`;

          return (
            <g key={idx}>
              {/* X label */}
              <text
                x={x}
                y={chartPadding.top + plotHeight + 20}
                textAnchor="middle"
                fontSize="11"
                fill="var(--navy, #1E293B)"
                fontWeight="600"
              >
                {label.length > 10 ? label.slice(5) : label}
              </text>

              {/* Series dots */}
              {series.map((s) => {
                const val = Number(item[s.key] || 0);
                const y = getY(val);
                const isHovered = hoveredPoint && hoveredPoint.idx === idx && hoveredPoint.key === s.key;

                return (
                  <g key={s.key}>
                    {/* Invisible larger hover hit target */}
                    <circle
                      cx={x}
                      cy={y}
                      r={14}
                      fill="transparent"
                      style={{ cursor: "pointer" }}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoveredPoint({
                          idx,
                          key: s.key,
                          name: s.name,
                          value: val,
                          label: label,
                          item
                        });
                        setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
                      }}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                    {/* Visible Dot */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? 6 : 4}
                      fill="#FFFFFF"
                      stroke={s.color}
                      strokeWidth={isHovered ? 3.5 : 2.5}
                      style={{ pointerEvents: "none", transition: "all 0.15s ease" }}
                    />
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip */}
      {hoveredPoint && (
        <div
          style={{
            position: "fixed",
            left: tooltipPos.x,
            top: tooltipPos.y - 12,
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
          <div style={{ fontWeight: 700, marginBottom: 2 }}>{hoveredPoint.label}</div>
          <div style={{ color: "#94A3B8", fontSize: "11px" }}>
            {hoveredPoint.name}:{" "}
            <span style={{ color: "#38BDF8", fontWeight: 700 }}>
              {Number(hoveredPoint.value).toLocaleString()} {unit}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
