import React, { useState, useEffect, useRef } from "react";
import "./IndiaFleetGpsMap.css";
import indiaMapImg from "../assets/india-map-order.png";

const VEHICLES = [
  {
    id: "TN-54-AX-9912",
    name: "Truck TN-54-AX-9912 [Salem Express]",
    driver: "S. Shanmugam",
    phone: "+91 98421 88320",
    speed: 48,
    status: "High Speed Transit",
    location: "Salem ➔ Chennai Highway",
    routePoints: [
      { id: 1, name: "Salem Unit (Factory)", x: 0.35, y: 0.77, speed: 0, status: "stopped" },
      { id: 2, name: "Tiruchirapalli Junction", x: 0.38, y: 0.79, speed: 42, status: "fast" },
      { id: 3, name: "Pondicherry Outer Ring", x: 0.43, y: 0.75, speed: 28, status: "slow" },
      { id: 4, name: "Chennai Port (Destination)", x: 0.44, y: 0.73, speed: 0, status: "stopped" }
    ]
  },
  {
    id: "TN-30-CZ-4501",
    name: "Container TN-30-CZ-4501 [Bangalore Route]",
    driver: "Muthu Kumar",
    phone: "+91 97892 10394",
    speed: 12,
    status: "Slow Traffic",
    location: "Hosur Highway",
    routePoints: [
      { id: 1, name: "Salem Unit", x: 0.35, y: 0.77, speed: 0, status: "stopped" },
      { id: 2, name: "Dharmapuri Checkpost", x: 0.35, y: 0.74, speed: 14, status: "slow" },
      { id: 3, name: "Bangalore Depot Gate", x: 0.36, y: 0.70, speed: 0, status: "stopped" }
    ]
  },
  {
    id: "TN-38-K-8821",
    name: "Fleet TN-38-K-8821 [Hyderabad Freight]",
    driver: "Ravi Chandran",
    phone: "+91 94432 11982",
    speed: 56,
    status: "High Speed Transit",
    location: "Hyderabad Outer Ring Road",
    routePoints: [
      { id: 1, name: "Coimbatore Hub", x: 0.32, y: 0.78, speed: 0, status: "stopped" },
      { id: 2, name: "Bangalore Bypass", x: 0.36, y: 0.70, speed: 52, status: "fast" },
      { id: 3, name: "Hyderabad Central Depot", x: 0.43, y: 0.58, speed: 0, status: "stopped" }
    ]
  }
];

export default function IndiaFleetGpsMap() {
  const [selectedVehId, setSelectedVehId] = useState(VEHICLES[0].id);
  const [activeTab, setActiveTab] = useState("Mapping");
  const [isPlaying, setIsPlaying] = useState(false);
  const [replayIdx, setReplayIdx] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(5);
  const [cursorPos, setCursorPos] = useState({ lat: "11.6643° N", lng: "78.1460° E" });

  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const activeVeh = VEHICLES.find((v) => v.id === selectedVehId) || VEHICLES[0];

  // Preload the imported India Map image asset
  useEffect(() => {
    const img = new Image();
    img.src = indiaMapImg;
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
    };
  }, []);

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

  // Draw GeoTelematics Map Canvas with exact India Map image background & Speed Pushpins 🟢🟡🔴
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // 1. Draw Map Image
    if (imageRef.current && imageLoaded) {
      ctx.drawImage(imageRef.current, 0, 0, w, h);
    } else {
      ctx.fillStyle = "#E5E7EB";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#4B5563";
      ctx.font = "14px sans-serif";
      ctx.fillText("Loading India GIS Map...", w / 2 - 70, h / 2);
    }

    // 2. Map Route Points on Canvas
    const points = activeVeh.routePoints.map((pt) => ({
      x: pt.x * w,
      y: pt.y * h,
      ...pt
    }));

    // 3. Draw Route Path Line
    if (points.length > 1) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.strokeStyle = "#DC2626"; // GeoTelematics Red Route Line
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    // 4. Draw Speed Pushpin Markers 🟢🟡🔴
    points.forEach((pt, idx) => {
      let pinColor = "#10B981"; // 🟢 >15 mph (Fast)
      if (pt.speed === 0 || pt.status === "stopped") pinColor = "#EF4444"; // 🔴 <5 mph (Stopped)
      else if (pt.speed <= 15 || pt.status === "slow") pinColor = "#F59E0B"; // 🟡 >5 mph (Slow)

      const isCurrentReplay = idx === replayIdx;

      // Pushpin Base Circle
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, isCurrentReplay ? 13 : 9, 0, Math.PI * 2);
      ctx.fillStyle = pinColor;
      ctx.shadowColor = pinColor;
      ctx.shadowBlur = isCurrentReplay ? 14 : 6;
      ctx.fill();

      ctx.strokeStyle = "#FFF";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Station Label
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#0F172A";
      ctx.font = "bold 11px sans-serif";
      const txtW = ctx.measureText(pt.name).width;

      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fillRect(pt.x - txtW / 2 - 4, pt.y + 12, txtW + 8, 16);
      ctx.fillStyle = "#0F172A";
      ctx.fillText(pt.name, pt.x - txtW / 2, pt.y + 24);
    });

  }, [activeVeh, replayIdx, zoomLevel, imageLoaded]);

  function handleMouseMove(e) {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const calcLat = (11.0 + (y / 420) * 2.5).toFixed(4);
    const calcLng = (77.0 + (x / 640) * 2.5).toFixed(4);
    setCursorPos({ lat: `${calcLat}° N`, lng: `${calcLng}° E` });
  }

  return (
    <div className="geotelm-wrapper">
      {/* GeoTelematics Header Bar */}
      <div className="geotelm-top-bar">
        <div className="gt-account">Account: <b>ISE India Fleet GIS Telematics</b></div>
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
        <div className="gt-last-event">(Last Event: 2026/09/08 Live IST)</div>
      </div>

      {/* Main Mapping Workspace */}
      <div className="geotelm-workspace">
        {/* Device Selector Sub-bar */}
        <div className="gt-device-bar">
          <label>Vehicle Map Selection:</label>
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
            {/* Vertical Zoom Controls */}
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
              height={520}
              onMouseMove={handleMouseMove}
              className="gt-canvas"
            />
            <div className="gt-canvas-footer">Show Location Details · GeoTelematics India Map Engine</div>
          </div>

          {/* RIGHT SIDEBAR: CONTROLS & SPEED PUSHPIN LEGEND */}
          <div className="gt-sidebar-panel">
            {/* Date Range Selector */}
            <div className="gt-panel-box">
              <div className="box-title">Select Date Range:</div>
              <div className="date-row">
                <span>From:</span> <b>2026/09/01 00:00</b>
              </div>
              <div className="date-row">
                <span>To:</span> <b>2026/09/08 23:59</b>
              </div>

              {/* Calendar Grid */}
              <div className="mini-calendar">
                <div className="cal-header">Sep '26</div>
                <div className="cal-days">
                  <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                  <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span className="sel">8</span>
                </div>
              </div>

              <div className="time-zone-row">
                <label>TimeZone:</label>
                <select className="gt-select-sm"><option>Asia/Kolkata (IST)</option></select>
              </div>

              <button className="btn-gt-update">Update</button>
            </div>

            {/* Telemetry Player & Cursor GPS Location */}
            <div className="gt-panel-box">
              <div className="replay-controls">
                <button className="btn-replay" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? "⏸ Pause Replay" : "► Play Telemetry Replay"}
                </button>
              </div>

              <div className="cursor-loc-readout">
                <div><b>Cursor Coordinates:</b></div>
                <div className="coords">{cursorPos.lat}, {cursorPos.lng}</div>
                <div><b>Driver:</b> {activeVeh.driver} ({activeVeh.phone})</div>
              </div>
            </div>

            {/* PUSHPIN LEGEND */}
            <div className="gt-panel-box legend-box">
              <div className="box-title">Pushpin Speed Legend:</div>
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

      <div className="gt-footer">Copyright (C) 2026 GeoTelematics Solutions, Inc. · ISE India Fleet System</div>
    </div>
  );
}
