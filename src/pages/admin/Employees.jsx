import React, { useState, useMemo } from "react";
import { Link, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { PAST_EMPLOYEES } from "../../data/mockData";
import { useData } from "../../context/DataContext";
import { useSettings } from "../../context/SettingsContext";
import Pagination from "../../components/Pagination";

const statusTone = { Present: "badge-green", "Half Day": "badge-amber", Absent: "badge-red", "On Leave": "badge-blue" };

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

export default function Employees({ readOnly = false }) {
  const [tab, setTab] = useState("present");
  const { employees } = useData();
  const { t } = useSettings();

  // React Router v7 Hooks Integration
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // URL state persistence for page & page size
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("limit") || "5", 10);

  const rawList = tab === "present" ? employees : PAST_EMPLOYEES;
  const totalItems = rawList.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const currentPage = Math.min(page, totalPages);

  // Paginated Data slice
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return rawList.slice(start, start + pageSize);
  }, [rawList, currentPage, pageSize]);

  function handlePageChange(newPage) {
    setSearchParams({ page: newPage.toString(), limit: pageSize.toString() });
  }

  function handlePageSizeChange(newSize) {
    setSearchParams({ page: "1", limit: newSize.toString() });
  }

  function handleDownload() {
    const rows = tab === "present"
      ? employees.map((e) => ({ ID: e.id, Name: e.name, Department: e.dept, Status: e.status, Production: e.production }))
      : PAST_EMPLOYEES.map((e) => ({ ID: e.id, Name: e.name, Department: e.dept, Joined: e.joined, Left: e.left, TotalProduction: e.total, Reason: e.reason }));
    downloadCSV(rows, `ise-employees-${tab}-${new Date().toISOString().slice(0, 10)}.csv`);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--navy)" }}>👷 {t("employees")}</h1>
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
            Attendance, production output & staff records · Route: <code>{location.pathname}</code>
          </p>
        </div>
        <button className="btn btn-outline" onClick={handleDownload}>📥 Download Report</button>
      </div>

      <div style={{ display: "flex", gap: 4, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: 4, width: "fit-content", marginBottom: 20 }}>
        <div onClick={() => { setTab("present"); setSearchParams({ page: "1", limit: pageSize.toString() }); }} style={{ padding: "9px 20px", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", background: tab === "present" ? "var(--card-bg, #fff)" : "transparent", color: tab === "present" ? "var(--blue)" : "var(--muted)" }}>Present Employees ({employees.length})</div>
        <div onClick={() => { setTab("past"); setSearchParams({ page: "1", limit: pageSize.toString() }); }} style={{ padding: "9px 20px", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", background: tab === "past" ? "var(--card-bg, #fff)" : "transparent", color: tab === "past" ? "var(--blue)" : "var(--muted)" }}>Past Employees ({PAST_EMPLOYEES.length})</div>
      </div>

      {tab === "present" ? (
        <div style={{ background: "var(--card-bg, #fff)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead style={{ background: "var(--bg)" }}>
              <tr>
                {["Employee", "Department", "Status", "Production (units)"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "11px 16px", fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((e) => (
                <tr key={e.id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <Link to={`/admin/employees/${e.id}`} style={{ fontWeight: 600, color: "var(--blue)", textDecoration: "none" }}>{e.name}</Link>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{e.id}</div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--text)" }}>{e.dept}</td>
                  <td style={{ padding: "12px 16px" }}><span className={`badge ${statusTone[e.status]}`}>{e.status}</span></td>
                  <td style={{ padding: "12px 16px", fontWeight: 600, color: "var(--navy)" }}>{e.production.toLocaleString()}</td>
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
      ) : (
        <div style={{ background: "var(--card-bg, #fff)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead style={{ background: "var(--bg)" }}>
              <tr>
                {["Employee", "Department", "Joined", "Left", "Total Production", "Reason"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "11px 16px", fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((e) => (
                <tr key={e.id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontWeight: 600, color: "var(--text)" }}>{e.name}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{e.id}</div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--text)" }}>{e.dept}</td>
                  <td style={{ padding: "12px 16px", color: "var(--muted)" }}>{e.joined}</td>
                  <td style={{ padding: "12px 16px", color: "var(--muted)" }}>{e.left}</td>
                  <td style={{ padding: "12px 16px", fontWeight: 600, color: "var(--navy)" }}>{e.total.toLocaleString()}</td>
                  <td style={{ padding: "12px 16px" }}><span className="badge badge-blue">{e.reason}</span></td>
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
      )}
    </div>
  );
}
