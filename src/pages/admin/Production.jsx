import React, { useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PRODUCTS } from "../../data/mockData";
import { useSettings } from "../../context/SettingsContext";

const toneClass = { blue: "badge-blue", green: "badge-green", red: "badge-red", amber: "badge-amber" };

// Sample Calendar-Based Production Batch Logs
const INITIAL_BATCH_LOGS = [
  { id: "BAT-2026-0810-01", date: "2026-08-10", shift: "morning", prodId: "PRD-001", prodName: "Rose Sandalwood Premium", qty: 1500, defect: "0.4%", status: "Completed", operator: "Ravi Kumar" },
  { id: "BAT-2026-0810-02", date: "2026-08-10", shift: "evening", prodId: "PRD-002", prodName: "Jasmine Natural Masala", qty: 2200, defect: "0.2%", status: "In Progress", operator: "Priya Sharma" },
  { id: "BAT-2026-0809-01", date: "2026-08-09", shift: "morning", prodId: "PRD-003", prodName: "Cedarwood Dhoop Stick", qty: 1800, defect: "0.6%", status: "Completed", operator: "Suresh P" },
  { id: "BAT-2026-0809-02", date: "2026-08-09", shift: "night", prodId: "PRD-001", prodName: "Rose Sandalwood Premium", qty: 950, defect: "0.1%", status: "Completed", operator: "Anita Roy" },
  { id: "BAT-2026-0808-01", date: "2026-08-08", shift: "morning", prodId: "PRD-001", prodName: "Rose Sandalwood Premium", qty: 1600, defect: "0.3%", status: "Completed", operator: "Ravi Kumar" },
  { id: "BAT-2026-0808-02", date: "2026-08-08", shift: "evening", prodId: "PRD-002", prodName: "Jasmine Natural Masala", qty: 1400, defect: "0.5%", status: "Completed", operator: "Karthik M" },
  { id: "BAT-2026-0807-01", date: "2026-08-07", shift: "morning", prodId: "PRD-002", prodName: "Jasmine Natural Masala", qty: 2000, defect: "0.3%", status: "Completed", operator: "Priya Sharma" }
];

export default function Production() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useSettings();

  // 1. useState: Calendar Date Picker & Preset Filter State
  const [filterMode, setFilterMode] = useState("all"); // 'all', 'today', 'week', 'custom'
  const [selectedDate, setSelectedDate] = useState("2026-08-10");

  const selectedIndex = id ? PRODUCTS.findIndex((prod) => prod.id === id) : 0;
  const p = PRODUCTS[selectedIndex === -1 ? 0 : selectedIndex] || PRODUCTS[0];

  // 2. useCallback: Date Selector Handlers
  const handleDateChange = useCallback((e) => {
    setSelectedDate(e.target.value);
    setFilterMode("custom");
  }, []);

  const handlePresetSelect = useCallback((mode) => {
    setFilterMode(mode);
    if (mode === "today") {
      setSelectedDate("2026-08-10");
    }
  }, []);

  // 3. useMemo: Filter Production Logs by Selected Date & Compute Metrics
  const filteredBatches = useMemo(() => {
    return INITIAL_BATCH_LOGS.filter((b) => {
      if (filterMode === "all") return true;
      if (filterMode === "today" || filterMode === "custom") return b.date === selectedDate;
      if (filterMode === "week") return b.date >= "2026-08-04" && b.date <= "2026-08-10";
      return true;
    });
  }, [filterMode, selectedDate]);

  // Aggregate quantity for filtered batches
  const totalBatchQty = useMemo(() => {
    return filteredBatches.reduce((acc, b) => acc + (b.qty || 0), 0);
  }, [filteredBatches]);

  return (
    <div>
      {/* Page Title */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--navy)" }}>
          ⚙️ {t("productionOverview")}
        </h1>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
          {t("productionSub")}
        </p>
      </div>

      {/* 📅 CALENDAR DATE PICKER HEADER BAR */}
      <div style={{
        background: "var(--card-bg, #fff)", border: "1px solid var(--border)",
        borderRadius: 14, padding: "16px 20px", marginBottom: 24,
        display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16,
        boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 10, background: "var(--blue-xs)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22
          }}>
            📅
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--navy)" }}>
              {t("dateFilter")}
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>
              Viewing {filteredBatches.length} batch log(s) · {totalBatchQty.toLocaleString()} units
            </div>
          </div>
        </div>

        {/* Date Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginLeft: "auto" }}>
          {/* Quick Preset Filter Chips */}
          <button
            onClick={() => handlePresetSelect("all")}
            style={{
              padding: "6px 14px", borderRadius: 20, border: "1px solid var(--border)",
              background: filterMode === "all" ? "var(--blue)" : "var(--bg)",
              color: filterMode === "all" ? "#fff" : "var(--text)",
              fontSize: 12, fontWeight: 600, cursor: "pointer"
            }}
          >
            {t("allDates")}
          </button>
          <button
            onClick={() => handlePresetSelect("today")}
            style={{
              padding: "6px 14px", borderRadius: 20, border: "1px solid var(--border)",
              background: filterMode === "today" ? "var(--blue)" : "var(--bg)",
              color: filterMode === "today" ? "#fff" : "var(--text)",
              fontSize: 12, fontWeight: 600, cursor: "pointer"
            }}
          >
            {t("today")} (Aug 10)
          </button>
          <button
            onClick={() => handlePresetSelect("week")}
            style={{
              padding: "6px 14px", borderRadius: 20, border: "1px solid var(--border)",
              background: filterMode === "week" ? "var(--blue)" : "var(--bg)",
              color: filterMode === "week" ? "#fff" : "var(--text)",
              fontSize: 12, fontWeight: 600, cursor: "pointer"
            }}
          >
            {t("thisWeek")}
          </button>

          {/* Real HTML5 Calendar Date Input */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg)", border: "1px solid var(--border)", padding: "5px 12px", borderRadius: 8 }}>
            <span style={{ fontSize: 13 }}>📆</span>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              style={{
                border: "none", background: "transparent", color: "var(--navy)",
                fontSize: 12, fontWeight: 600, fontFamily: "var(--main-font)", outline: "none"
              }}
            />
          </div>
        </div>
      </div>

      {/* Product Selector Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 24 }}>
        {PRODUCTS.map((prod) => (
          <div
            key={prod.id}
            onClick={() => navigate(`/admin/production/${prod.id}`)}
            style={{
              background: "var(--card-bg, #fff)", border: `2px solid ${prod.id === p.id ? "var(--blue)" : "var(--border)"}`,
              borderRadius: 13, padding: 14, cursor: "pointer",
              backgroundColor: prod.id === p.id ? "var(--blue-xs)" : "var(--card-bg, #fff)",
              transition: "transform 0.2s ease"
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 9, background: "linear-gradient(135deg,#DBEAFE,#EFF6FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 8 }}>{prod.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>{prod.name}</div>
            <div style={{ height: 5, background: "var(--border)", borderRadius: 99, overflow: "hidden", marginBottom: 4 }}>
              <div style={{ height: "100%", width: `${prod.pct || 0}%`, background: prod.tone === "green" ? "var(--green)" : prod.tone === "red" ? "var(--red)" : "var(--blue)" }} />
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)" }}>{prod.status || "Active"} · {prod.pct || 0}%</div>
          </div>
        ))}
      </div>

      {/* Selected Product Detail Panel */}
      <div style={{ background: "var(--card-bg, #fff)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", marginBottom: 24 }}>
        <div style={{ padding: 22, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 16, background: "var(--bg)" }}>
          <div style={{ width: 52, height: 52, borderRadius: 13, background: "linear-gradient(135deg,#DBEAFE,#EFF6FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{p.icon}</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "var(--navy)" }}>{p.name}</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Product Code: {p.id}</div>
          </div>
          <div style={{ marginLeft: "auto" }}><span className={`badge ${toneClass[p.tone || "blue"]}`}>{p.status || "Active"}</span></div>
        </div>

        <div style={{ padding: 22 }}>
          {/* Key Metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 22 }}>
            <div style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 14, background: "var(--card-bg)" }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>{t("inProduction")}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--navy)", marginTop: 4 }}>{(p.inProd || 0).toLocaleString()}</div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>of {(p.target || 0).toLocaleString()} target</div>
            </div>
            <div style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 14, background: "var(--card-bg)" }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>{t("stockInHand")}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--navy)", marginTop: 4 }}>{(p.stock || 0).toLocaleString()}</div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>ready to dispatch</div>
            </div>
            <div style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 14, background: "var(--card-bg)" }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>{t("ordersPending")}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--navy)", marginTop: 4 }}>{(p.orders || 0).toLocaleString()}</div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>total units ordered</div>
            </div>
            <div style={{ border: "1px solid var(--border)", background: "var(--blue-xs)", borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>{t("leftToComplete")}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--blue)", marginTop: 4 }}>{(p.toComplete || 0).toLocaleString()}</div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>orders − stock in hand</div>
            </div>
          </div>

          {/* Raw Material Availability Table */}
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--navy)", marginBottom: 12 }}>{t("rawMaterialHeader")}</div>
          <div style={{ overflowX: "auto", marginBottom: 24 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, minWidth: 480 }}>
              <thead>
                <tr style={{ background: "var(--bg)" }}>
                  {[t("material"), t("required"), t("available"), t("status")].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "9px 12px", fontSize: 10.5, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(p.materials || []).map((m) => (
                  <tr key={m.name} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "10px 12px", fontWeight: 600, color: "var(--text)" }}>{m.name}</td>
                    <td style={{ padding: "10px 12px", color: "var(--muted)" }}>{m.need || m.reorder || "—"}</td>
                    <td style={{ padding: "10px 12px", color: "var(--muted)" }}>{m.avail || m.stock || "—"}</td>
                    <td style={{ padding: "10px 12px" }}><span className={`badge ${toneClass[m.tone || "blue"]}`}>{m.status || "In Stock"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 📅 CALENDAR-FILTERED PRODUCTION BATCH LOG TABLE */}
      <div style={{ background: "var(--card-bg, #fff)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--border)", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)" }}>{t("batchLog")}</div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
              Showing batches for {filterMode === "all" ? t("allDates") : selectedDate}
            </div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", background: "var(--blue-xs)", padding: "4px 10px", borderRadius: 99 }}>
            {filteredBatches.length} Entries Found
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, minWidth: 600 }}>
            <thead>
              <tr style={{ background: "var(--bg)" }}>
                {[t("batchId"), t("date"), t("shift"), t("product"), t("quantity"), t("defectRate"), t("status")].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 10.5, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredBatches.length > 0 ? (
                filteredBatches.map((b) => (
                  <tr key={b.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "12px 14px", fontWeight: 700, color: "var(--blue)" }}>{b.id}</td>
                    <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--text)" }}>📆 {b.date}</td>
                    <td style={{ padding: "12px 14px", textTransform: "capitalize", color: "var(--muted)" }}>
                      {b.shift === "morning" ? "🌅 " + t("morning") : b.shift === "evening" ? "🌆 " + t("evening") : "🌙 " + t("night")}
                    </td>
                    <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--navy)" }}>{b.prodName}</td>
                    <td style={{ padding: "12px 14px", fontWeight: 700, color: "var(--text)" }}>{b.qty.toLocaleString()} units</td>
                    <td style={{ padding: "12px 14px", color: "var(--muted)" }}>{b.defect}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span className={`badge ${b.status === "Completed" ? "badge-green" : "badge-amber"}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ padding: 24, textAlign: "center", color: "var(--muted)", fontSize: 13 }}>
                    No production batches found for {selectedDate}. Try selecting another date from the calendar!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
