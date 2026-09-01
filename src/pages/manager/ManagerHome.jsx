import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { useNotifications } from "../../context/NotificationContext";

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
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--navy)" }}>Employee Work</h1>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>See what every employee is working on right now</p>
      </div>

      <div style={{ display: "flex", gap: 4, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: 4, width: "fit-content", marginBottom: 20 }}>
        <div onClick={() => setTab("board")} style={{ padding: "9px 20px", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", background: tab === "board" ? "#fff" : "transparent", color: tab === "board" ? "var(--blue)" : "var(--slate)" }}>Work Board</div>
        <div onClick={() => setTab("attendance")} style={{ padding: "9px 20px", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", background: tab === "attendance" ? "#fff" : "transparent", color: tab === "attendance" ? "var(--blue)" : "var(--slate)" }}>Attendance</div>
      </div>

      {tab === "board" ? (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
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
                      <div style={{ fontWeight: 600, color: "var(--text)" }}>{e.name}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>{e.id}</div>
                    </td>
                    <td style={{ padding: "12px 16px", color: "var(--slate)" }}>{e.dept}</td>
                    <td style={{ padding: "12px 16px", color: task ? "var(--text)" : "var(--muted)" }}>
                      {task ? task.productName : "No task assigned"}
                    </td>
                    <td style={{ padding: "12px 16px", color: "var(--slate)" }}>{task ? task.qty.toLocaleString() : "—"}</td>
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
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
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
                    <div style={{ fontWeight: 600, color: "var(--text)" }}>{e.name}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{e.id}</div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--slate)" }}>{e.dept}</td>
                  <td style={{ padding: "12px 16px" }}><span className={`badge ${attTone[e.status]}`}>{e.status}</span></td>
                  <td style={{ padding: "12px 16px", fontWeight: 600, color: "var(--text)" }}>{e.production.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
