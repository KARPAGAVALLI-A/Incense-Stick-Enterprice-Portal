import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  return (
    <div className="landing">
      <nav className="nav">
        <div className="nav-inner">
          <div className="logo">
            <div className="logo-icon">🪔</div>
            <div className="logo-text"><div className="name">ISE System</div><div className="tag">INCENSE STICK ENTERPRISE</div></div>
          </div>
          <div className="nav-links">
            <a href="#process">How It Works</a>
            <a href="#features">Features</a>
            <a href="#collection">Products</a>
            <Link to="/signup" style={{ color: "#CBD5E1" }}>New Employee?</Link>
            <Link to="/login" className="btn btn-ghost">Sign In →</Link>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="wrap hero-grid">
          <div>
            <span className="eyebrow">One system · Three units · Salem, Chennai, Madurai</span>
            <h1>Run your entire<br />incense business<br />from <span>one screen.</span></h1>
            <p className="lead">Production, inventory, staff attendance, orders and profit — ISE System keeps every unit of your enterprise in sync, in real time.</p>
            <div className="hero-actions">
              <Link to="/login" className="btn btn-primary">Sign In to Dashboard →</Link>
              <a href="#features" className="btn btn-ghost">See What It Does</a>
            </div>
          </div>

          <div className="hero-panel">
            <div className="hp-row"><div className="hp-ic">⚙️</div><div><div className="hp-name">Sticks Produced Today</div><div className="hp-sub">Across all 3 units</div></div><div className="hp-val">42.6K</div></div>
            <div className="hp-row"><div className="hp-ic">✅</div><div><div className="hp-name">Staff Present Today</div><div className="hp-sub">92% attendance</div></div><div className="hp-val">79 / 86</div></div>
            <div className="hp-row"><div className="hp-ic">💰</div><div><div className="hp-name">Revenue Today</div><div className="hp-sub">Diwali season surge</div></div><div className="hp-val">₹3.84L</div></div>
            <div className="hp-row"><div className="hp-ic">📦</div><div><div className="hp-name">Low Stock Alerts</div><div className="hp-sub">Needs reorder</div></div><div className="hp-val">5</div></div>
          </div>
        </div>
        <div className="scroll-cue"><div className="scroll-line"></div> Scroll to explore</div>
      </header>

      <div className="stats-band">
        <div className="wrap stats-grid">
          <div className="stat-item"><div className="stat-num">27</div><div className="stat-lbl">Years of Craft</div></div>
          <div className="stat-item"><div className="stat-num">3</div><div className="stat-lbl">Production Units</div></div>
          <div className="stat-item"><div className="stat-num">10,000+</div><div className="stat-lbl">Retail Partners</div></div>
          <div className="stat-item"><div className="stat-num">200+</div><div className="stat-lbl">Temples Supplied</div></div>
        </div>
      </div>

      <section className="process" id="process">
        <div className="wrap">
          <span className="eyebrow">How It Works</span>
          <h2>One login. The system knows where you belong.</h2>
          <p className="sub">Your email decides your workspace — admins see the whole business, employees see exactly what they need.</p>
          <div className="process-row">
            <div className="process-card"><div className="process-num">01</div><h3>Sign In With Work Email</h3><p>name@admin.com or name@employee.com — the system detects your role automatically.</p></div>
            <div className="process-card"><div className="process-num">02</div><h3>Verify & Mark Attendance</h3><p>Employees confirm identity with fingerprint or face scan, then mark present or absent.</p></div>
            <div className="process-card"><div className="process-num">03</div><h3>Track Production Live</h3><p>Admins see per-product status, raw material availability, and what's left to complete.</p></div>
            <div className="process-card"><div className="process-num">04</div><h3>Review Profit & Reports</h3><p>Past vs present production, customer credit, and company profit — one dashboard.</p></div>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <div className="wrap">
          <div className="features-head">
            <span className="eyebrow">Built For The Whole Enterprise</span>
            <h2>Everything your team already does, just organized.</h2>
            <p>No new habits to learn — just one place all of it lives.</p>
          </div>
          <div className="feat-grid">
            <div className="feat-card"><div className="feat-ic">📊</div><h3>Business Overview</h3><p>Production, revenue, credit and alerts on a single dashboard, updated in real time.</p></div>
            <div className="feat-card"><div className="feat-ic">👷</div><h3>Staff & Attendance</h3><p>Biometric check-in, per-employee production tracking, and past employee records.</p></div>
            <div className="feat-card"><div className="feat-ic">⚙️</div><h3>Production Tracking</h3><p>Per-product status, raw material availability, and orders waiting on each batch.</p></div>
            <div className="feat-card"><div className="feat-ic">🏬</div><h3>Inventory & Warehouse</h3><p>Live stock across Salem, Chennai and Madurai with automatic reorder alerts.</p></div>
            <div className="feat-card"><div className="feat-ic">💳</div><h3>Customer Credit</h3><p>Track outstanding balances and limits for every wholesale and distributor account.</p></div>
            <div className="feat-card"><div className="feat-ic">🕒</div><h3>Activity Log</h3><p>Every sign-in and change is recorded automatically for full accountability.</p></div>
          </div>
        </div>
      </section>

      <section className="collection" id="collection">
        <div className="wrap">
          <div className="collection-head">
            <div><span className="eyebrow" style={{ color: "var(--blue-lt)" }}>What We Produce</span><h2>Six fragrances, tracked from raw material to dispatch.</h2></div>
            <p>Every product on the floor is visible in the system, in real time.</p>
          </div>
          <div className="prod-grid">
            <div className="prod-card"><div className="pf-icon">🌹</div><span className="tag">Premium</span><h3>Rose Sandalwood</h3><p>Our most requested temple fragrance, in steady production.</p></div>
            <div className="prod-card"><div className="pf-icon">🌿</div><span className="tag">Masala</span><h3>Jasmine Natural</h3><p>Hand-dipped in cold-pressed jasmine oil.</p></div>
            <div className="prod-card"><div className="pf-icon">🪵</div><span className="tag">Dhoop</span><h3>Cedarwood Dhoop</h3><p>Grounding evening burn for prayer spaces.</p></div>
            <div className="prod-card"><div className="pf-icon">🌸</div><span className="tag">Standard</span><h3>Lavender Floral</h3><p>A calmer everyday fragrance for closed rooms.</p></div>
            <div className="prod-card"><div className="pf-icon">🔥</div><span className="tag">Premium</span><h3>Camphor Temple</h3><p>Sharp, purifying blend for daily aarti.</p></div>
            <div className="prod-card"><div className="pf-icon">🍋</div><span className="tag">Standard</span><h3>Lemon Grass Fresh</h3><p>Bright citrus-forward, fastest-growing fragrance.</p></div>
          </div>
        </div>
      </section>

      <section className="quote-section">
        <div className="wrap quote-box">
          <div className="quote-mark">"</div>
          <div className="quote-text">Before ISE System, we found out about stock shortages after the order was already late. Now the whole floor sees it the same day.</div>
          <div className="quote-src"><b>Ravi Kumar</b> · Warehouse Manager, Salem Unit</div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap">
          <span className="eyebrow">Ready When You Are</span>
          <h2>Sign in and see today's numbers.</h2>
          <p>Your email already knows where you belong — admin or employee.</p>
          <Link to="/login" className="btn btn-primary">Sign In to ISE System →</Link>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo"><div className="logo-icon">🪔</div><div className="logo-text"><div className="name" style={{ color: "#fff" }}>ISE System</div></div></div>
              <p>The operating system for Incense Stick Enterprise — production, inventory, staff and sales across Salem, Chennai and Madurai.</p>
            </div>
            <div className="footer-col">
              <h5>Product</h5>
              <a href="#process">How It Works</a>
              <a href="#features">Features</a>
              <a href="#collection">Products</a>
              <Link to="/login">Sign In</Link>
            </div>
            <div className="footer-col">
              <h5>Units</h5>
              <a href="#">Salem — Unit 01</a>
              <a href="#">Chennai — Unit 02</a>
              <a href="#">Madurai — Unit 03</a>
            </div>
            <div className="footer-col">
              <h5>Contact</h5>
              <a href="mailto:hello@ise.in">hello@ise.in</a>
              <a href="tel:+914272200000">+91 427 220 0000</a>
            </div>
          </div>
          <div className="footer-bottom">
            <div>© 2026 Incense Stick Enterprise. All rights reserved.</div>
            <div>Salem · Chennai · Madurai, Tamil Nadu, India</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
