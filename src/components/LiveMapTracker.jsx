import React, { useState, useEffect, useRef } from "react";
import "./LiveMapTracker.css";

export default function LiveMapTracker({ order, onClose }) {
  const [progress, setProgress] = useState(0.45); // 0 to 1 along route
  const [speed, setSpeed] = useState(62); // km/h
  const [etaMinutes, setEtaMinutes] = useState(38);

  const canvasRef = useRef(null);

  // Animate truck movement along route
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 0.98) return 0.2;
        return prev + 0.004;
      });
      setSpeed(Math.floor(58 + Math.random() * 10));
      setEtaMinutes((prev) => Math.max(5, prev - (Math.random() > 0.7 ? 1 : 0)));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Draw Interactive GPS Map Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Grid pattern for map background
    ctx.strokeStyle = "rgba(226, 232, 240, 0.4)";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Waypoints
    const p1 = { x: w * 0.15, y: h * 0.75, name: "Salem Unit (Factory)" };
    const p2 = { x: w * 0.50, y: h * 0.35, name: "Erode Transit Hub" };
    const p3 = { x: w * 0.85, y: h * 0.65, name: order?.customer || "Coimbatore Warehouse" };

    // Bezier Route Curve
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.quadraticCurveTo(w * 0.35, h * 0.15, p2.x, p2.y);
    ctx.quadraticCurveTo(w * 0.70, h * 0.25, p3.x, p3.y);
    ctx.strokeStyle = "#CBD5E1";
    ctx.lineWidth = 6;
    ctx.stroke();

    // Active Traversed Route (Highlight Blue)
    const t = progress;
    // Calculate current truck position along quadratic bezier curves
    let curX, curY;
    if (t < 0.5) {
      const segT = t / 0.5;
      const ctrlX = w * 0.35, ctrlY = h * 0.15;
      curX = (1 - segT) * (1 - segT) * p1.x + 2 * (1 - segT) * segT * ctrlX + segT * segT * p2.x;
      curY = (1 - segT) * (1 - segT) * p1.y + 2 * (1 - segT) * segT * ctrlY + segT * segT * p2.y;
    } else {
      const segT = (t - 0.5) / 0.5;
      const ctrlX = w * 0.70, ctrlY = h * 0.25;
      curX = (1 - segT) * (1 - segT) * p2.x + 2 * (1 - segT) * segT * ctrlX + segT * segT * p3.x;
      curY = (1 - segT) * (1 - segT) * p2.y + 2 * (1 - segT) * segT * ctrlY + segT * segT * p3.y;
    }

    // Traversed line
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.quadraticCurveTo(w * 0.35, h * 0.15, p2.x, p2.y);
    ctx.strokeStyle = "#2563EB";
    ctx.lineWidth = 6;
    ctx.stroke();

    // Waypoint Markers
    [p1, p2, p3].forEach((pt, idx) => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = idx === 0 ? "#10B981" : idx === 1 ? "#3B82F6" : "#EF4444";
      ctx.fill();
      ctx.shadowColor = "rgba(0,0,0,0.2)";
      ctx.shadowBlur = 6;

      ctx.fillStyle = "#1E293B";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText(pt.name, pt.x - 30, pt.y + 22);
    });

    // Moving Vehicle Marker (Truck Icon)
    ctx.beginPath();
    ctx.arc(curX, curY, 14, 0, Math.PI * 2);
    ctx.fillStyle = "#2563EB";
    ctx.shadowColor = "#2563EB";
    ctx.shadowBlur = 12;
    ctx.fill();

    ctx.fillStyle = "#FFF";
    ctx.font = "14px sans-serif";
    ctx.fillText("🚚", curX - 7, curY + 5);

  }, [progress, order]);

  return (
    <div className="map-modal-overlay" onClick={onClose}>
      <div className="map-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="map-modal-header">
          <div>
            <div className="map-title">🗺️ Live GPS Route Tracking</div>
            <div className="map-sub">
              Order #{order?.id || "ORD-5081"} · {order?.customer || "South Traders"}
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Live GPS Status Bar */}
        <div className="gps-status-row">
          <div className="gps-pill">
            <span className="dot pulse" /> <b>GPS Live Streaming</b>
          </div>
          <div className="gps-stat">
            <span className="lbl">Estimated Arrival:</span>
            <span className="val">⏱ {etaMinutes} mins</span>
          </div>
          <div className="gps-stat">
            <span className="lbl">Vehicle Speed:</span>
            <span className="val">⚡ {speed} km/h</span>
          </div>
          <div className="gps-stat">
            <span className="lbl">Driver:</span>
            <span className="val">📞 Shanmugam (+91 98421 88320)</span>
          </div>
        </div>

        {/* Canvas Map View */}
        <div className="canvas-wrapper">
          <canvas ref={canvasRef} width={640} height={320} className="gps-canvas" />
        </div>

        {/* Route Milestones List */}
        <div className="milestones-row">
          <div className="milestone-card done">
            <div className="m-icon">📍</div>
            <div>
              <div className="m-title">Salem Factory Unit</div>
              <div className="m-time">Dispatched at 09:15 AM</div>
            </div>
          </div>
          <div className="milestone-card active">
            <div className="m-icon">🚚</div>
            <div>
              <div className="m-title">En-route Erode Highway</div>
              <div className="m-time">In transit · 62 km/h</div>
            </div>
          </div>
          <div className="milestone-card pending">
            <div className="m-icon">🎯</div>
            <div>
              <div className="m-title">{order?.customer || "Destination Hub"}</div>
              <div className="m-time">ETA: {etaMinutes} mins</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="map-modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Close Map</button>
          <button className="btn btn-primary" onClick={() => alert("Driver contacted! Telemetry log sent to manager.")}>
            📞 Call Driver (Shanmugam)
          </button>
        </div>
      </div>
    </div>
  );
}
