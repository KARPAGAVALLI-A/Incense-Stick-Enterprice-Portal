import React, { useState, useEffect, useRef } from "react";
import "./IndiaFleetGpsMap.css";

const VEHICLES = [
  {
    id: "TN-30-AX-8912",
    name: "Truck TN-30-AX-8912 [Live GPS]",
    driver: "S. Shanmugam",
    phone: "+91 98421 88320",
    speed: 48, // mph
    status: "High Speed Transit",
    location: "Salem Highway (38.7062, -121.2599)",
    routePoints: [
      { id: 1, name: "Salem Factory Depot", lat: 38.401, lng: -121.650, speed: 0, status: "stopped" },
      { id: 2, name: "Erode Highway Toll", lat: 38.480, lng: -121.580, speed: 18, status: "fast" },
      { id: 3, name: "Coimbatore Transit Hub", lat: 38.560, lng: -121.490, speed: 22, status: "fast" },
      { id: 4, name: "Tiruppur Junction", lat: 38.630, lng: -121.380, speed: 8, status: "slow" },
      { id: 5, name: "Bangalore Depot Gate", lat: 38.706, lng: -121.259, speed: 0, status: "stopped" }
    ]
  },
  {
    id: "KA-01-MJ-4052",
    name: "Container Truck KA-01-MJ-4052",
    driver: "R. Venkatesh",
    phone: "+91 94432 11092",
    speed: 12, // mph
    status: "Slow Traffic Transit",
    location: "Hosur Outer Ring Road",
    routePoints: [
      { id: 1, name: "Salem Factory Depot", lat: 38.401, lng: -121.650, speed: 0, status: "stopped" },
      { id: 2, name: "Dharmapuri Checkpost", lat: 38.480, lng: -121.580, speed: 8, status: "slow" },
      { id: 3, name: "Hosur Traffic Zone", lat: 38.560, lng: -121.490, speed: 6, status: "slow" }
    ]
  }
];

export default function IndiaFleetGpsMap() {
  const [selectedVehId, setSelectedVehId] = useState(VEHICLES[0].id);
  const [activeTab, setActiveTab] = useState("Mapping");
  const [isPlaying, setIsPlaying] = useState(false);
  const [replayIdx, setReplayIdx] = useState(2);
  const [zoomLevel, setZoomLevel] = useState(5);
  const [cursorPos, setCursorPos] = useState({ lat: "38.7062", lng: "-121.2599" });

  const canvasRef = useRef(null);
  const activeVeh = VEHICLES.find((v) => v.id === selectedVehId) || VEHICLES[0];

  // Replay Player Animation
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setReplayIdx((prev) => (prev + 1) % activeVeh.routePoints.length);
      }, 1200);
    }
    return () => clearInterval(timer);
  }, [isPlaying, activeVeh]);

  // Draw GeoTelematics Map Canvas with Speed Pushpins 🟢🟡🔴
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Map background tiles (light GIS style)
    ctx.fillStyle = "#E5E7EB";
    ctx.fillRect(0, 0, w, h);

    // Grid map lines (Road networks)
    ctx.strokeStyle = "#D1D5DB";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Major Highway Route Path (Red Line)
    const points = activeVeh.routePoints.map((pt, i) => ({
      x: 80 + i * 110,
      y: 360 - i * 65,
      ...pt
    }));

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.strokeStyle = "#DC2626"; // GeoTelematics Red Route Line
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw Speed Pushpin Markers 🟢🟡🔴 (From uploaded screenshot)
    points.forEach((pt, idx) => {
      // Determine Pushpin Color based on speed
      // 🟢 >15 mph (Fast) | 🟡 >5 mph (Slow) | 🔴 <5 mph (Stopped)
      let pinColor = "#10B981"; // Green (>15 mph)
      if (pt.speed === 0 || pt.status === "stopped") pinColor = "#EF4444"; // Red
      else if (pt.speed <= 15 || pt.status === "slow") pinColor = "#F59E0B"; // Yellow

      const isCurrentReplay = idx === replayIdx;

      // Pushpin Circle Base
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, isCurrentReplay ? 14 : 10, 0, Math.PI * 2);
      ctx.fillStyle = pinColor;
      ctx.shadowColor = pinColor;
      ctx.shadowBlur = isCurrentReplay ? 14 : 6;
      ctx.fill();

      ctx.strokeStyle = "#FFF";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner Icon Arrow
      ctx.fillStyle = "#FFF";
      ctx.font = "bold 10px sans-serif";
      ctx.fillText(pt.speed > 0 ? "⬆" : "📍", pt.x - 4, pt.y + 4);

      // Station Name Label
      ctx.fillStyle = "#1F2937";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText(pt.name, pt.x - 20, pt.y + 24);
    });

  }, [activeVeh, replayIdx, zoomLevel]);

  function handleMouseMove(e) {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const calcLat = (38.4000 + (y / 400) * 0.45).toFixed(4);
    const calcLng = (-121.6500 + (x / 600) * 0.45).toFixed(4);
    setCursorPos({ lat: calcLat, lng: calcLng });
  }

  return (
    <div className="geotelm-wrapper">
      {/* GeoTelematics Header Bar */}
      <div className="geotelm-top-bar">
        <div className="gt-account">Account: <b>ISE System Live GIS (Demo Account)</b></div>
        <div className="gt-links">
          <span>Main Menu</span> | <span className="logout">Logout</span>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="geotelm-nav-tabs">
        {["Main", "Mapping", "Reports", "Administration"].map((tab) => (
          <div
            key={tab}
            className={`gt-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
        <div className="gt-last-event">(Last Event: 2026/09/07 16:40:00 IST)</div>
      </div>

      {/* Main Mapping Workspace */}
      <div className="geotelm-workspace">
        {/* Device Selector Sub-bar */}
        <div className="gt-device-bar">
          <label>Vehicle Map:</label>
          <select
            value={selectedVehId}
            onChange={(e) => setSelectedVehId(e.target.value)}
            className="gt-select"
          >
            {VEHICLES.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>

        <div className="gt-main-grid">
          {/* MAP CANVAS VIEW & ZOOM SLIDER */}
          <div className="gt-canvas-container">
            {/* Vertical Zoom / Pan Controls (Left overlay) */}
            <div className="gt-zoom-controls">
              <button onClick={() => setZoomLevel((z) => Math.min(10, z + 1))}>＋</button>
              <div className="zoom-slider-track">
                <div className="zoom-handle" style={{ top: `${(10 - zoomLevel) * 8}px` }} />
              </div>
              <button onClick={() => setZoomLevel((z) => Math.max(1, z - 1))}>－</button>
            </div>

            <canvas
              ref={canvasRef}
              width={640}
              height={420}
              onMouseMove={handleMouseMove}
              className="gt-canvas"
            />
            <div className="gt-canvas-footer">Show Location Details · GeoTelematics Fleet Engine</div>
          </div>

          {/* RIGHT SIDEBAR: CONTROLS & SPEED PUSHPIN LEGEND (Exact match from photo) */}
          <div className="gt-sidebar-panel">
            {/* Date Range Selector Calendar */}
            <div className="gt-panel-box">
              <div className="box-title">Select Date Range:</div>
              <div className="date-row">
                <span>From:</span> <b>2026/09/01 00:00</b>
              </div>
              <div className="date-row">
                <span>To:</span> <b>2026/09/07 23:59</b>
              </div>

              {/* Calendar Grid */}
              <div className="mini-calendar">
                <div className="cal-header">Sep '26</div>
                <div className="cal-days">
                  <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                  <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span className="sel">7</span>
                </div>
              </div>

              <div className="time-zone-row">
                <label>TimeZone:</label>
                <select className="gt-select-sm"><option>Asia/Kolkata (IST)</option></select>
              </div>

              <button className="btn-gt-update">Update</button>
            </div>

            {/* Telemetry Player & Cursor GPS Location Readout */}
            <div className="gt-panel-box">
              <div className="replay-controls">
                <button className="btn-replay" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? "⏸ Pause Replay" : "► Play Telemetry Replay"}
                </button>
              </div>

              <div className="cursor-loc-readout">
                <div><b>Cursor Location:</b></div>
                <div className="coords">{cursorPos.lat}, {cursorPos.lng}</div>
                <div><b>Distance:</b> 42.50 Miles</div>
              </div>
            </div>

            {/* PUSHPIN LEGEND (Exact match from uploaded image) */}
            <div className="gt-panel-box legend-box">
              <div className="box-title">Pushpin Legend:</div>
              <div className="legend-item">
                <span className="pin-dot green">🟢</span> <span>More than 15 mph (High Speed)</span>
              </div>
              <div className="legend-item">
                <span className="pin-dot yellow">🟡</span> <span>More than 5 mph (Slow Traffic)</span>
              </div>
              <div className="legend-item">
                <span className="pin-dot red">🔴</span> <span>Less than 5 mph (Stopped / Depot)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="gt-footer">Copyright (C) 2026 GeoTelematics Solutions, Inc. · ISE Fleet System</div>
    </div>
  );
}
