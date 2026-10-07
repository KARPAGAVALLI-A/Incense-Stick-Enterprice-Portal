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
  const [dayState, setDayState] = useState("present"); // default marked present for smooth demo
  const [firstScanTime, setFirstScanTime] = useState("09:02 AM");
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

  const myTasks = tasks.filter((t) => t.employeeId === MY_EMP_ID || t.employeeName === (name || "Muthu Selvam"));

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
        {/* TOP APP HEADER */}
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
              <button className="logout-icon" title="Logout" onClick={handleLogout}>↩</button>
            </div>
          </div>
          <div className="greet">
            <div className="hello">Vanakkam,</div>
            <div className="ename">{name || "Muthu Selvam"}</div>
            <div className="emeta">EMP-1042 · Rolling Unit Specialist</div>
          </div>
          <div className="date-pill">📅 Monday, 18 August 2026</div>
        </div>

        {/* MAIN CONTAINER CONTENT SWITCHER */}
        <div className="body">
          <div className="unit-strip">
            <div className="loc-icon">🏬</div>
            <div className="loc-info">
              <div className="loc-name">Salem Unit A</div>
              <div className="loc-sub">Your work location · Shift: 09:00 AM - 05:00 PM</div>
            </div>
            <span className="badge-fixed">📍 Active Shift</span>
          </div>

          {/* Quick Feedback Button */}
          <button
            className="btn-submit"
            style={{ marginBottom: 16, background: "var(--navy)", padding: "10px 0" }}
            onClick={() => setShowFeedbackModal(true)}
          >
            📝 Report Issue / Employee Feedback
          </button>

          {/* 1. HOME TAB VIEW */}
          {view === "home" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="section-label">Shift &amp; Status Overview</div>
              
              <div style={{ background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 14, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0369A1" }}>Today's Attendance Status</span>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 99, background: dayState === "present" ? "#DCFCE7" : "#FEE2E2", color: dayState === "present" ? "#15803D" : "#B91C1C" }}>
                    {dayState === "present" ? "✅ PRESENT" : dayState === "absent" ? "🚫 ABSENT" : "⏳ NOT MARKED"}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "#0284C7" }}>
                  {dayState === "present"
                    ? `Scanned at ${firstScanTime} via Biometrics. Shift hours on track.`
                    : dayState === "absent"
                    ? `Marked absent at ${secondScanTime}.`
                    : "Please switch to Attendance tab to mark your attendance."}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ background: "#FFF", border: "1px solid var(--border)", borderRadius: 12, padding: 14, textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "var(--navy)" }}>{myTasks.length}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, marginTop: 2 }}>Assigned Tasks</div>
                </div>
                <div style={{ background: "#FFF", border: "1px solid var(--border)", borderRadius: 12, padding: 14, textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "var(--green)" }}>
                    {myTasks.filter(t => t.status === "Completed").length}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, marginTop: 2 }}>Completed Today</div>
                </div>
              </div>

              <div className="section-label" style={{ marginTop: 8 }}>Today's Factory Announcement</div>
              <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: 14, fontSize: 12, color: "#92400E", lineHeight: 1.5 }}>
                📢 <b>Salem Unit Notice:</b> Mysuru Sandal Agarbatti production target increased by 10% for the afternoon batch. Safety goggles mandatory at raw mix section.
              </div>
            </div>
          )}

          {/* 2. ATTENDANCE TAB VIEW */}
          {view === "attendance" && (
            <div>
              <div className="section-label">Biometric Attendance Portal</div>
              {dayState === "absent" ? (
                <div className="success-box">
                  <div className="success-icon">🚫</div>
                  <div className="success-title">Today's Attendance: Absent</div>
                  <div className="success-sub">
                    First scan at <b>{firstScanTime}</b> marked Present. Second scan at <b>{secondScanTime}</b> updated to Absent.
                  </div>
                </div>
              ) : (
                <>
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

                  <div className="prev-log">
                    <div className="section-label">Recent Attendance Log</div>
                    <div className="log-row">
                      <div className="log-dot green" />
                      <div className="log-date">Monday, 18 Aug</div>
                      <div className="log-method">Fingerprint · 09:02 AM</div>
                      <div className="log-status p">Present</div>
                    </div>
                    <div className="log-row">
                      <div className="log-dot green" />
                      <div className="log-date">Saturday, 16 Aug</div>
                      <div className="log-method">Face ID · 08:58 AM</div>
                      <div className="log-status p">Present</div>
                    </div>
                    <div className="log-row">
                      <div className="log-dot green" />
                      <div className="log-date">Friday, 15 Aug</div>
                      <div className="log-method">Fingerprint · 09:05 AM</div>
                      <div className="log-status p">Present</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* 3. MY TASKS TAB VIEW */}
          {view === "tasks" && (
            <>
              <div className="section-label">My Assigned Tasks ({myTasks.length})</div>
              {myTasks.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px 10px", color: "var(--muted)", fontSize: 13 }}>
                  No tasks assigned right now.
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {myTasks.map((t) => (
                  <div key={t.id} style={{ border: "1px solid var(--border)", borderRadius: 14, padding: 16, background: "#fff" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13.5, color: "var(--text)" }}>{t.productName}</div>
                        <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2 }}>Assigned by {t.assignedBy} · {t.assignedDate}</div>
                      </div>
                      <span className={`badge ${taskTone[t.status] || "badge-blue"}`}>{t.status}</span>
                    </div>
                    <div style={{ fontSize: 12.5, color: "var(--slate)", marginBottom: 12 }}>
                      Produce <b>{t.qty ? t.qty.toLocaleString() : 5000} units</b>{t.note ? ` — ${t.note}` : ""}
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
          )}

          {/* 4. PROFILE TAB VIEW */}
          {view === "profile" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="section-label">My Profile &amp; ID Details</div>

              <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 16, padding: 18, textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--blue)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", fontSize: 24, fontWeight: 700 }}>
                  MS
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--navy)" }}>{name || "Muthu Selvam"}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Rolling Unit Specialist · Grade 4</div>
                <div style={{ display: "inline-block", background: "#EFF6FF", color: "#1D4ED8", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 99, marginTop: 8 }}>
                  EMP ID: EMP-1042
                </div>
              </div>

              <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: 14, fontSize: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--muted)" }}>Factory Unit</span>
                  <span style={{ fontWeight: 600, color: "var(--text)" }}>Salem Factory (Unit A)</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--muted)" }}>Contact Phone</span>
                  <span style={{ fontWeight: 600, color: "var(--text)" }}>+91 98421 88301</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--muted)" }}>Shift Timings</span>
                  <span style={{ fontWeight: 600, color: "var(--text)" }}>09:00 AM - 05:00 PM</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--muted)" }}>Monthly Target Achieved</span>
                  <span style={{ fontWeight: 700, color: "#059669" }}>98.4% (142,500 Units)</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                  <span style={{ color: "var(--muted)" }}>Emergency Contact</span>
                  <span style={{ fontWeight: 600, color: "var(--text)" }}>Selvi S (Wife)</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                style={{ width: "100%", padding: "12px 0", border: "1px solid #FCA5A5", background: "#FEF2F2", color: "#DC2626", borderRadius: 12, fontWeight: 700, cursor: "pointer", marginTop: 4 }}
              >
                🚪 Log Out of Employee App
              </button>
            </div>
          )}
        </div>

        {/* BOTTOM NAVIGATION TABS */}
        <div className="bottom-nav">
          <div className={`bn-item ${view === "home" ? "active" : ""}`} onClick={() => setView("home")}>
            <span className="bi">🏠</span>Home
          </div>
          <div className={`bn-item ${view === "attendance" ? "active" : ""}`} onClick={() => setView("attendance")}>
            <span className="bi">📅</span>Attendance
          </div>
          <div className={`bn-item ${view === "tasks" ? "active" : ""}`} onClick={() => setView("tasks")}>
            <span className="bi">📦</span>My Tasks
          </div>
          <div className={`bn-item ${view === "profile" ? "active" : ""}`} onClick={() => setView("profile")}>
            <span className="bi">👤</span>Profile
          </div>
        </div>
      </div>

      {/* Employee Feedback Modal */}
      {showFeedbackModal && (
        <EmployeeFeedbackModal onClose={() => setShowFeedbackModal(false)} />
      )}

      {/* Floating AI Chatbot Widget */}
      <AiChatbot />
    </div>
  );
}
