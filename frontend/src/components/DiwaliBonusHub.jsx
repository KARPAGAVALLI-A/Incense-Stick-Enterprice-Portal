import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { useNotifications } from "../context/NotificationContext";
import "./DiwaliBonusHub.css";

export default function DiwaliBonusHub() {
  const { employees } = useData();
  const { push } = useNotifications();

  const [activeVoucherEmp, setActiveVoucherEmp] = useState(null);
  const [issuedBonus, setIssuedBonus] = useState({});

  function handleIssueBonus(emp) {
    setIssuedBonus((prev) => ({ ...prev, [emp.id]: true }));

    push(
      "employee",
      "🎆 Happy Diwali! Festival Bonus Issued",
      `Dear ${emp.name}, your Diwali Gift Pack (1kg Sweet Box + Incense Packet + Pattasu Box) and ₹8,500 Cash Bonus voucher is ready!`
    );
  }

  return (
    <div className="diwali-bonus-card">
      {/* Banner */}
      <div className="diwali-banner">
        <div className="db-left">
          <div className="db-badge">🪔 FESTIVAL CELEBRATION 2026</div>
          <h2 className="db-title">🎆 Diwali Employee Bonus &amp; Gift Bundle Setup</h2>
          <p className="db-sub">
            Festive bonus distribution package for all ISE plant workers &amp; staff.
          </p>
        </div>
        <div className="db-diya-icon">🪔✨</div>
      </div>

      {/* Gift Package Contents Summary */}
      <div className="gift-package-grid">
        <div className="g-box">
          <div className="g-icon">🍬</div>
          <div>
            <div className="g-title">1 kg Assorted Sweet Box</div>
            <div className="g-sub">Traditional Milk Sweets &amp; Laddu Pack</div>
          </div>
        </div>

        <div className="g-box">
          <div className="g-icon">🪔</div>
          <div>
            <div className="g-title">ISE Agarbatti Bundle</div>
            <div className="g-sub">5 Premium Fragrance Packets</div>
          </div>
        </div>

        <div className="g-box">
          <div className="g-icon">🎆</div>
          <div>
            <div className="g-title">Diwali Crackers Pack</div>
            <div className="g-sub">Pattasu Gift Box (Sparklers &amp; Flowerpots)</div>
          </div>
        </div>

        <div className="g-box">
          <div className="g-icon">💰</div>
          <div>
            <div className="g-title">₹8,500 Cash Bonus</div>
            <div className="g-sub">Calculated based on annual production output</div>
          </div>
        </div>
      </div>

      {/* Employee Festival Bonus Distribution Table */}
      <div style={{ background: "var(--card-bg, #fff)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", marginTop: 20 }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", background: "var(--bg)", fontWeight: 700, color: "var(--navy)", fontSize: 14 }}>
          👷 Employee Bonus Allocation &amp; Voucher Issuance
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead style={{ background: "var(--bg)" }}>
            <tr>
              {["Employee", "Department", "Diwali Gift Pack", "Cash Bonus", "Status & Action"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "11px 16px", fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((e) => {
              const isIssued = issuedBonus[e.id];
              return (
                <tr key={e.id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontWeight: 700, color: "var(--navy)" }}>{e.name}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{e.id}</div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--text)" }}>{e.dept}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12 }}>
                    🍬 Sweet Box + 🪔 Incense Bundle + 🎆 Pattasu Box
                  </td>
                  <td style={{ padding: "12px 16px", fontWeight: 700, color: "#10B981" }}>
                    ₹8,500
                  </td>
                  <td style={{ padding: "12px 16px", display: "flex", gap: 8, alignItems: "center" }}>
                    {!isIssued ? (
                      <button
                        className="btn btn-primary"
                        style={{ fontSize: 11.5, padding: "5px 12px" }}
                        onClick={() => handleIssueBonus(e)}
                      >
                        🎁 Issue Bonus
                      </button>
                    ) : (
                      <span className="badge badge-green" style={{ fontSize: 11 }}>✅ Bonus Issued</span>
                    )}

                    <button
                      className="btn btn-outline"
                      style={{ fontSize: 11.5, padding: "5px 10px" }}
                      onClick={() => setActiveVoucherEmp(e)}
                    >
                      🎟️ Voucher Slip
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Printable Voucher Modal */}
      {activeVoucherEmp && (
        <div className="voucher-modal-overlay" onClick={() => setActiveVoucherEmp(null)}>
          <div className="voucher-card-box" onClick={(e) => e.stopPropagation()}>
            <div className="v-header">
              <span className="v-logo">🪔 ISE ENTERPRISE</span>
              <button className="close-btn" onClick={() => setActiveVoucherEmp(null)}>✕</button>
            </div>

            <div className="v-title">🎆 DIWALI FESTIVAL BONUS VOUCHER 2026</div>

            <div className="v-emp-info">
              <div>Employee Name: <b>{activeVoucherEmp.name}</b> ({activeVoucherEmp.id})</div>
              <div>Department: <b>{activeVoucherEmp.dept}</b></div>
            </div>

            <div className="v-gift-list">
              <div className="v-item">🍬 1 kg Premium Sweet Box</div>
              <div className="v-item">🪔 5-Packet Agarbatti Bundle</div>
              <div className="v-item">🎆 Diwali Crackers Gift Pack (Pattasu Box)</div>
              <div className="v-item cash">💰 Cash Bonus: <b>₹8,500</b></div>
            </div>

            <div className="v-footer">
              <div className="v-sig">Authorized Signature: <i>Incense Stick Enterprise HR</i></div>
              <button className="btn btn-primary" onClick={() => alert("Voucher sent to printer!")}>
                🖨️ Print Festival Voucher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
