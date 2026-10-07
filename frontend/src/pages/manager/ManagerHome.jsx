import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { useNotifications } from "../../context/NotificationContext";
import WeatherSentinel from "../../components/WeatherSentinel";

const attTone = { Present: "badge-green", "Half Day": "badge-amber", Absent: "badge-red", "On Leave": "badge-blue" };
const taskTone = { Assigned: "badge-blue", "In Progress": "badge-amber", Completed: "badge-green" };

export default function ManagerHome() {
  const { employees, tasks, updateTaskStatus } = useData();
  const { push } = useNotifications();
  const [tab, setTab] = useState("board");

  function taskForEmployee(empId) {
    return tasks.find((t) => t.employeeId === empId && t.status !== "Completed");
  }

  function markDone(task) {
    updateTaskStatus(task.id, "Completed");
    push("admin", "Task completed", `${task.employeeName} finished producing ${task.qty} units of ${task.productName}.`);
    push("employee", "Task marked complete", `Great work! ${task.productName} task has been marked complete by your manager.`);
  }

  return (
    <div>
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--navy)" }}>Employee Work &amp; Weather Operations</h1>
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>See what every employee is working on and monitor rain work-stop alerts</p>
        </div>
        <Link to="/manager/production" className="btn btn-primary" style={{ fontSize: 12.5, padding: "8px 16px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
          ⚙️ Production Overview & Batch Logs →
        </Link>
      </div>

      {/* 🌧️ AI WEATHER SENTINEL & RAIN WORK-STOP CARD */}
      <WeatherSentinel />

      <div style={{ display: "flex", gap: 4, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: 4, width: "fit-content", marginBottom: 20 }}>
        <div onClick={() => setTab("board")} style={{ padding: "9px 20px", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", background: tab === "board" ? "var(--card-bg, #fff)" : "transparent", color: tab === "board" ? "var(--blue)" : "var(--muted)" }}>Work Board</div>
        <div onClick={() => setTab("attendance")} style={{ padding: "9px 20px", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", background: tab === "attendance" ? "var(--card-bg, #fff)" : "transparent", color: tab === "attendance" ? "var(--blue)" : "var(--muted)" }}>Attendance</div>
      </div>

      {tab === "board" ? (
        <div style={{ background: "var(--card-bg, #fff)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead style={{ background: "var(--bg)" }}>
              <tr>
                {["Employee", "Department", "Current Task", "Quantity", "Status", "Action"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "11px 16px", fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => {
                const task = taskForEmployee(e.id);
                return (
                  <tr key={e.id} style={{ borderTop: "1px solid var(--border)" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontWeight: 600, color: "var(--navy)" }}>{e.name}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>{e.id}</div>
                    </td>
                    <td style={{ padding: "12px 16px", color: "var(--text)" }}>{e.dept}</td>
                    <td style={{ padding: "12px 16px", color: task ? "var(--text)" : "var(--muted)" }}>
                      {task ? task.productName : "No task assigned"}
                    </td>
                    <td style={{ padding: "12px 16px", color: "var(--text)" }}>{task ? task.qty.toLocaleString() : "—"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      {task ? <span className={`badge ${taskTone[task.status]}`}>{task.status}</span> : <span className="badge badge-blue" style={{ opacity: 0.5 }}>Idle</span>}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {task && task.status !== "Completed" ? (
                        <button className="btn btn-outline" style={{ fontSize: 11.5, padding: "6px 12px" }} onClick={() => markDone(task)}>Mark Complete</button>
                      ) : (
                        <span style={{ fontSize: 11.5, color: "var(--muted)" }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ background: "var(--card-bg, #fff)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead style={{ background: "var(--bg)" }}>
              <tr>
                {["Employee", "Department", "Status", "Production (units)"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "11px 16px", fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontWeight: 600, color: "var(--navy)" }}>{e.name}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{e.id}</div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--text)" }}>{e.dept}</td>
                  <td style={{ padding: "12px 16px" }}><span className={`badge ${attTone[e.status]}`}>{e.status}</span></td>
                  <td style={{ padding: "12px 16px", fontWeight: 600, color: "var(--navy)" }}>{e.production.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
