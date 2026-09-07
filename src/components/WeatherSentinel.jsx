import React, { useState } from "react";
import { useNotifications } from "../context/NotificationContext";
import { useSettings } from "../context/SettingsContext";
import "./WeatherSentinel.css";

// Outdoor workers affected during rain (Drying Unit)
const AFFECTED_EMPLOYEES = [
  { id: "EMP-1042", name: "Muthu Selvam", phone: "+91 98402 11920", originalTask: "Outdoor Sun-Drying Unit A", altTask: "Indoor Box Packaging" },
  { id: "EMP-1043", name: "Deepa Lakshmi", phone: "+91 98402 11921", originalTask: "Outdoor Sun-Drying Unit B", altTask: "Quality Check & Sealing" },
  { id: "EMP-1044", name: "Karthik M", phone: "+91 98402 11922", originalTask: "Bamboo Stick Tray Drying", altTask: "Sambrani Cup Moulding" }
];

export default function WeatherSentinel() {
  const [isRaining, setIsRaining] = useState(true); // Default active rain downpour alert
  const [smsSent, setSmsSent] = useState(false);
  const [sentSmsLogs, setSentSmsLogs] = useState([]);

  const { push } = useNotifications();
  const { t } = useSettings();

  // Send automated SMS intimations to employees
  function handleDispatchSms() {
    const logs = AFFECTED_EMPLOYEES.map((emp) => ({
      empId: emp.id,
      name: emp.name,
      phone: emp.phone,
      message: `[SMS Sent to ${emp.phone}]: 🌧️ HEAVY RAIN ALERT! Outdoor drying halted. Please report to ${emp.altTask} immediately.`
    }));

    setSentSmsLogs(logs);
    setSmsSent(true);

    // Push notification to Manager console
    push(
      "admin",
      "🌧️ Rain Work-Stop & SMS Dispatched",
      `Automated SMS alerts sent to ${AFFECTED_EMPLOYEES.length} outdoor drying staff. Work shifted to indoor packaging & QC.`
    );
    push(
      "employee",
      "🌧️ Rain Alert: Task Reassigned",
      `Heavy rain detected! Outdoor sun-drying paused. Please report to your assigned indoor unit.`
    );
  }

  return (
    <div className={`weather-sentinel-card ${isRaining ? "rain-active" : ""}`}>
      {/* Top Status Bar */}
      <div className="weather-header">
        <div className="weather-brand">
          <span className="weather-icon">{isRaining ? "🌧️" : "☀️"}</span>
          <div>
            <div className="w-title">AI Weather Sentinel &amp; Rain Intimation</div>
            <div className="w-sub">Salem Production Plant · Sensor Node #04</div>
          </div>
        </div>

        <div className="weather-toggle-wrap">
          <button
            className={`w-toggle-btn ${isRaining ? "active" : ""}`}
            onClick={() => {
              setIsRaining(!isRaining);
              setSmsSent(false);
            }}
          >
            {isRaining ? "🌧️ Rain Downpour Alert (ACTIVE)" : "☀️ Clear Weather (Simulate Rain)"}
          </button>
        </div>
      </div>

      {/* Weather Metrics Strip */}
      <div className="weather-metrics-strip">
        <div className="wm-box">
          <span className="lbl">Rain Probability:</span>
          <span className="val red">{isRaining ? "88% (Downpour Warning)" : "12% (Low)"}</span>
        </div>
        <div className="wm-box">
          <span className="lbl">Humidity Level:</span>
          <span className="val">{isRaining ? "92% (High)" : "45% (Normal)"}</span>
        </div>
        <div className="wm-box">
          <span className="lbl">Affected Unit:</span>
          <span className="val navy">{isRaining ? "Outdoor Sun-Drying Unit" : "None"}</span>
        </div>
      </div>

      {/* RAIN ALERT & WORK-STOP INTIMATION PANEL */}
      {isRaining && (
        <div className="rain-alert-body">
          <div className="work-stop-banner">
            <div className="ws-icon">🛑</div>
            <div>
              <div className="ws-title">WORK STOP INTIMATION FOR MANAGER</div>
              <div className="ws-sub">
                Outdoor incense stick sun-drying halted to prevent rain water damage to unbaked sticks.
              </div>
            </div>
          </div>

          {/* Affected Employees & Alternative Task Re-assignment List */}
          <div className="affected-section">
            <div className="sec-title">👷 Affected Employees &amp; Alternative Task Shift</div>
            <div className="emp-shift-grid">
              {AFFECTED_EMPLOYEES.map((emp) => (
                <div key={emp.id} className="shift-card">
                  <div className="sc-header">
                    <span className="emp-name">👤 {emp.name} ({emp.id})</span>
                    <span className="emp-phone">📞 {emp.phone}</span>
                  </div>
                  <div className="sc-tasks">
                    <span className="task-from">🔴 {emp.originalTask}</span>
                    <span className="arrow">➔</span>
                    <span className="task-to">🟢 Shift to: <b>{emp.altTask}</b></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SMS Dispatch Trigger */}
          <div className="sms-action-bar">
            {!smsSent ? (
              <button className="btn-dispatch-sms" onClick={handleDispatchSms}>
                📲 Dispatch Automated SMS Alerts to Affected Workers ({AFFECTED_EMPLOYEES.length}) →
              </button>
            ) : (
              <div className="sms-success-box">
                <div className="sms-badge">✅ Automated SMS Alerts Dispatched Successfully!</div>
                <div className="sms-logs-list">
                  {sentSmsLogs.map((log, i) => (
                    <div key={i} className="sms-log-item">
                      📲 <b>{log.name}</b> ({log.phone}): <i>"{log.message}"</i>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
