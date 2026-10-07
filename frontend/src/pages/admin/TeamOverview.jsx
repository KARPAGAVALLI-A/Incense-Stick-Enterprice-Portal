import React from "react";
import { useData } from "../../context/DataContext";

const taskTone = { Assigned: "badge-blue", "In Progress": "badge-amber", Completed: "badge-green" };
const attTone = { Present: "badge-green", "Half Day": "badge-amber", Absent: "badge-red", "On Leave": "badge-blue" };

export default function TeamOverview() {
  const { employees, tasks } = useData();

  // Group employees by their manager
  const byManager = employees.reduce((acc, e) => {
    const mgr = e.manager || "Unassigned";
    if (!acc[mgr]) acc[mgr] = [];
    acc[mgr].push(e);
    return acc;
  }, {});

  function taskForEmployee(empId) {
    return tasks.find((t) => t.employeeId === empId && t.status !== "Completed");
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--navy)" }}>Team Overview</h1>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>Who reports to which manager, and what they're producing right now</p>
      </div>

      {Object.entries(byManager).map(([manager, list]) => (
        <div key={manager} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", marginBottom: 20 }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", background: "linear-gradient(135deg,#F8FAFC,#fff)", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--blue)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>
              {manager.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--navy)" }}>{manager}</div>
              <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{list.length} employees reporting</div>
            </div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead style={{ background: "var(--bg)" }}>
              <tr>
                {["Employee", "Department", "Attendance", "Current Production Task", "Task Status"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 20px", fontSize: 10.5, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((e) => {
                const task = taskForEmployee(e.id);
                return (
                  <tr key={e.id} style={{ borderTop: "1px solid var(--border)" }}>
                    <td style={{ padding: "11px 20px" }}>
                      <div style={{ fontWeight: 600, color: "var(--text)" }}>{e.name}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>{e.id}</div>
                    </td>
                    <td style={{ padding: "11px 20px", color: "var(--slate)" }}>{e.dept}</td>
                    <td style={{ padding: "11px 20px" }}><span className={`badge ${attTone[e.status]}`}>{e.status}</span></td>
                    <td style={{ padding: "11px 20px", color: task ? "var(--text)" : "var(--muted)" }}>
                      {task ? `${task.productName} · ${task.qty.toLocaleString()} units` : "No task assigned"}
                    </td>
                    <td style={{ padding: "11px 20px" }}>
                      {task ? <span className={`badge ${taskTone[task.status]}`}>{task.status}</span> : <span style={{ fontSize: 11.5, color: "var(--muted)" }}>—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
