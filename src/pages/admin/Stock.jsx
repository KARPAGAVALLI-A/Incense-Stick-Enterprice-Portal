import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getStockList, useData } from "../../context/DataContext";
import { useNotifications } from "../../context/NotificationContext";
import { useSettings } from "../../context/SettingsContext";
import Pagination from "../../components/Pagination";

const toneClass = { green: "badge-green", amber: "badge-amber", red: "badge-red" };
const toneLabel = { green: "In Stock", amber: "Low Stock", red: "Out of Stock" };

export default function Stock({ readOnly = false }) {
  const stock = getStockList();
  const { employees, addTask } = useData();
  const { push } = useNotifications();
  const { t } = useSettings();

  const [searchParams, setSearchParams] = useSearchParams();
  const [assigning, setAssigning] = useState(null);
  const [empId, setEmpId] = useState("");
  const [qty, setQty] = useState("");

  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("limit") || "5", 10);

  const totalItems = stock.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedStock = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return stock.slice(start, start + pageSize);
  }, [stock, currentPage, pageSize]);

  function handlePageChange(newPage) {
    setSearchParams({ page: newPage.toString(), limit: pageSize.toString() });
  }

  function handlePageSizeChange(newSize) {
    setSearchParams({ page: "1", limit: newSize.toString() });
  }

  const shortageCount = stock.filter((s) => s.tone === "red").length;
  const lowCount = stock.filter((s) => s.tone === "amber").length;

  function openAssign(row) {
    setAssigning(row);
    setEmpId("");
    setQty(String(Math.max(row.need - row.avail, 0)) || "");
  }

  function submitAssign(e) {
    e.preventDefault();
    const emp = employees.find((x) => x.id === empId);
    if (!emp || !qty) {
      alert("Please choose an employee and enter a quantity.");
      return;
    }
    addTask({
      productId: assigning.productId,
      productName: assigning.product,
      employeeId: emp.id,
      employeeName: emp.name,
      qty: Number(qty),
      assignedBy: "Manager",
      note: `${assigning.name} shortage — produce more ${assigning.product}`,
    });
    push("employee", "New task assigned", `You've been assigned to produce ${qty} units of ${assigning.product}.`);
    push("admin", "Work assigned", `${emp.name} was assigned ${qty} units of ${assigning.product} to cover ${assigning.name} shortage.`);
    setAssigning(null);
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--navy)" }}>📦 {t("stock")} &amp; Raw Materials</h1>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>Live availability across every product</p>
      </div>

      <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 16px" }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#DC2626" }}>{shortageCount}</span>
          <span style={{ fontSize: 12, color: "#DC2626", marginLeft: 6 }}>Out of Stock</span>
        </div>
        <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: "10px 16px" }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#D97706" }}>{lowCount}</span>
          <span style={{ fontSize: 12, color: "#D97706", marginLeft: 6 }}>Low Stock</span>
        </div>
      </div>

      <div style={{ background: "var(--card-bg, #fff)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead style={{ background: "var(--bg)" }}>
            <tr>
              {["Product", "Material", "Required", "Available", "Status", !readOnly ? "Action" : null].filter(Boolean).map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "11px 16px", fontSize: 10.5, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedStock.map((row, i) => (
              <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                <td style={{ padding: "11px 16px" }}>
                  <span style={{ marginRight: 6 }}>{row.icon}</span>
                  <span style={{ color: "var(--text)" }}>{row.product}</span>
                </td>
                <td style={{ padding: "11px 16px", fontWeight: 600, color: "var(--navy)" }}>{row.name}</td>
                <td style={{ padding: "11px 16px", color: "var(--muted)" }}>{row.need}</td>
                <td style={{ padding: "11px 16px", color: "var(--muted)" }}>{row.avail}</td>
                <td style={{ padding: "11px 16px" }}><span className={`badge ${toneClass[row.tone]}`}>{toneLabel[row.tone]}</span></td>
                {!readOnly && (
                  <td style={{ padding: "11px 16px" }}>
                    {row.tone !== "green" ? (
                      <button className="btn btn-outline" style={{ fontSize: 11.5, padding: "6px 12px" }} onClick={() => openAssign(row)}>
                        👷 Assign Work
                      </button>
                    ) : (
                      <span style={{ fontSize: 11.5, color: "var(--muted)" }}>—</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Bar */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

      {assigning && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500 }} onClick={() => setAssigning(null)}>
          <form onSubmit={submitAssign} onClick={(e) => e.stopPropagation()} style={{ background: "var(--card-bg, #fff)", borderRadius: 14, padding: 24, width: 380, boxShadow: "0 20px 50px rgba(0,0,0,0.2)" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)", marginBottom: 4 }}>Assign Work</div>
            <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 18 }}>{assigning.product} · {assigning.name} is {toneLabel[assigning.tone].toLowerCase()}</div>

            <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Assign to Employee</label>
            <select value={empId} onChange={(e) => setEmpId(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13, marginBottom: 16 }}>
              <option value="">Select employee…</option>
              {employees.map((e) => <option key={e.id} value={e.id}>{e.name} · {e.dept}</option>)}
            </select>

            <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Quantity to Produce (units)</label>
            <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13, marginBottom: 20, boxSizing: "border-box" }} />

            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setAssigning(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Assign →</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
