import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { useSettings } from "../../context/SettingsContext";

const MONTHLY = [
  { month: "Apr", revenue: 42, cost: 29 },
  { month: "May", revenue: 46, cost: 31 },
  { month: "Jun", revenue: 51, cost: 33 },
  { month: "Jul", revenue: 58, cost: 34 },
];

function downloadCSV(rows, filename) {
  const header = Object.keys(rows[0]).join(",");
  const body = rows.map((r) => Object.values(r).map((v) => `"${v}"`).join(",")).join("\n");
  const csv = header + "\n" + body;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

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

  // Dynamic Changing Market Share & Stock Ticker State
  const [shareValue, setShareValue] = useState(482.50);
  const [marketSharePct, setMarketSharePct] = useState(34.8);
  const [demandIndex, setDemandIndex] = useState(94.2);

  // Live fluctuating stock & market share ticker (Changes dynamically!)
  useEffect(() => {
    const timer = setInterval(() => {
      setShareValue((prev) => Number((prev + (Math.random() * 1.8 - 0.8)).toFixed(2)));
      setMarketSharePct((prev) => Number((prev + (Math.random() * 0.4 - 0.18)).toFixed(1)));
      setDemandIndex((prev) => Number((prev + (Math.random() * 0.6 - 0.25)).toFixed(1)));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const maxVal = Math.max(...MONTHLY.map((m) => m.revenue)) + 5;
  const totalRevenue = MONTHLY.reduce((s, m) => s + m.revenue, 0);
  const totalCost = MONTHLY.reduce((s, m) => s + m.cost, 0);
  const totalProfit = totalRevenue - totalCost;
  const margin = ((totalProfit / totalRevenue) * 100).toFixed(1);

  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;
  const pendingOrders = orders.filter((o) => o.status !== "Delivered").length;

  function handleDownloadReport() {
    const rows = MONTHLY.map((m) => ({
      Month: m.month,
      Revenue_Lakhs: m.revenue,
      Cost_Lakhs: m.cost,
      NetProfit_Lakhs: m.revenue - m.cost,
      Margin_Pct: (((m.revenue - m.cost) / m.revenue) * 100).toFixed(1) + "%"
    }));
    downloadCSV(rows, `ise-profit-loss-report-${new Date().toISOString().slice(0, 10)}.csv`);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--navy)" }}>💹 {t("profitLoss")} &amp; Market Intelligence</h1>
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
            Company financial overview, live changing share market ticker &amp; AI growth advisor
          </p>
        </div>
        <button className="btn btn-outline" onClick={handleDownloadReport}>📥 Download Financial Report</button>
      </div>

      {/* 📈 LIVE CHANGING MARKET SHARE & STOCK TICKER STRIP */}
      <div style={{
        background: "linear-gradient(135deg, #0F172A, #1E293B)", borderRadius: 16, padding: "16px 20px", marginBottom: 24,
        color: "#FFFFFF", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16,
        border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>📈</span>
          <div>
            <div style={{ fontSize: 11, textTransform: "uppercase", color: "#38BDF8", fontWeight: 700 }}>ISE Enterprise Market Shares</div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>₹{shareValue} <span style={{ fontSize: 12, color: "#10B981" }}>▲ +3.4% Live</span></div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🛍️</span>
          <div>
            <div style={{ fontSize: 11, textTransform: "uppercase", color: "#FBBF24", fontWeight: 700 }}>Diwali Incense Market Share</div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{marketSharePct}% <span style={{ fontSize: 12, color: "#10B981" }}>▲ Dynamic</span></div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>⚡</span>
          <div>
            <div style={{ fontSize: 11, textTransform: "uppercase", color: "#34D399", fontWeight: 700 }}>Market Demand Index</div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{demandIndex} / 100</div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
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

      {/* 🤖 AI STRATEGIC BUSINESS IMPROVEMENT ADVISOR */}
      <div style={{ background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 16, padding: 20, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 22 }}>🤖</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#0369A1" }}>AI Profit &amp; Growth Recommendations Advisor</div>
            <div style={{ fontSize: 12, color: "#0284C7" }}>Automated suggestions on how to improve company profits &amp; sales shares</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
          <div style={{ background: "#FFFFFF", border: "1px solid #E0F2FE", borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0369A1" }}>1. Raw Material Sourcing Cut (▲ +6.2% Profit)</div>
            <div style={{ fontSize: 11.5, color: "#334155", marginTop: 4 }}>
              Bulk purchase Bamboo sticks and Jigat powder from Salem regional cooperatives to save 8% transport cost.
            </div>
          </div>
          <div style={{ background: "#FFFFFF", border: "1px solid #E0F2FE", borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0369A1" }}>2. Diwali Combo Pack Stocking (▲ +12.4% Revenue)</div>
            <div style={{ fontSize: 11.5, color: "#334155", marginTop: 4 }}>
              Increase Rose Sandalwood &amp; Jasmine Gift Pack production by 20% to capture upcoming festival surge.
            </div>
          </div>
          <div style={{ background: "#FFFFFF", border: "1px solid #E0F2FE", borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0369A1" }}>3. Fleet Fuel Route Optimization (▲ +4.8% Savings)</div>
            <div style={{ fontSize: 11.5, color: "#334155", marginTop: 4 }}>
              Use Erode Logistics Hub for central distribution to cut Salem to Kovilpatti delivery mileage by 45 km.
            </div>
          </div>
        </div>
      </div>

      {/* 🗓️ CALENDAR FINANCIAL TIMETABLE */}
      <div style={{ background: "var(--card-bg, #fff)", border: "1px solid var(--border)", borderRadius: 16, padding: 22, marginBottom: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "var(--navy)", marginBottom: 14 }}>
          🗓️ Monthly Financial Calendar Timetable
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead style={{ background: "var(--bg)" }}>
              <tr>
                {["Day", "Financial Activity Scheduled", "Forecast Revenue", "Expense Target", "Share Dividend Allocation"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { day: "Mon 01 Sep", task: "Raw Material Bulk Purchase Payment", rev: "₹2.4L", exp: "₹1.8L", div: "₹45,000" },
                { day: "Thu 05 Sep", task: "Logistics & Fleet Fuel Settlement", rev: "₹3.8L", exp: "₹2.1L", div: "₹60,000" },
                { day: "Mon 10 Sep", task: "Employee Salary & Festival Bonus Advance", rev: "₹5.2L", exp: "₹3.4L", div: "₹85,000" },
                { day: "Fri 15 Sep", task: "Diwali Gift Pack Distribution Release", rev: "₹6.5L", exp: "₹2.8L", div: "₹1,20,000" },
                { day: "Wed 20 Sep", task: "Share Market Profit Dividend Payout", rev: "₹8.1L", exp: "₹3.2L", div: "₹1,50,000" },
              ].map((row) => (
                <tr key={row.day} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 700, color: "var(--blue)" }}>{row.day}</td>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--navy)" }}>{row.task}</td>
                  <td style={{ padding: "12px 14px", fontWeight: 700, color: "#10B981" }}>{row.rev}</td>
                  <td style={{ padding: "12px 14px", color: "var(--amber)" }}>{row.exp}</td>
                  <td style={{ padding: "12px 14px", fontWeight: 700, color: "#8B5CF6" }}>{row.div}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue vs Cost & Breakdown Charts */}
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
