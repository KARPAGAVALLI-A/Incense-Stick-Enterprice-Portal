import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import IseLogoSvg from "../components/IseLogoSvg";
import "./Login.css";

const ROLE_ROUTE = { admin: "/admin", manager: "/manager", employee: "/employee" };

const GOOGLE_ACCOUNTS = [
  { name: "Karpagavalli A", email: "karpagavalli.google@gmail.com", role: "admin", avatar: "K" },
  { name: "Ravi Kumar", email: "ravikumar.ise@gmail.com", role: "manager", avatar: "R" },
  { name: "Muthu Selvam", email: "muthuselvam.ise@gmail.com", role: "employee", avatar: "M" }
];

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

  // GOOGLE OAUTH MODAL STATE
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleStep, setGoogleStep] = useState(1); // 1 = Choose Account, 2 = Enter Google Password, 3 = Verifying
  const [selectedGoogleAcc, setSelectedGoogleAcc] = useState(null);
  const [googlePassword, setGooglePassword] = useState("");
  const [googlePwError, setGooglePwError] = useState("");

  const { login } = useAuth();
  const { t } = useSettings();
  const navigate = useNavigate();
  const otpRefs = useRef([]);

  useEffect(() => {
    let timer;
    if (step === 2 && otpTimer > 0) {
      timer = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, otpTimer]);

  // Open Google Account Picker Modal
  function handleOpenGoogleModal() {
    setShowGoogleModal(true);
    setGoogleStep(1);
    setSelectedGoogleAcc(null);
    setGooglePassword("");
    setGooglePwError("");
  }

  // Choose Account
  function handleSelectGoogleAccount(acc) {
    setSelectedGoogleAcc(acc);
    setGoogleStep(2);
    setGooglePassword("");
    setGooglePwError("");
  }

  // Verify Google Password & Authenticate
  function handleVerifyGooglePassword(e) {
    e.preventDefault();
    if (!googlePassword) {
      setGooglePwError("Please enter your Google account password.");
      return;
    }

    setGoogleStep(3); // Verifying animation

    setTimeout(() => {
      login(selectedGoogleAcc.email, selectedGoogleAcc.role);
      navigate(ROLE_ROUTE[selectedGoogleAcc.role] || "/admin");
    }, 1200);
  }

  function handleSendOtp(e) {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!password) {
      alert("Please enter your password.");
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

        {/* UNIQUE LUXURY QUOTE & INCENSE FEATURE BADGES */}
        <div className="brand-mid">
          <div className="quote-container">
            <span className="quote-mark">“</span>
            <blockquote className="unique-enterprise-quote">
              Crafting divine fragrance with enterprise precision. Where sacred Indian tradition meets digital excellence.
            </blockquote>
            <div className="quote-author-signature">— Incense Stick Enterprise Vision 2026</div>
          </div>

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
          /* STEP 1: CREDENTIALS & GOOGLE SIGN IN */
          <form className="login-box" onSubmit={handleSendOtp}>
            <div className="eyebrow">Sign In</div>
            <h2>Welcome to ISE System</h2>
            <p className="sub">Sign in with Google or enter your email credentials</p>

            {/* CONTINUE WITH GOOGLE OAUTH BUTTON */}
            <button
              type="button"
              className="btn-google-signin"
              onClick={handleOpenGoogleModal}
              disabled={redirecting}
            >
              <svg className="google-icon" width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="login-divider">
              <span>OR ENTER CREDENTIALS</span>
            </div>

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
                placeholder="Enter your password"
              />
              <span className="eye" onClick={() => setShowPw(!showPw)}>
                {showPw ? "🙈" : "👁️"}
              </span>
            </div>

            <button type="submit" className="btn-login" disabled={!email || !password}>
              Send 6-Digit OTP →
            </button>

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
            <div className="simulated-otp-banner">
              <div className="banner-title">📲 Simulated SMS / Email OTP Alert</div>
              <div className="banner-code">Your 6-Digit OTP Code is: <b>{generatedOtp}</b></div>
              <div className="banner-sub">Type this 6-digit code into the boxes below.</div>
            </div>

            <div className="eyebrow">Verification Step</div>
            <h2>Verify 6-Digit OTP</h2>
            <p className="sub">Sent to <b>{email}</b></p>

            {otpError && <div className="otp-error-alert">⚠️ {otpError}</div>}

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

      {/* AUTHENTIC GOOGLE OAUTH POPUP MODAL */}
      {showGoogleModal && (
        <div className="google-modal-overlay" onClick={() => setShowGoogleModal(false)}>
          <div className="google-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="gm-header">
              <svg className="google-icon" width="24" height="24" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span className="gm-brand-title">Sign in with Google</span>
              <button className="gm-close" onClick={() => setShowGoogleModal(false)}>✕</button>
            </div>

            {googleStep === 1 ? (
              /* STEP 1: CHOOSE AN ACCOUNT */
              <div className="gm-step-body">
                <h3 className="gm-title">Choose an account</h3>
                <p className="gm-sub">to continue to <b>ISE System Enterprise Portal</b></p>

                <div className="gm-accounts-list">
                  {GOOGLE_ACCOUNTS.map((acc) => (
                    <div
                      key={acc.email}
                      className="gm-account-item"
                      onClick={() => handleSelectGoogleAccount(acc)}
                    >
                      <div className="gm-avatar">{acc.avatar}</div>
                      <div>
                        <div className="gm-acc-name">{acc.name}</div>
                        <div className="gm-acc-email">{acc.email}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="gm-footer-note">
                  To continue, Google will share your name, email address, and language preference with ISE System.
                </div>
              </div>
            ) : googleStep === 2 ? (
              /* STEP 2: ENTER GOOGLE PASSWORD */
              <form className="gm-step-body" onSubmit={handleVerifyGooglePassword}>
                <div className="gm-selected-user">
                  <div className="gm-avatar">{selectedGoogleAcc?.avatar}</div>
                  <div>
                    <div className="gm-acc-name">{selectedGoogleAcc?.name}</div>
                    <div className="gm-acc-email">{selectedGoogleAcc?.email}</div>
                  </div>
                  <button type="button" className="gm-change-btn" onClick={() => setGoogleStep(1)}>
                    Change
                  </button>
                </div>

                <h3 className="gm-title" style={{ marginTop: 16 }}>Enter your Google password</h3>
                <p className="gm-sub">Verify your identity to complete Google OAuth sign in</p>

                {googlePwError && <div className="gm-error">{googlePwError}</div>}

                <div className="gm-input-wrap">
                  <input
                    type="password"
                    required
                    value={googlePassword}
                    onChange={(e) => setGooglePassword(e.target.value)}
                    placeholder="Enter your Google password"
                    className="gm-pw-input"
                  />
                </div>

                <div className="gm-btn-row">
                  <button type="button" className="gm-cancel-btn" onClick={() => setGoogleStep(1)}>
                    Back
                  </button>
                  <button type="submit" className="gm-next-btn">
                    Next →
                  </button>
                </div>
              </form>
            ) : (
              /* STEP 3: VERIFYING & SIGNING IN */
              <div className="gm-step-body gm-verifying">
                <div className="gm-spinner" />
                <h3 className="gm-title" style={{ marginTop: 16 }}>Google OAuth 2.0 Authenticated!</h3>
                <p className="gm-sub">Signing in as <b>{selectedGoogleAcc?.email}</b>…</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
