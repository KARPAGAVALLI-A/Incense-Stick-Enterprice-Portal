import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";

const statusTone = { Present: "badge-green", "Half Day": "badge-amber", Absent: "badge-red", "On Leave": "badge-blue" };

export default function EmployeeDetail() {
  const { id } = useParams(); // useParams: reads the ":id" segment from the URL, e.g. /admin/employees/EMP-01
  const navigate = useNavigate(); // useNavigate: lets us send the user back programmatically
  const { employees } = useData();

  const employee = employees.find((e) => e.id === id);

  if (!employee) {
    return (
      <div>
        <p style={{ color: "var(--muted)" }}>No employee found for ID "{id}".</p>
        <button className="btn btn-outline" onClick={() => navigate("/admin/employees")}>← Back to Employees</button>
      </div>
    );
  }

  return (
    <div>
      <button className="btn btn-outline" style={{ marginBottom: 16 }} onClick={() => navigate(-1)}>← Back</button>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: 24, maxWidth: 480 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "var(--navy)" }}>{employee.name}</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>{employee.id}</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <div style={{ fontSize: 10.5, color: "var(--muted)", textTransform: "uppercase", fontWeight: 600 }}>Department</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{employee.dept}</div>
          </div>
          <div>
            <div style={{ fontSize: 10.5, color: "var(--muted)", textTransform: "uppercase", fontWeight: 600 }}>Status</div>
            <span className={`badge ${statusTone[employee.status] || "badge-blue"}`}>{employee.status}</span>
          </div>
          <div>
            <div style={{ fontSize: 10.5, color: "var(--muted)", textTransform: "uppercase", fontWeight: 600 }}>Production (units)</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{employee.production.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
