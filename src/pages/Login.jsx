import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import IseLogoSvg from "../components/IseLogoSvg";
import "./Login.css";

const ROLE_ROUTE = { admin: "/admin", manager: "/manager", employee: "/employee" };

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  // OTP Verification State
  const [step, setStep] = useState(1);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(60);
  const [otpError, setOtpError] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  const { login, validatePassword } = useAuth();
  const { t } = useSettings();
  const navigate = useNavigate();
  const otpRefs = useRef([]);

  const pwCheck = validatePassword(password);

  useEffect(() => {
    let timer;
    if (step === 2 && otpTimer > 0) {
      timer = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, otpTimer]);

  function handleSendOtp(e) {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!pwCheck.isValid) {
      alert("Password must contain at least one Alphabet, one Number, and one Special Character (!@#$...).");
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setStep(2);
    setOtpTimer(60);
    setOtpError("");
    setOtpDigits(["", "", "", "", "", ""]);

    setTimeout(() => {
      if (otpRefs.current[0]) otpRefs.current[0].focus();
    }, 100);
  }

  function handleOtpChange(index, value) {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    if (value && index < 5 && otpRefs.current[index + 1]) {
      otpRefs.current[index + 1].focus();
    }
  }

  function handleOtpKeyDown(index, e) {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0 && otpRefs.current[index - 1]) {
      otpRefs.current[index - 1].focus();
    }
  }

  function handleVerifyOtp(e) {
    e.preventDefault();
    const enteredOtp = otpDigits.join("");

    if (enteredOtp.length < 6) {
      setOtpError("Please enter all 6 digits of the OTP.");
      return;
    }

    if (enteredOtp !== generatedOtp) {
      setOtpError("Invalid OTP code. Please check the simulated alert banner and try again.");
      return;
    }

    setRedirecting(true);

    const domain = email.split("@")[1]?.toLowerCase() || "";
    let role = "admin";
    if (domain === "manager.com" || email.includes("manager")) role = "manager";
    else if (domain === "employee.com" || email.includes("employee")) role = "employee";

    login(email, role);

    setTimeout(() => {
      navigate(ROLE_ROUTE[role] || "/admin");
    }, 900);
  }

  function handleResendOtp() {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpTimer(60);
    setOtpError("");
    setOtpDigits(["", "", "", "", "", ""]);
  }

  return (
    <div className="login-page">
      {/* BRAND SIDE PANEL WITH OFFICIAL CIRCULAR EMBLEM & LUXURY FEATURE BADGES */}
      <div className="brand-panel">
        <div className="brand-top">
          <Link to="/" className="logo">
            <IseLogoSvg width={52} height={52} lightMode={false} />
            <div>
              <div className="name">ISE System</div>
              <div className="tag">INCENSE STICK ENTERPRISE</div>
            </div>
          </Link>
        </div>

        {/* UNIQUE LUXURY QUOTE & INCENSE FEATURE BADGES (Refined from Image 3) */}
        <div className="brand-mid">
          <div className="quote-container">
            <span className="quote-mark">“</span>
            <blockquote className="unique-enterprise-quote">
              Crafting divine fragrance with enterprise precision. Where sacred Indian tradition meets digital excellence.
            </blockquote>
            <div className="quote-author-signature">— Incense Stick Enterprise Vision 2026</div>
          </div>

          {/* LUXURY INCENSE PILLARS (Cleaned up from Image 3 layout) */}
          <div className="incense-pillars-grid">
            <div className="pillar-item">
              <div className="pillar-ring">🪔</div>
              <div>
                <div className="p-title">Cleansing Aura &amp; Purity</div>
                <div className="p-sub">Crafted with 100% natural essential oils &amp; herbs</div>
              </div>
            </div>
            <div className="pillar-item">
              <div className="pillar-ring">🧘</div>
              <div>
                <div className="p-title">Meditation &amp; Harmony</div>
                <div className="p-sub">Designed for spiritual focus &amp; calm environment</div>
              </div>
            </div>
            <div className="pillar-item">
              <div className="pillar-ring">🏭</div>
              <div>
                <div className="p-title">Enterprise Batch Precision</div>
                <div className="p-sub">Tracked across Salem &amp; Chennai production units</div>
              </div>
            </div>
          </div>
        </div>

        <div className="brand-foot">© 2026 Incense Stick Enterprise · Secure Enterprise Portal</div>
      </div>

      {/* FORM LOGIN PANEL */}
      <div className="login-panel">
        {step === 1 ? (
          /* STEP 1: CREDENTIALS */
          <form className="login-box" onSubmit={handleSendOtp}>
            <div className="eyebrow">Sign In</div>
            <h2>Welcome to ISE System</h2>
            <p className="sub">Enter your email &amp; password to receive 6-digit OTP</p>

            {/* EMAIL FIELD */}
            <label>Work or Personal Email</label>
            <div className="input-wrap">
              <span>✉️</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. karpagavalli@gmail.com"
              />
            </div>

            {/* PASSWORD FIELD */}
            <label>Password</label>
            <div className="input-wrap">
              <span>🔒</span>
              <input
                type={showPw ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Alphabet + Number + Special Char"
              />
              <span className="eye" onClick={() => setShowPw(!showPw)}>
                {showPw ? "🙈" : "👁️"}
              </span>
            </div>

            {/* PASSWORD STRENGTH CHECKLIST */}
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

            <button type="submit" className="btn-login" disabled={!pwCheck.isValid}>
              Send 6-Digit OTP →
            </button>

            <div className="security-note">
              🔐 Password requires at least one Alphabet, one Number, and one Special Character.
            </div>

            <Link to="/signup" className="back-link" style={{ fontWeight: 700, color: "var(--blue)" }}>
              New employee? Create an account →
            </Link>
            <Link to="/" className="back-link">
              ← Back to homepage
            </Link>
          </form>
        ) : (
          /* STEP 2: OTP VERIFICATION MODAL FORM */
          <form className="login-box otp-box" onSubmit={handleVerifyOtp}>
            {/* SIMULATED OTP ALERT BANNER */}
            <div className="simulated-otp-banner">
              <div className="banner-title">📲 Simulated SMS / Email OTP Alert</div>
              <div className="banner-code">Your 6-Digit OTP Code is: <b>{generatedOtp}</b></div>
              <div className="banner-sub">Type this 6-digit code into the boxes below.</div>
            </div>

            <div className="eyebrow">Verification Step</div>
            <h2>Verify 6-Digit OTP</h2>
            <p className="sub">Sent to <b>{email}</b></p>

            {otpError && <div className="otp-error-alert">⚠️ {otpError}</div>}

            {/* 6 INDIVIDUAL OTP INPUT BOXES */}
            <div className="otp-inputs-grid">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (otpRefs.current[idx] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="otp-digit-box"
                />
              ))}
            </div>

            {/* COUNTDOWN TIMER & RESEND */}
            <div className="otp-timer-row">
              {otpTimer > 0 ? (
                <span>⏱ Resend OTP in <b>{otpTimer}s</b></span>
              ) : (
                <button type="button" className="resend-link" onClick={handleResendOtp}>
                  🔄 Resend OTP Code
                </button>
              )}
              <button type="button" className="change-email-btn" onClick={() => setStep(1)}>
                ✏️ Change Details
              </button>
            </div>

            <button type="submit" className="btn-login" disabled={redirecting}>
              {redirecting ? "Verifying & Signing In…" : "Verify OTP & Access Console →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
