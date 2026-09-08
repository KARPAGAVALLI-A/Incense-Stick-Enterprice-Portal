import React, { useState, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { PAST_EMPLOYEES } from "../../data/mockData";
import { useData } from "../../context/DataContext";
import { useSettings } from "../../context/SettingsContext";
import { useNotifications } from "../../context/NotificationContext";
import Pagination from "../../components/Pagination";
import DiwaliBonusHub from "../../components/DiwaliBonusHub";

const statusTone = { Present: "badge-green", "Half Day": "badge-amber", Absent: "badge-red", "On Leave": "badge-blue" };
const DEPARTMENTS = [
  "Rolling Unit",
  "Outdoor Sun-Drying",
  "Packaging & Sealing",
  "Quality Inspection",
  "Fragrance Mixing",
  "Logistics & Delivery"
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

export default function Employees({ readOnly = false }) {
  const [tab, setTab] = useState("present");
  const [selectedDept, setSelectedDept] = useState("All");

  // CRUD Modals State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [deleteConfirmEmp, setDeleteConfirmEmp] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    dept: "Rolling Unit",
    status: "Present",
    production: 4000,
    joined: new Date().toISOString().slice(0, 10)
  });

  const { employees, addEmployee, updateEmployee, removeEmployee } = useData();
  const { t } = useSettings();
  const { push } = useNotifications();

  // Router hooks for Pagination URL query parameters
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("limit") || "10", 10);

  const rawList = tab === "present" ? employees : PAST_EMPLOYEES;

  // Filter by department
  const filteredList = useMemo(() => {
    if (selectedDept === "All") return rawList;
    return rawList.filter((e) => e.dept === selectedDept);
  }, [rawList, selectedDept]);

  const totalItems = filteredList.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredList.slice(start, start + pageSize);
  }, [filteredList, currentPage, pageSize]);

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

  // --- CRUD Handlers ---
  function handleOpenAdd() {
    setFormData({
      name: "",
      dept: "Rolling Unit",
      status: "Present",
      production: 4200,
      joined: new Date().toISOString().slice(0, 10)
    });
    setShowAddModal(true);
  }

  function handleOpenEdit(emp) {
    setEditEmployee(emp);
    setFormData({
      name: emp.name,
      dept: emp.dept,
      status: emp.status,
      production: emp.production || 0,
      joined: emp.joined || new Date().toISOString().slice(0, 10)
    });
  }

  function handleSaveAdd(e) {
    e.preventDefault();
    if (!formData.name.trim()) return alert("Please enter employee name!");

    const newId = `EMP-${1000 + employees.length + 1}`;
    const newEmp = {
      id: newId,
      name: formData.name.trim(),
      dept: formData.dept,
      status: formData.status,
      production: Number(formData.production) || 0,
      joined: formData.joined
    };

    addEmployee(newEmp);
    push("admin", "New Employee Added", `Added ${newEmp.name} (${newEmp.id}) to ${newEmp.dept}.`);
    setShowAddModal(false);
  }

  function handleSaveEdit(e) {
    e.preventDefault();
    if (!editEmployee || !formData.name.trim()) return;

    updateEmployee(editEmployee.id, {
      name: formData.name.trim(),
      dept: formData.dept,
      status: formData.status,
      production: Number(formData.production) || 0,
      joined: formData.joined
    });

    push("admin", "Employee Updated", `Updated details for ${editEmployee.id} (${formData.name}).`);
    setEditEmployee(null);
  }

  function handleConfirmRemove() {
    if (!deleteConfirmEmp) return;
    removeEmployee(deleteConfirmEmp.id);
    push("admin", "Employee Removed", `Removed ${deleteConfirmEmp.name} (${deleteConfirmEmp.id}) from staff database.`);
    setDeleteConfirmEmp(null);
  }

  return (
    <div>
      {/* Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--navy)" }}>👷 {t("employees")} ({employees.length} Active Staff)</h1>
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
            Attendance, production output, staff management &amp; persistent DB
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {!readOnly && (
            <button className="btn btn-primary" onClick={handleOpenAdd} style={{ fontSize: 12.5, padding: "8px 16px", background: "#10B981", border: "none", color: "#fff", fontWeight: 600, borderRadius: 8, cursor: "pointer" }}>
              ➕ Add New Employee
            </button>
          )}
          <button className="btn btn-outline" onClick={handleDownload}>📥 Download Report</button>
        </div>
      </div>

      {/* Tabs & Department Filter Bar */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: 4 }}>
          <div onClick={() => { setTab("present"); setSearchParams({ page: "1", limit: pageSize.toString() }); }} style={{ padding: "8px 16px", borderRadius: 7, fontSize: 12.5, fontWeight: 600, cursor: "pointer", background: tab === "present" ? "var(--card-bg, #fff)" : "transparent", color: tab === "present" ? "var(--blue)" : "var(--muted)" }}>Active Staff ({employees.length})</div>
          <div onClick={() => { setTab("past"); setSearchParams({ page: "1", limit: pageSize.toString() }); }} style={{ padding: "8px 16px", borderRadius: 7, fontSize: 12.5, fontWeight: 600, cursor: "pointer", background: tab === "past" ? "var(--card-bg, #fff)" : "transparent", color: tab === "past" ? "var(--blue)" : "var(--muted)" }}>Past Staff ({PAST_EMPLOYEES.length})</div>
          <div onClick={() => setTab("diwali")} style={{ padding: "8px 16px", borderRadius: 7, fontSize: 12.5, fontWeight: 700, cursor: "pointer", background: tab === "diwali" ? "#FFFBEB" : "transparent", color: tab === "diwali" ? "#B45309" : "var(--muted)" }}>🎆 Diwali Bonus Hub</div>
        </div>

        {tab !== "diwali" && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "var(--navy)" }}>Department:</label>
            <select
              value={selectedDept}
              onChange={(e) => { setSelectedDept(e.target.value); setSearchParams({ page: "1", limit: pageSize.toString() }); }}
              style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--card-bg)", color: "var(--text)", fontSize: 12, fontWeight: 600 }}
            >
              <option value="All">All Departments ({rawList.length})</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        )}
      </div>

      {tab === "diwali" ? (
        <DiwaliBonusHub />
      ) : tab === "present" ? (
        <div style={{ background: "var(--card-bg, #fff)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead style={{ background: "var(--bg)" }}>
              <tr>
                {["Employee", "Department", "Status", "Production (units)", "Actions"].map((h) => (
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
                  <td style={{ padding: "12px 16px", fontWeight: 600, color: "var(--navy)" }}>{(e.production || 0).toLocaleString()}</td>
                  <td style={{ padding: "12px 16px" }}>
                    {!readOnly ? (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => handleOpenEdit(e)}
                          style={{ padding: "4px 10px", fontSize: 11.5, background: "#EFF6FF", border: "1px solid #BFDBFE", color: "#1D4ED8", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirmEmp(e)}
                          style={{ padding: "4px 10px", fontSize: 11.5, background: "#FEF2F2", border: "1px solid #FCA5A5", color: "#DC2626", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}
                        >
                          🗑️ Remove
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: 11.5, color: "var(--muted)" }}>Read Only</span>
                    )}
                  </td>
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

      {/* ➕ ADD NEW EMPLOYEE MODAL */}
      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 480, overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.25)" }}>
            <div style={{ padding: "16px 20px", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>➕ Add New Employee</div>
              <button onClick={() => setShowAddModal(false)} style={{ border: "none", background: "none", fontSize: 18, cursor: "pointer", color: "#64748B" }}>✕</button>
            </div>
            <form onSubmit={handleSaveAdd} style={{ padding: 20 }}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anitha Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>Department:</label>
                <select
                  value={formData.dept}
                  onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
                >
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>Status:</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
                  >
                    <option value="Present">Present</option>
                    <option value="Half Day">Half Day</option>
                    <option value="Absent">Absent</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>Production (units):</label>
                  <input
                    type="number"
                    value={formData.production}
                    onChange={(e) => setFormData({ ...formData, production: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>Joined Date:</label>
                <input
                  type="date"
                  value={formData.joined}
                  onChange={(e) => setFormData({ ...formData, joined: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline" style={{ padding: "8px 16px" }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ padding: "8px 20px", background: "#10B981", border: "none", color: "#fff" }}>Save Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✏️ EDIT / UPDATE EMPLOYEE MODAL */}
      {editEmployee && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 480, overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.25)" }}>
            <div style={{ padding: "16px 20px", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>✏️ Update Employee ({editEmployee.id})</div>
              <button onClick={() => setEditEmployee(null)} style={{ border: "none", background: "none", fontSize: 18, cursor: "pointer", color: "#64748B" }}>✕</button>
            </div>
            <form onSubmit={handleSaveEdit} style={{ padding: 20 }}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>Full Name:</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>Department:</label>
                <select
                  value={formData.dept}
                  onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
                >
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>Status:</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
                  >
                    <option value="Present">Present</option>
                    <option value="Half Day">Half Day</option>
                    <option value="Absent">Absent</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>Production (units):</label>
                  <input
                    type="number"
                    value={formData.production}
                    onChange={(e) => setFormData({ ...formData, production: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>Joined Date:</label>
                <input
                  type="date"
                  value={formData.joined}
                  onChange={(e) => setFormData({ ...formData, joined: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button type="button" onClick={() => setEditEmployee(null)} className="btn btn-outline" style={{ padding: "8px 16px" }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ padding: "8px 20px", background: "#2563EB", border: "none", color: "#fff" }}>Update Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🗑️ REMOVE / DELETE CONFIRMATION MODAL */}
      {deleteConfirmEmp && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 420, overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.25)", padding: 24, textAlign: "center" }}>
            <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#FEF2F2", color: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 16px" }}>⚠️</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Remove Employee?</div>
            <div style={{ fontSize: 13, color: "#64748B", marginBottom: 20 }}>
              Are you sure you want to remove <b>{deleteConfirmEmp.name}</b> ({deleteConfirmEmp.id}) from the active staff database? This action will persist in your database.
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
              <button onClick={() => setDeleteConfirmEmp(null)} className="btn btn-outline" style={{ padding: "8px 18px" }}>Cancel</button>
              <button onClick={handleConfirmRemove} className="btn btn-primary" style={{ padding: "8px 20px", background: "#DC2626", border: "none", color: "#fff", fontWeight: 600 }}>Yes, Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
