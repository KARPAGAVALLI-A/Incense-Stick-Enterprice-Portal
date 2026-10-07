import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { PAST_EMPLOYEES } from "../../data/mockData";

const statusTone = {
  Present: "badge-green",
  "Half Day": "badge-amber",
  Absent: "badge-red",
  "On Leave": "badge-blue"
};

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employees } = useData();

  // Look in active employees first, then past employees
  const employee = employees.find((e) => e.id === id || e._id === id || String(e.id).toLowerCase() === String(id).toLowerCase())
    || PAST_EMPLOYEES.find((e) => e.id === id || String(e.id).toLowerCase() === String(id).toLowerCase());

  if (!employee) {
    return (
      <div style={{ padding: "32px 16px", maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--navy)", marginBottom: 8 }}>Employee Not Found</h3>
        <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 20 }}>
          No staff record found matching ID "{id}".
        </p>
        <button className="btn btn-primary" onClick={() => navigate("/admin/employees")}>
          ← Back to Employees Directory
        </button>
      </div>
    );
  }

  const initials = employee.name
    ? employee.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "EM";

  const prod = employee.production || 0;
  const target = 5000;
  const pct = Math.min(100, Math.round((prod / target) * 100));

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", paddingBottom: 40 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <button
          className="btn btn-outline"
          onClick={() => navigate("/admin/employees")}
          style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          ← Back to All Staff
        </button>
        <span style={{ fontSize: 12, color: "var(--muted)" }}>
          Directory &gt; {employee.dept} &gt; {employee.id}
        </span>
      </div>

      <div style={{
        background: "var(--card-bg, #fff)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        overflow: "hidden"
      }}>
        {/* Banner Header */}
        <div style={{
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
          padding: "28px 24px",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap"
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "#fff",
            color: "#4f46e5",
            fontSize: 22,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 14px rgba(0,0,0,0.15)"
          }}>
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{employee.name}</h2>
              <span style={{
                background: "rgba(255,255,255,0.2)",
                padding: "3px 10px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600
              }}>
                {employee.id}
              </span>
            </div>
            <p style={{ margin: "4px 0 0 0", opacity: 0.9, fontSize: 13 }}>
              {employee.dept} · Salem Production Unit
            </p>
          </div>
          <div>
            <span className={`badge ${statusTone[employee.status] || "badge-blue"}`} style={{ fontSize: 13, padding: "6px 14px" }}>
              ● {employee.status || "Active"}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: 24 }}>
          {/* Production Progress Bar */}
          <div style={{
            background: "var(--bg, #f8fafc)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 16,
            marginBottom: 20
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--navy)", textTransform: "uppercase" }}>
                🎯 Today's Production Output
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--navy)" }}>
                {prod.toLocaleString()} / {target.toLocaleString()} units ({pct}%)
              </span>
            </div>
            <div style={{ width: "100%", height: 8, background: "#e2e8f0", borderRadius: 4, overflow: "hidden" }}>
              <div style={{
                width: `${pct}%`,
                height: "100%",
                background: pct >= 80 ? "#10B981" : pct >= 50 ? "#3B82F6" : "#F59E0B",
                borderRadius: 4,
                transition: "width 0.4s ease"
              }} />
            </div>
          </div>

          {/* Details Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <div style={{ background: "var(--bg, #f8fafc)", padding: 14, borderRadius: 10, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", fontWeight: 600 }}>Department</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginTop: 4 }}>{employee.dept}</div>
            </div>

            <div style={{ background: "var(--bg, #f8fafc)", padding: 14, borderRadius: 10, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", fontWeight: 600 }}>Attendance Status</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginTop: 4 }}>{employee.status}</div>
            </div>

            <div style={{ background: "var(--bg, #f8fafc)", padding: 14, borderRadius: 10, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", fontWeight: 600 }}>Daily Production</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#10B981", marginTop: 4 }}>{prod.toLocaleString()} Units</div>
            </div>

            <div style={{ background: "var(--bg, #f8fafc)", padding: 14, borderRadius: 10, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", fontWeight: 600 }}>Date of Joining</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginTop: 4 }}>{employee.joined || "15 Mar 2021"}</div>
            </div>

            <div style={{ background: "var(--bg, #f8fafc)", padding: 14, borderRadius: 10, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", fontWeight: 600 }}>Monthly Remuneration</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--navy)", marginTop: 4 }}>₹{(employee.salary || 18000).toLocaleString()}</div>
            </div>

            <div style={{ background: "var(--bg, #f8fafc)", padding: 14, borderRadius: 10, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", fontWeight: 600 }}>Shift &amp; Plant</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginTop: 4 }}>Morning Shift (Salem A)</div>
            </div>
          </div>

          {/* Action Footer */}
          <div style={{ marginTop: 24, display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Link to={`/admin/employees?search=${encodeURIComponent(employee.name)}`} className="btn btn-outline" style={{ fontSize: 12.5 }}>
              🔍 View in Employees Table
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
