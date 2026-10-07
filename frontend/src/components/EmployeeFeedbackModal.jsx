import React, { useState } from "react";
import { useNotifications } from "../context/NotificationContext";
import "./EmployeeFeedbackModal.css";

export default function EmployeeFeedbackModal({ onClose }) {
  const [category, setCategory] = useState("Machinery Maintenance");
  const [priority, setPriority] = useState("Medium");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { push } = useNotifications();

  function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitted(true);

    // Push alert to Admin and Manager
    push(
      "admin",
      `📝 Employee Report: ${category}`,
      `Priority: ${priority} · "${message.slice(0, 50)}..."`
    );
    push(
      "manager",
      `📝 New Employee Feedback`,
      `Report submitted under ${category}. Check Employee Feedback Logs.`
    );
  }

  return (
    <div className="fb-modal-overlay" onClick={onClose}>
      <div className="fb-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="fb-modal-header">
          <div>
            <div className="fb-title">📝 Employee Feedback &amp; Incident Report</div>
            <div className="fb-sub">Report machine breakdown, safety issues, or workplace suggestions</div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {!submitted ? (
          <form className="fb-body" onSubmit={handleSubmit}>
            <label>Report Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="fb-select">
              <option value="Machinery Maintenance">⚙️ Machinery Maintenance &amp; Breakdown</option>
              <option value="Workplace Safety">🛡️ Workplace Safety &amp; Health</option>
              <option value="Raw Material Quality">📦 Raw Material Quality Issue</option>
              <option value="General Suggestion">💡 Workplace Suggestion</option>
            </select>

            <label>Priority Level</label>
            <div className="priority-chips">
              {["Low", "Medium", "High (Urgent)"].map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`p-chip ${priority === p ? "selected" : ""}`}
                  onClick={() => setPriority(p)}
                >
                  {p}
                </button>
              ))}
            </div>

            <label>Report Details &amp; Feedback Description</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe what happened or your suggestion for the factory manager..."
              className="fb-textarea"
            />

            <div className="fb-footer">
              <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">Submit Report →</button>
            </div>
          </form>
        ) : (
          <div className="fb-success-box">
            <div className="fb-s-icon">✅</div>
            <div className="fb-s-title">Report Submitted Successfully!</div>
            <div className="fb-s-sub">Your report has been logged and sent to the Plant Manager &amp; Administrator.</div>
            <button className="btn btn-primary" onClick={onClose} style={{ marginTop: 16 }}>Close Window</button>
          </div>
        )}
      </div>
    </div>
  );
}
