import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useNotifications } from "../context/NotificationContext";
import { validatePassword } from "../context/AuthContext";
import { authApi } from "../services/api";
import "./Login.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [dept, setDept] = useState("Rolling Unit");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);

  const { employees, addEmployee } = useData();
  const { push } = useNotifications();
  const navigate = useNavigate();

  const pwCheck = validatePassword(password);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!name.trim()) {
      alert("Please fill in your full name.");
      return;
    }

    if (!pwCheck.isValid) {
      alert("Password must contain at least one Alphabet, one Number, and one Special Character (!@#$...).");
      return;
    }

    const nextNum = 1000 + employees.length + 1;
    const empId = `EMP-${nextNum}`;
    addEmployee({ id: empId, name: name.trim(), dept, status: "Present", production: 0 });

    push("admin", "New employee registered", `${name.trim()} (${empId}) joined ${dept}. Profile is ready.`);
    push("employee", "Welcome to ISE System", `Hi ${name.trim()}, your account is ready. Sign in with ${email} to start.`);

    try {
      await authApi.signup({
        name: name.trim(),
        dept,
        email: email.trim(),
        password
      });
    } catch (err) {
      console.warn("Backend signup sync:", err.message);
    }

    setDone(true);
    setTimeout(() => navigate("/login"), 1800);
  }

  if (done) {
    return (
      <div className="login-page">
        <div className="login-panel" style={{ flex: 1, width: "100%" }}>
          <div className="login-box" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 44, marginBottom: 14 }}>✅</div>
            <h2>Account Created Successfully</h2>
            <p className="sub">Admin and Manager have been notified. Redirecting to sign in…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="brand-panel">
        <div className="brand-top">
          <Link to="/" className="logo">
            <div className="logo-icon">🪔</div>
            <div>
              <div className="name">ISE System</div>
              <div className="tag">INCENSE STICK ENTERPRISE</div>
            </div>
          </Link>
        </div>

        <div className="brand-mid">
          <h1>Join the Enterprise. One registration, complete access.</h1>
          <p>Sign up with your work or personal email address — notification is fired automatically upon registration.</p>
          <div className="role-cards">
            <div className="role-card">
              <div className="ric">🔔</div>
              <div>
                <div className="rt1">Admin & Manager Notified</div>
                <div className="rt2">Your profile joins the live employee roster</div>
              </div>
            </div>
            <div className="role-card">
              <div className="ric">🔐</div>
              <div>
                <div className="rt1">OTP & Password Security</div>
                <div className="rt2">High-security authentication enabled</div>
              </div>
            </div>
          </div>
        </div>

        <div className="brand-foot">© 2026 Incense Stick Enterprise · Account Registration</div>
      </div>

      <div className="login-panel">
        <form className="login-box" onSubmit={handleSubmit}>
          <div className="eyebrow">New Registration</div>
          <h2>Create Your Account</h2>
          <p className="sub">Enter your information below to register</p>

          <label>Full Name</label>
          <div className="input-wrap">
            <span>🙂</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Karpaga Valli" />
          </div>

          <label>Department</label>
          <div className="input-wrap">
            <span>🏭</span>
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              style={{ border: "none", outline: "none", flex: 1, fontSize: 13.5, background: "transparent", color: "var(--navy)" }}
            >
              <option>Rolling Unit</option>
              <option>Drying & Packing</option>
              <option>Quality Check</option>
              <option>Warehouse</option>
            </select>
          </div>

          <label>Work or Personal Email</label>
          <div className="input-wrap">
            <span>✉️</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="yourname@gmail.com" />
          </div>

          <label>Password</label>
          <div className="input-wrap">
            <span>🔒</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Alphabet + Number + Special Char" />
          </div>

          {password.length > 0 && (
            <div className="pw-checklist">
              <span className={`check-tag ${pwCheck.hasAlpha ? "valid" : ""}`}>
                {pwCheck.hasAlpha ? "✓" : "✗"} Alphabet (A-Z, a-z)
              </span>
              <span className={`check-tag ${pwCheck.hasNumber ? "valid" : ""}`}>
                {pwCheck.hasNumber ? "✓" : "✗"} Number (0-9)
              </span>
              <span className={`check-tag ${pwCheck.hasSpecial ? "valid" : ""}`}>
                {pwCheck.hasSpecial ? "✓" : "✗"} Special Char (!@#$...)
              </span>
            </div>
          )}

          <button type="submit" className="btn-login" style={{ marginTop: 22 }} disabled={!pwCheck.isValid}>
            Create Account & Register →
          </button>

          <Link to="/login" className="back-link">
            Already have an account? Sign in
          </Link>
        </form>
      </div>
    </div>
  );
}
