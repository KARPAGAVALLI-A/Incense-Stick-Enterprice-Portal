import React from "react";
import { useLocation } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { useSettings } from "../../context/SettingsContext";

const MONTHLY = [
  { month: "Apr", revenue: 42, cost: 29 },
  { month: "May", revenue: 46, cost: 31 },
  { month: "Jun", revenue: 51, cost: 33 },
  { month: "Jul", revenue: 58, cost: 34 },
];

function Bar({ label, value, max, color }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 34, fontSize: 11.5, fontWeight: 600, color: "var(--muted)" }}>{label}</div>
      <div style={{ flex: 1, height: 22, background: "var(--bg)", borderRadius: 6, overflow: "hidden", position: "relative" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 6, display: "flex", alignItems: "center", paddingLeft: 8 }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: "#fff" }}>₹{value}L</span>
        </div>
      </div>
    </div>
  );
}

export default function ProfitLoss() {
  const { orders } = useData();
  const { t } = useSettings();
  const location = useLocation();

  const maxVal = Math.max(...MONTHLY.map((m) => m.revenue)) + 5;

  const totalRevenue = MONTHLY.reduce((s, m) => s + m.revenue, 0);
  const totalCost = MONTHLY.reduce((s, m) => s + m.cost, 0);
  const totalProfit = totalRevenue - totalCost;
  const margin = ((totalProfit / totalRevenue) * 100).toFixed(1);

  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;
  const pendingOrders = orders.filter((o) => o.status !== "Delivered").length;

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--navy)" }}>💹 {t("profitLoss")}</h1>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
          Company financial overview — last 4 months · Route: <code>{location.pathname}</code>
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        <div style={{ background: "var(--card-bg, #fff)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "var(--blue)" }} />
          <div style={{ fontSize: 11.5, color: "var(--muted)" }}>Total Revenue</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "var(--navy)" }}>₹{totalRevenue}L</div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>Apr – Jul 2026</div>
        </div>
        <div style={{ background: "var(--card-bg, #fff)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "var(--amber)" }} />
          <div style={{ fontSize: 11.5, color: "var(--muted)" }}>Total Cost</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "var(--navy)" }}>₹{totalCost}L</div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>Raw material + labor + machine</div>
        </div>
        <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 12, padding: 16, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#10B981" }} />
          <div style={{ fontSize: 11.5, color: "#047857" }}>Net Profit</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#059669" }}>₹{totalProfit}L</div>
          <div style={{ fontSize: 11, color: "#059669", marginTop: 2 }}>{margin}% margin</div>
        </div>
        <div style={{ background: "var(--card-bg, #fff)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#8B5CF6" }} />
          <div style={{ fontSize: 11.5, color: "var(--muted)" }}>Orders</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "var(--navy)" }}>{orders.length}</div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{deliveredOrders} delivered · {pendingOrders} pending</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 400px", background: "var(--card-bg, #fff)", border: "1px solid var(--border)", borderRadius: 14, padding: 22 }}>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--navy)", marginBottom: 4 }}>Revenue vs Cost</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 20 }}>Monthly comparison, in ₹ Lakhs</div>

          {MONTHLY.map((m) => (
            <div key={m.month} style={{ marginBottom: 16 }}>
              <Bar label={m.month} value={m.revenue} max={maxVal} color="var(--blue)" />
              <div style={{ marginTop: 6 }}>
                <Bar label="" value={m.cost} max={maxVal} color="var(--amber)" />
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 20, fontSize: 11.5, color: "var(--muted)", marginTop: 10 }}>
            <span><span style={{ display: "inline-block", width: 10, height: 10, background: "var(--blue)", borderRadius: 3, marginRight: 6 }} />Revenue</span>
            <span><span style={{ display: "inline-block", width: 10, height: 10, background: "var(--amber)", borderRadius: 3, marginRight: 6 }} />Cost</span>
          </div>
        </div>

        <div style={{ flex: "1 1 300px", background: "var(--card-bg, #fff)", border: "1px solid var(--border)", borderRadius: 14, padding: 22 }}>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--navy)", marginBottom: 14 }}>Cost Breakdown</div>
          {[
            { label: "Raw Materials", pct: 52, color: "var(--blue)" },
            { label: "Labor", pct: 28, color: "var(--amber)" },
            { label: "Machine & Maintenance", pct: 12, color: "#8B5CF6" },
            { label: "Logistics", pct: 8, color: "#10B981" },
          ].map((c) => (
            <div key={c.label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 6 }}>
                <span style={{ color: "var(--text)" }}>{c.label}</span>
                <span style={{ fontWeight: 700, color: "var(--navy)" }}>{c.pct}%</span>
              </div>
              <div style={{ height: 6, background: "var(--bg)", borderRadius: 99 }}>
                <div style={{ height: "100%", width: `${c.pct}%`, background: c.color, borderRadius: 99 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
