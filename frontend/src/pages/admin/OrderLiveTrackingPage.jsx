import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import "./OrderLiveTrackingPage.css";

// 50 Active GPS Tracked Orders / Vehicles matching Indian Routes
const SAMPLE_GPS_ORDERS = Array.from({ length: 50 }).map((_, i) => {
  const drivers = ["Shanmugam", "Kani", "Suresh Gopi", "Samy", "Muthu Kumar", "Selvakumar", "Ravi Chandran", "Venkatesh", "Anbarasu", "Saravanan"];
  const cities = ["Salem Factory", "Coimbatore Hub", "Erode Depot", "Madurai Center", "Kovilpatti / NEC Campus", "Thoothukudi Harbour", "Tirunelveli Junction", "Chennai Port", "Bangalore Gate", "Hyderabad Outer"];
  const regPrefixes = ["TN-54", "TN-96", "TN-30", "TN-38", "TN-58", "KA-01", "AP-09"];
  
  const idNum = i + 1;
  const driver = drivers[i % drivers.length];
  const origin = cities[i % cities.length];
  const dest = cities[(i + 3) % cities.length];
  const speed = Math.floor(18 + (i * 7) % 55);
  const status = speed === 0 ? "stopped" : speed < 25 ? "slow" : "fast";

  // Coordinates normalized around South India / Tamil Nadu map region
  // Tamil Nadu lat range ~ 8.5° to 13.5° N, lng range ~ 76.5° to 80.3° E
  const lat = 8.8 + ((i * 1.37) % 4.5);
  const lng = 76.8 + ((i * 1.83) % 3.4);

  return {
    orderNo: idNum,
    id: `ORD-20${30 + idNum}`,
    truckNo: `${regPrefixes[i % regPrefixes.length]}-AJ-${2000 + idNum}`,
    driver,
    origin,
    dest,
    route: `${origin} ➔ ${dest}`,
    speed,
    status,
    lat: lat.toFixed(4),
    lng: lng.toFixed(4),
    lastUpdated: "Just now"
  };
});

export default function OrderLiveTrackingPage() {
  const navigate = useNavigate();
  const { orders } = useData();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderNo, setSelectedOrderNo] = useState(1);
  const [mapStyle, setMapStyle] = useState("street"); // 'street' or 'satellite'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);

  const canvasRef = useRef(null);

  // Filter orders by search query
  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return SAMPLE_GPS_ORDERS;
    const q = searchQuery.toLowerCase();
    return SAMPLE_GPS_ORDERS.filter(
      (o) =>
        o.orderNo.toString() === q ||
        o.truckNo.toLowerCase().includes(q) ||
        o.driver.toLowerCase().includes(q) ||
        o.route.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const selectedOrder = useMemo(() => {
    return SAMPLE_GPS_ORDERS.find((o) => o.orderNo === selectedOrderNo) || SAMPLE_GPS_ORDERS[0];
  }, [selectedOrderNo]);

  // Live truck movement simulation
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        // Animate positions slightly
        SAMPLE_GPS_ORDERS.forEach((o) => {
          if (o.speed > 0) {
            o.speed = Math.floor(18 + Math.random() * 45);
          }
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Render Canvas Map with Street / Satellite Tiles and Pin Badges
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // 1. Draw Map Base Background (Street vs Satellite Hybrid)
    if (mapStyle === "satellite") {
      ctx.fillStyle = "#1E293B"; // Dark Satellite Ocean
      ctx.fillRect(0, 0, w, h);

      // Coastal / Land contour
      ctx.fillStyle = "#0F172A";
      ctx.beginPath();
      ctx.moveTo(w * 0.2, 0);
      ctx.lineTo(w * 0.9, 0);
      ctx.lineTo(w * 0.7, h);
      ctx.lineTo(w * 0.1, h);
      ctx.fill();

      // Satellite grid lines
      ctx.strokeStyle = "rgba(51, 65, 85, 0.4)";
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += 50) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
    } else {
      // Standard Street Map Tile background
      ctx.fillStyle = "#E0E7FF"; // Ocean blue light
      ctx.fillRect(0, 0, w, h);

      // Land background
      ctx.fillStyle = "#EDF2F7";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w * 0.85, 0);
      ctx.lineTo(w * 0.65, h);
      ctx.lineTo(0, h);
      ctx.fill();

      // Major road lines (Yellow & White highways)
      ctx.strokeStyle = "#FCD34D";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(w * 0.15, h * 0.1);
      ctx.lineTo(w * 0.45, h * 0.5);
      ctx.lineTo(w * 0.55, h * 0.9);
      ctx.stroke();

      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(w * 0.35, h * 0.2);
      ctx.lineTo(w * 0.25, h * 0.8);
      ctx.stroke();
    }

    // 2. Draw Tamil Nadu City Labels on Map
    const MAP_CITIES = [
      { name: "Chennai Port", x: w * 0.62, y: h * 0.18 },
      { name: "Salem Factory Depot", x: w * 0.38, y: h * 0.42 },
      { name: "Coimbatore Hub", x: w * 0.28, y: h * 0.48 },
      { name: "Erode Logistics", x: w * 0.35, y: h * 0.45 },
      { name: "Madurai Center", x: w * 0.40, y: h * 0.65 },
      { name: "Kovilpatti / NEC", x: w * 0.42, y: h * 0.74 },
      { name: "Thoothukudi Harbour", x: w * 0.48, y: h * 0.79 },
      { name: "Tirunelveli Junction", x: w * 0.38, y: h * 0.84 }
    ];

    MAP_CITIES.forEach((c) => {
      ctx.fillStyle = mapStyle === "satellite" ? "rgba(255,255,255,0.7)" : "#475569";
      ctx.font = "600 10.5px sans-serif";
      ctx.fillText(`📍 ${c.name}`, c.x, c.y);
    });

    // 3. Draw Route Path Line for Currently Selected Order
    const selIdx = SAMPLE_GPS_ORDERS.findIndex((o) => o.orderNo === selectedOrder.orderNo);
    const startX = w * 0.38;
    const startY = h * 0.42;
    const targetX = w * (0.2 + ((selIdx * 0.08) % 0.45));
    const targetY = h * (0.2 + ((selIdx * 0.11) % 0.65));

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo((startX + targetX) / 2 + 30, (startY + targetY) / 2 - 20, targetX, targetY);
    ctx.strokeStyle = "#3B82F6";
    ctx.lineWidth = 5;
    ctx.stroke();

    // 4. Render Floating Pin Badges for Active Vehicles (Exact UI style from screenshot)
    filteredOrders.slice(0, 15).forEach((o) => {
      const isSelected = o.orderNo === selectedOrder.orderNo;
      const oIdx = o.orderNo;

      const px = w * (0.22 + ((oIdx * 0.038) % 0.48));
      const py = h * (0.15 + ((oIdx * 0.052) % 0.72));

      // Pin Bubble Card Dimensions
      const badgeW = isSelected ? 125 : 105;
      const badgeH = isSelected ? 42 : 36;
      const badgeX = px - badgeW / 2;
      const badgeY = py - badgeH / 2;

      // Glow effect for selected
      ctx.shadowColor = isSelected ? "#2563EB" : "rgba(0,0,0,0.2)";
      ctx.shadowBlur = isSelected ? 16 : 6;

      // Outer Rounded Pill Box
      ctx.fillStyle = isSelected ? "#0F172A" : "#FFFFFF";
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 18);
      ctx.fill();

      ctx.strokeStyle = isSelected ? "#3B82F6" : "#059669";
      ctx.lineWidth = isSelected ? 2.5 : 1.5;
      ctx.stroke();

      ctx.shadowBlur = 0;

      // Vehicle / Order Badge Icon
      ctx.fillStyle = isSelected ? "#38BDF8" : "#0F172A";
      ctx.font = `bold ${isSelected ? "11.5px" : "10.5px"} sans-serif`;
      ctx.fillText(`🚚 Order #${o.orderNo}`, badgeX + 12, badgeY + (isSelected ? 16 : 14));

      // Speed Tag
      ctx.fillStyle = o.speed > 35 ? "#059669" : o.speed > 0 ? "#D97706" : "#DC2626";
      ctx.font = `bold ${isSelected ? "10.5px" : "9.5px"} sans-serif`;
      ctx.fillText(`${o.speed} km/h`, badgeX + 12, badgeY + (isSelected ? 32 : 27));
    });

  }, [filteredOrders, selectedOrder, mapStyle, zoomLevel]);

  return (
    <div className="live-track-wrapper">
      
      {/* Top Header Bar */}
      <div className="track-header-bar">
        <div className="track-title-area">
          <h1>Live Order &amp; Vehicle Tracking</h1>
          <p>Real-time GPS fleet monitoring, route analytics &amp; delivery speed tracking</p>
        </div>
        <button className="btn-back-dash" onClick={() => navigate("/admin")}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Main Split Screen Container */}
      <div className="track-container-card">
        
        {/* LEFT PANEL: Search & Order Cards List */}
        <div className="track-left-panel">
          
          {/* Search Input Bar */}
          <div className="search-box-row">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search Bus No (1..50), Driver, or City..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="track-search-input"
            />
          </div>

          {/* Status Counter Strip */}
          <div className="status-count-strip">
            <span className="found-lbl">Found {filteredOrders.length} Vehicles</span>
            <span className="moving-live-pill">
              <span className="live-dot" /> 44 Moving Live
            </span>
          </div>

          {/* Scrollable Order Cards List */}
          <div className="order-cards-scroll">
            {filteredOrders.map((o) => {
              const isSelected = o.orderNo === selectedOrder.orderNo;
              return (
                <div
                  key={o.orderNo}
                  className={`track-item-card ${isSelected ? "selected" : ""}`}
                  onClick={() => setSelectedOrderNo(o.orderNo)}
                >
                  <div className="card-top-row">
                    <span className="order-num-badge">Order #{o.orderNo}</span>
                    <span className={`speed-badge ${o.status}`}>
                      ⚡ {o.speed} km/h
                    </span>
                  </div>

                  <div className="reg-no-title">{o.truckNo}</div>
                  
                  <div className="driver-line">
                    <span>👤 Driver: <b>{o.driver}</b></span>
                  </div>

                  <div className="route-line">
                    📍 {o.route}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT PANEL: Interactive Map View */}
        <div className="track-right-map-panel">
          
          {/* Top Floating Map Layer Style Toggles (Standard Street vs Satellite Hybrid) */}
          <div className="map-layer-toggles">
            <button
              className={`layer-btn ${mapStyle === "street" ? "active" : ""}`}
              onClick={() => setMapStyle("street")}
            >
              🗺️ Standard Street
            </button>
            <button
              className={`layer-btn ${mapStyle === "satellite" ? "active" : ""}`}
              onClick={() => setMapStyle("satellite")}
            >
              🛰️ Satellite Hybrid
            </button>
          </div>

          {/* Left Zoom Controls Overlay */}
          <div className="map-zoom-controls-overlay">
            <button onClick={() => setZoomLevel((z) => Math.min(5, z + 1))}>＋</button>
            <button onClick={() => setZoomLevel((z) => Math.max(1, z - 1))}>－</button>
          </div>

          {/* HTML5 Interactive Map Canvas */}
          <canvas
            ref={canvasRef}
            width={780}
            height={580}
            className="track-map-canvas"
          />

          {/* Selected Vehicle Floating Summary Footer */}
          <div className="map-selected-footer">
            <div>
              <div className="sel-title">🚚 Order #{selectedOrder.orderNo} · {selectedOrder.truckNo}</div>
              <div className="sel-sub">Route: {selectedOrder.route} · Driver: {selectedOrder.driver}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="sel-speed">⚡ {selectedOrder.speed} km/h</div>
              <div className="sel-coords">GPS: {selectedOrder.lat}° N, {selectedOrder.lng}° E</div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
