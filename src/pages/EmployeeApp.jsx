import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { useNotifications } from "../context/NotificationContext";
import NotificationBell from "../components/NotificationBell";
import AiChatbot from "../components/AiChatbot";
import EmployeeFeedbackModal from "../components/EmployeeFeedbackModal";
import "./EmployeeApp.css";

const MY_EMP_ID = "EMP-1042"; // demo employee identity
const taskTone = { Assigned: "badge-blue", "In Progress": "badge-amber", Completed: "badge-green" };
function timeNow() {
  return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

export default function EmployeeApp() {
  const { role, name, logout } = useAuth();
  const { tasks, updateTaskStatus } = useData();
  const { push } = useNotifications();
  const navigate = useNavigate();
  const [view, setView] = useState("home");
  const [method, setMethod] = useState("finger");
  const [scanState, setScanState] = useState("idle");
  const [dayState, setDayState] = useState("idle");
  const [firstScanTime, setFirstScanTime] = useState(null);
  const [secondScanTime, setSecondScanTime] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    if (!role) navigate("/login");
  }, [role, navigate]);

  function startScan() {
    if (scanState === "scanning" || dayState === "absent") return;
    setScanState("scanning");
    setTimeout(() => {
      setScanState("done");
      if (dayState === "idle") {
        markPresent();
      } else if (dayState === "present") {
        markAbsent();
      }
      setTimeout(() => setScanState("idle"), 900);
    }, 1400);
  }

  function markPresent() {
    const t = timeNow();
    setFirstScanTime(t);
    setDayState("present");
    push("employee", "Marked Present", `Scanned at ${t} via ${method === "finger" ? "Fingerprint" : "Face ID"} — marked Present.`);
    push("admin", "Employee marked Present", `${name || "Muthu Selvam"} scanned in at ${t} — marked Present.`);
  }

  function markAbsent() {
    const t = timeNow();
    setSecondScanTime(t);
    setDayState("absent");
    push("employee", "Marked Absent", `Second scan recorded at ${t} — updated to Absent.`);
    push("admin", "Employee marked Absent", `${name || "Muthu Selvam"} scanned again at ${t} — updated to Absent.`);
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const myTasks = tasks.filter((t) => t.employeeId === MY_EMP_ID);

  function startTask(task) {
    updateTaskStatus(task.id, "In Progress");
    push("admin", "Task started", `${name || "Employee"} started working on ${task.productName}.`);
  }

  function completeTask(task) {
    updateTaskStatus(task.id, "Completed");
    push("admin", "Task completed", `${name || "Employee"} finished producing ${task.qty} units of ${task.productName}.`);
  }

  return (
    <div className="emp-page">
      <div className="phone">
        <div className="header">
          <div className="header-top">
            <div className="brand">
              <div className="logo-icon">🪔</div>
              <div>
                <div className="name">ISE System</div>
                <div className="tag">EMPLOYEE APP</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <NotificationBell audience="employee" />
              <button className="logout-icon" onClick={handleLogout}>↩</button>
            </div>
          </div>
          <div className="greet">
            <div className="hello">Vanakkam,</div>
            <div className="ename">{name || "Muthu Selvam"}</div>
            <div className="emeta">EMP-1042 · Rolling Unit</div>
          </div>
          <div className="date-pill">📅 Monday, 18 August 2026</div>
        </div>

        <div className="body">
          <div className="unit-strip">
            <div className="loc-icon">🏬</div>
            <div className="loc-info">
              <div className="loc-name">Salem Unit</div>
              <div className="loc-sub">Your work location · fixed</div>
            </div>
            <span className="badge-fixed">📍 Registered Unit</span>
          </div>

          {/* Employee Feedback & Report Issue Button */}
          <button
            className="btn-submit"
            style={{ marginBottom: 16, background: "var(--navy)", padding: "10px 0" }}
            onClick={() => setShowFeedbackModal(true)}
          >
            📝 Report Issue / Employee Feedback
          </button>

          {view === "tasks" ? (
            <>
              <div className="section-label">My Assigned Tasks</div>
              {myTasks.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px 10px", color: "var(--muted)", fontSize: 13 }}>
                  No tasks assigned right now.
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {myTasks.map((t) => (
                  <div key={t.id} style={{ border: "1px solid var(--border)", borderRadius: 14, padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13.5, color: "var(--text)" }}>{t.productName}</div>
                        <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2 }}>Assigned by {t.assignedBy} · {t.assignedDate}</div>
                      </div>
                      <span className={`badge ${taskTone[t.status]}`}>{t.status}</span>
                    </div>
                    <div style={{ fontSize: 12.5, color: "var(--slate)", marginBottom: 12 }}>
                      Produce <b>{t.qty.toLocaleString()} units</b>{t.note ? ` — ${t.note}` : ""}
                    </div>
                    {t.status === "Assigned" && (
                      <button className="btn-submit" style={{ padding: "10px 0" }} onClick={() => startTask(t)}>▶ Start Task</button>
                    )}
                    {t.status === "In Progress" && (
                      <button className="btn-submit" style={{ padding: "10px 0" }} onClick={() => completeTask(t)}>✅ Mark Complete</button>
                    )}
                    {t.status === "Completed" && (
                      <div style={{ textAlign: "center", fontSize: 12, color: "#059669", fontWeight: 600 }}>✅ Completed</div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : dayState === "absent" ? (
            <div className="success-box">
              <div className="success-icon">🚫</div>
              <div className="success-title">Today's Attendance: Absent</div>
              <div className="success-sub">
                First scan at <b>{firstScanTime}</b> marked Present. Second scan at <b>{secondScanTime}</b> updated to Absent.
              </div>
            </div>
          ) : (
            <>
              <div className="section-label">
                {dayState === "idle" ? "Scan To Mark Present" : "Scan Again To Mark Absent"}
              </div>
              <div className={`verify-card ${dayState === "present" ? "done" : ""}`}>
                <div className="bio-tabs">
                  <div className={`bio-tab ${method === "finger" ? "active" : ""}`} onClick={() => setMethod("finger")}>👆 Fingerprint</div>
                  <div className={`bio-tab ${method === "face" ? "active" : ""}`} onClick={() => setMethod("face")}>🙂 Face ID</div>
                </div>
                <div className={`scan-zone ${scanState}`} onClick={startScan}>
                  {scanState === "scanning" ? "⏳" : dayState === "present" ? "✅" : method === "finger" ? "👆" : "🙂"}
                </div>
                <div className="verify-title">
                  {scanState === "scanning" ? "Scanning… hold still" : dayState === "idle" ? "Tap to scan and mark Present" : "Tap again to mark Absent"}
                </div>
                <div className={`verify-sub ${dayState === "present" ? "ok" : ""}`}>
                  {dayState === "idle"
                    ? "First scan of the day marks Present automatically"
                    : `Marked Present at ${firstScanTime}`}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="bottom-nav">
          <div className={`bn-item ${view === "home" ? "active" : ""}`} onClick={() => setView("home")}><span className="bi">🏠</span>Home</div>
          <div className={`bn-item ${view === "home" ? "active" : ""}`} onClick={() => setView("home")}><span className="bi">📅</span>Attendance</div>
          <div className={`bn-item ${view === "tasks" ? "active" : ""}`} onClick={() => setView("tasks")}>
            <span className="bi">📦</span>My Tasks
          </div>
          <div className="bn-item"><span className="bi">👤</span>Profile</div>
        </div>
      </div>

      {/* Employee Feedback & Incident Report System Modal */}
      {showFeedbackModal && (
        <EmployeeFeedbackModal onClose={() => setShowFeedbackModal(false)} />
      )}

      {/* Floating AI Chatbot Widget */}
      <AiChatbot />
    </div>
  );
}
