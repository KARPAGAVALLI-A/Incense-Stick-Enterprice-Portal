import React, { useState, useEffect, useRef } from "react";
import "./LiveMapTracker.css";
import indiaMapImg from "../assets/india-map-order.png";

// City coordinates mapped specifically for the uploaded India Map image
const CITY_COORDS = {
  "Salem (Factory)": { x: 0.35, y: 0.77, state: "Tamil Nadu" },
  "Chennai (Madras)": { x: 0.44, y: 0.73, state: "Tamil Nadu" },
  "Coimbatore": { x: 0.32, y: 0.78, state: "Tamil Nadu" },
  "Madurai": { x: 0.35, y: 0.83, state: "Tamil Nadu" },
  "Tiruchirapalli": { x: 0.38, y: 0.79, state: "Tamil Nadu" },
  "Bangalore": { x: 0.36, y: 0.70, state: "Karnataka" },
  "Hyderabad": { x: 0.43, y: 0.58, state: "Telangana" },
  "Mumbai": { x: 0.22, y: 0.53, state: "Maharashtra" },
  "New Delhi": { x: 0.33, y: 0.26, state: "Delhi" },
};

const SAMPLE_ROUTES = [
  { id: "R-101", origin: "Salem (Factory)", dest: "Chennai (Madras)", via: "Tiruchirapalli", driver: "Shanmugam", phone: "+91 98421 88320", truckNo: "TN-54-AX-9912" },
  { id: "R-102", origin: "Salem (Factory)", dest: "Bangalore", via: "Hosur", driver: "Muthu Kumar", phone: "+91 97892 10394", truckNo: "TN-30-CZ-4501" },
  { id: "R-103", origin: "Coimbatore", dest: "Hyderabad", via: "Bangalore", driver: "Ravi Chandran", phone: "+91 94432 11982", truckNo: "TN-38-K-8821" },
  { id: "R-104", origin: "Madurai", dest: "Mumbai", via: "Hyderabad", driver: "Selvakumar", phone: "+91 98940 55120", truckNo: "TN-58-B-3344" },
];

export default function LiveMapTracker({ order, onClose }) {
  const [progress, setProgress] = useState(0.42);
  const [speed, setSpeed] = useState(64);
  const [etaMinutes, setEtaMinutes] = useState(45);
  const [selectedRoute, setSelectedRoute] = useState(SAMPLE_ROUTES[0]);
  const [gpsCoords, setGpsCoords] = useState({ lat: "11.6643° N", lng: "78.1460° E" });

  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Preload the imported India Map image asset
  useEffect(() => {
    const img = new Image();
    img.src = indiaMapImg;
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
    };
  }, []);

  // Update selected route when order changes
  useEffect(() => {
    if (order) {
      if (order.customer?.includes("Devi") || order.customer?.includes("Export")) {
        setSelectedRoute(SAMPLE_ROUTES[1]);
      } else if (order.customer?.includes("Annapoorna")) {
        setSelectedRoute(SAMPLE_ROUTES[2]);
      } else if (order.customer?.includes("Meenakshi")) {
        setSelectedRoute(SAMPLE_ROUTES[3]);
      } else {
        setSelectedRoute(SAMPLE_ROUTES[0]);
      }
    }
  }, [order]);

  // Live truck simulation timer
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 0.98) return 0.05;
        return prev + 0.005;
      });

      setSpeed(Math.floor(58 + Math.random() * 12));
      setEtaMinutes((prev) => Math.max(4, prev - (Math.random() > 0.6 ? 1 : 0)));

      setGpsCoords({
        lat: `${(11.6 + Math.random() * 0.8).toFixed(4)}° N`,
        lng: `${(78.1 + Math.random() * 0.8).toFixed(4)}° E`
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  // Render Canvas Map with Image background and dynamic route line
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
      ctx.fillStyle = "#E2E8F0";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#64748B";
      ctx.font = "14px sans-serif";
      ctx.fillText("Loading India GPS Map...", w / 2 - 80, h / 2);
    }

    // 2. Resolve origin and destination points
    const originPoint = CITY_COORDS[selectedRoute.origin] || CITY_COORDS["Salem (Factory)"];
    const destPoint = CITY_COORDS[selectedRoute.dest] || CITY_COORDS["Chennai (Madras)"];

    const startX = originPoint.x * w;
    const startY = originPoint.y * h;
    const endX = destPoint.x * w;
    const endY = destPoint.y * h;

    const midX = (startX + endX) / 2 + 25;
    const midY = (startY + endY) / 2 - 35;

    // 3. Draw Route Path Line
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(midX, midY, endX, endY);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.beginPath();
    ctx.setLineDash([8, 6]);
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(midX, midY, endX, endY);
    ctx.strokeStyle = "#3B82F6";
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.setLineDash([]);

    // 4. Calculate Current Position of Moving Truck
    const t = progress;
    const curX = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * midX + t * t * endX;
    const curY = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * midY + t * t * endY;

    // Traversed path highlight (Solid Green)
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    const subMidX = (1 - t / 2) * startX + (t / 2) * midX;
    const subMidY = (1 - t / 2) * startY + (t / 2) * midY;
    ctx.quadraticCurveTo(subMidX, subMidY, curX, curY);
    ctx.strokeStyle = "#10B981";
    ctx.lineWidth = 5;
    ctx.stroke();

    // 5. Draw Origin and Destination Pins
    drawMapPin(ctx, startX, startY, "#10B981", `🚩 ${selectedRoute.origin}`);
    drawMapPin(ctx, endX, endY, "#EF4444", `🎯 ${selectedRoute.dest}`);

    // 6. Draw Moving Live Truck Marker
    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
    ctx.shadowBlur = 12;

    ctx.beginPath();
    ctx.arc(curX, curY, 18, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(37, 99, 235, 0.3)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(curX, curY, 13, 0, Math.PI * 2);
    ctx.fillStyle = "#1E40AF";
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.fillStyle = "#FFF";
    ctx.font = "13px sans-serif";
    ctx.fillText("🚚", curX - 7, curY + 4);

    // Truck Tooltip Tag
    const tagWidth = 145;
    const tagHeight = 32;
    const tagX = Math.min(Math.max(curX - tagWidth / 2, 10), w - tagWidth - 10);
    const tagY = curY - 45;

    ctx.fillStyle = "#0F172A";
    ctx.beginPath();
    ctx.roundRect(tagX, tagY, tagWidth, tagHeight, 8);
    ctx.fill();
    ctx.strokeStyle = "#3B82F6";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = "#38BDF8";
    ctx.font = "bold 11px sans-serif";
    ctx.fillText(`🚚 ${selectedRoute.truckNo}`, tagX + 8, tagY + 14);
    ctx.fillStyle = "#94A3B8";
    ctx.font = "10px sans-serif";
    ctx.fillText(`${speed} km/h · ${Math.round(progress * 100)}% completed`, tagX + 8, tagY + 26);

  }, [progress, selectedRoute, imageLoaded]);

  function drawMapPin(ctx, x, y, color, label) {
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 8;

    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.font = "bold 11px sans-serif";
    const txtWidth = ctx.measureText(label).width;

    ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
    ctx.fillRect(x - txtWidth / 2 - 4, y + 10, txtWidth + 8, 16);
    ctx.fillStyle = "#0F172A";
    ctx.fillText(label, x - txtWidth / 2, y + 22);
  }

  return (
    <div className="map-modal-overlay" onClick={onClose}>
      <div className="map-modal-box" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="map-modal-header">
          <div>
            <div className="map-title">🗺️ Live GPS India Route Tracker</div>
            <div className="map-sub">
              Order #{order?.id || "ORD-2031"} · {order?.customer || "Sri Balaji Traders"} · Product: {order?.product || "Rose Sandalwood Incense"}
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Route Selector & Telemetry Bar */}
        <div className="gps-status-row">
          <div className="gps-pill">
            <span className="dot pulse" /> <b>GPS Live Connection</b>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11.5, color: "var(--muted)" }}>Select Route:</span>
            <select
              value={selectedRoute.id}
              onChange={(e) => setSelectedRoute(SAMPLE_ROUTES.find(r => r.id === e.target.value))}
              style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 11.5, fontWeight: 600 }}
            >
              {SAMPLE_ROUTES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.origin} ➔ {r.dest} ({r.truckNo})
                </option>
              ))}
            </select>
          </div>

          <div className="gps-stat">
            <span className="lbl">Speed:</span>
            <span className="val">⚡ {speed} km/h</span>
          </div>

          <div className="gps-stat">
            <span className="lbl">ETA:</span>
            <span className="val">⏱ {etaMinutes} mins</span>
          </div>
        </div>

        {/* Real-time Telemetry Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 20px", background: "#F1F5F9", fontSize: 11.5, borderBottom: "1px solid #E2E8F0" }}>
          <div>📍 <b>GPS Coords:</b> {gpsCoords.lat}, {gpsCoords.lng}</div>
          <div>👤 <b>Driver:</b> {selectedRoute.driver} ({selectedRoute.phone})</div>
          <div>🌡️ <b>Cargo Temp:</b> 27.4°C (Aroma Safe)</div>
        </div>

        {/* India Map Canvas View */}
        <div className="canvas-wrapper">
          <canvas ref={canvasRef} width={640} height={520} className="gps-canvas" />
        </div>

        {/* Route Milestones */}
        <div className="milestones-row">
          <div className="milestone-card done">
            <div className="m-icon">🏭</div>
            <div>
              <div className="m-title">{selectedRoute.origin}</div>
              <div className="m-time">Dispatched · 08:30 AM</div>
            </div>
          </div>
          <div className="milestone-card active">
            <div className="m-icon">🚚</div>
            <div>
              <div className="m-title">En-Route Via {selectedRoute.via}</div>
              <div className="m-time">In Transit · {speed} km/h</div>
            </div>
          </div>
          <div className="milestone-card pending">
            <div className="m-icon">🎯</div>
            <div>
              <div className="m-title">{selectedRoute.dest}</div>
              <div className="m-time">ETA: {etaMinutes} mins remaining</div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="map-modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Close Map</button>
          <button className="btn btn-primary" onClick={() => alert(`Dialing driver ${selectedRoute.driver} at ${selectedRoute.phone}...`)}>
            📞 Contact Driver ({selectedRoute.driver})
          </button>
        </div>

      </div>
    </div>
  );
}
