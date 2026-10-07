import React, { useState, useEffect, useRef, useMemo } from "react";
import { useData } from "../../context/DataContext";
import { useNotifications } from "../../context/NotificationContext";
import { useSettings } from "../../context/SettingsContext";
import "./Orders.css";

const STATUS_STEPS = ["Placed", "Processing", "Shipped", "Delivered"];
const STATUS_TONE = { Placed: "badge-blue", Processing: "badge-amber", Shipped: "badge-blue", Delivered: "badge-green" };

// 50 Active Tracked Vehicles with Real Highway Bezier Routes across Tamil Nadu & South India
const SEED_TRACKED_ORDERS = Array.from({ length: 50 }).map((_, i) => {
  const drivers = ["Shanmugam", "Kani", "Suresh Gopi", "Samy", "Muthu Kumar", "Selvakumar", "Ravi Chandran", "Venkatesh", "Anbarasu", "Saravanan"];
  const phones = ["+91 98421 88320", "+91 97892 10394", "+91 94432 11982", "+91 98940 55120", "+91 99441 22301", "+91 98422 99011"];
  const customers = ["Sri Balaji Traders", "Devi Exports", "Annapoorna Pooja Store", "Meenakshi Agencies", "Murugan Stores", "Kavitha Enterprises", "Senthil & Co", "Vasantham Traders"];
  const products = ["Rose Sandalwood Premium", "Jasmine Natural Masala", "Cedarwood Dhoop Stick", "Chandan Supreme", "Sambrani Cup Premium"];
  const cities = ["Salem Factory Depot", "Coimbatore Hub", "Erode Depot", "Madurai Center", "Kovilpatti / NEC Campus", "Thoothukudi Harbour", "Tirunelveli Junction", "Chennai Port", "Bangalore Gate", "Hyderabad Outer"];
  const regPrefixes = ["TN-54", "TN-96", "TN-30", "TN-38", "TN-58", "KA-01", "AP-09"];

  const idNum = i + 1;
  const driver = drivers[i % drivers.length];
  const phone = phones[i % phones.length];
  const customer = customers[i % customers.length];
  const product = products[i % products.length];
  const origin = cities[i % cities.length];
  const dest = cities[(i + 3) % cities.length];
  const speed = Math.floor(35 + (i * 7) % 35);
  const statusStep = i % 4 === 3 ? "Delivered" : i % 3 === 2 ? "Shipped" : i % 2 === 1 ? "Processing" : "Placed";

  // Route Waypoints
  const startX = 0.38;
  const startY = 0.42;
  const targetX = 0.22 + ((i * 0.041) % 0.48);
  const targetY = 0.16 + ((i * 0.054) % 0.70);
  const ctrlX = (startX + targetX) / 2 + (i % 2 === 0 ? 0.08 : -0.06);
  const ctrlY = (startY + targetY) / 2 - (i % 2 === 0 ? 0.06 : 0.08);

  return {
    orderNo: idNum,
    id: `ORD-20${30 + idNum}`,
    customer,
    product,
    qty: (i + 1) * 750,
    truckNo: `${regPrefixes[i % regPrefixes.length]}-AJ-${2000 + idNum}`,
    driver,
    phone,
    origin,
    dest,
    route: `${origin} ➔ ${dest}`,
    speed,
    baseSpeed: speed,
    status: statusStep,
    progress: (i * 0.07) % 0.9,
    startX,
    startY,
    ctrlX,
    ctrlY,
    targetX,
    targetY,
    lat: (8.8 + ((i * 1.37) % 4.5)).toFixed(4),
    lng: (76.8 + ((i * 1.83) % 3.4)).toFixed(4)
  };
});

export default function Orders({ readOnly = false }) {
  const { updateOrderStatus } = useData();
  const { push } = useNotifications();
  const { t } = useSettings();

  const [trackedOrders, setTrackedOrders] = useState(SEED_TRACKED_ORDERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderNo, setSelectedOrderNo] = useState(1);
  const [mapStyle, setMapStyle] = useState("street");
  const [zoomScale, setZoomScale] = useState(1.0); // Interactive 2D Zoom scale
  const [isLiveMoving, setIsLiveMoving] = useState(true);

  // Detail Popover Modal State
  const [detailModalOrder, setDetailModalOrder] = useState(null);

  const canvasRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const pulsePulseRef = useRef(0);

  // Filter orders by search input
  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return trackedOrders;
    const q = searchQuery.toLowerCase();
    return trackedOrders.filter(
      (o) =>
        o.orderNo.toString() === q ||
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.truckNo.toLowerCase().includes(q) ||
        o.driver.toLowerCase().includes(q) ||
        o.route.toLowerCase().includes(q)
    );
  }, [trackedOrders, searchQuery]);

  const selectedOrder = useMemo(() => {
    return trackedOrders.find((o) => o.orderNo === selectedOrderNo) || trackedOrders[0];
  }, [trackedOrders, selectedOrderNo]);

  function advanceStatus(o) {
    const idx = STATUS_STEPS.indexOf(o.status);
    if (idx >= STATUS_STEPS.length - 1) return;
    const next = STATUS_STEPS[idx + 1];

    setTrackedOrders((prev) =>
      prev.map((item) => (item.id === o.id ? { ...item, status: next } : item))
    );

    updateOrderStatus(o.id, next);
    push("admin", `Order ${o.id} Updated`, `${o.customer}'s order is now "${next}".`);
  }

  // Zoom Handlers
  function handleZoomIn() {
    setZoomScale((prev) => Math.min(2.5, Number((prev + 0.25).toFixed(2))));
  }

  function handleZoomOut() {
    setZoomScale((prev) => Math.max(0.75, Number((prev - 0.25).toFixed(2))));
  }

  function handleResetZoom() {
    setZoomScale(1.0);
  }

  // Handle Canvas Click on Vehicle Pin Markers
  function handleCanvasClick(e) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const w = canvas.width;
    const h = canvas.height;

    // Check hit collision with rendered vehicle badges
    for (const o of filteredOrders.slice(0, 18)) {
      const t = o.progress;
      const sX = o.startX * w;
      const sY = o.startY * h;
      const cX = o.ctrlX * w;
      const cY = o.ctrlY * h;
      const tX = o.targetX * w;
      const tY = o.targetY * h;

      const px = (1 - t) * (1 - t) * sX + 2 * (1 - t) * t * cX + t * t * tX;
      const py = (1 - t) * (1 - t) * sY + 2 * (1 - t) * t * cY + t * t * tY;

      const dist = Math.hypot(clickX - px, clickY - py);
      if (dist < 45) {
        setSelectedOrderNo(o.orderNo);
        setDetailModalOrder(o);
        return;
      }
    }
  }

  // 60 FPS Real-time Continuous Vehicle GPS Movement Loop
  useEffect(() => {
    let lastTime = performance.now();

    const animateLoop = (now) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      pulsePulseRef.current = (pulsePulseRef.current + delta * 3) % (Math.PI * 2);

      if (isLiveMoving) {
        setTrackedOrders((prevOrders) =>
          prevOrders.map((o) => {
            if (o.status === "Delivered") return { ...o, speed: 0 };

            let speedFactor = o.baseSpeed / 3600;
            let newProgress = o.progress + speedFactor * delta * 4;

            if (newProgress >= 0.98) {
              newProgress = 0.02;
            }

            const curLat = (8.8 + newProgress * 3.8 + (o.orderNo % 3) * 0.2).toFixed(4);
            const curLng = (76.8 + newProgress * 2.9 + (o.orderNo % 2) * 0.3).toFixed(4);

            return {
              ...o,
              progress: newProgress,
              speed: Math.floor(o.baseSpeed + Math.sin(now / 500 + o.orderNo) * 4),
              lat: curLat,
              lng: curLng
            };
          })
        );
      }

      renderMapCanvas();
      animFrameIdRef.current = requestAnimationFrame(animateLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(animateLoop);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isLiveMoving, mapStyle, zoomScale, selectedOrderNo, filteredOrders]);

  // Render Canvas with Smooth Zooming and Moving Vehicles
  function renderMapCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Save context state for 2D Zoom Transform
    ctx.save();

    // Center zoom around active selected vehicle position or canvas center
    const selVehForZoom = trackedOrders.find((o) => o.orderNo === selectedOrder.orderNo) || trackedOrders[0];
    let centerX = w / 2;
    let centerY = h / 2;

    if (selVehForZoom && zoomScale > 1.0) {
      const t = selVehForZoom.progress;
      const sX = selVehForZoom.startX * w;
      const sY = selVehForZoom.startY * h;
      const cX = selVehForZoom.ctrlX * w;
      const cY = selVehForZoom.ctrlY * h;
      const tX = selVehForZoom.targetX * w;
      const tY = selVehForZoom.targetY * h;

      centerX = (1 - t) * (1 - t) * sX + 2 * (1 - t) * t * cX + t * t * tX;
      centerY = (1 - t) * (1 - t) * sY + 2 * (1 - t) * t * cY + t * t * tY;
    }

    ctx.translate(w / 2, h / 2);
    ctx.scale(zoomScale, zoomScale);
    ctx.translate(-centerX, -centerY);

    // 1. Map Base Background
    if (mapStyle === "satellite") {
      ctx.fillStyle = "#1E293B";
      ctx.fillRect(-w, -h, w * 3, h * 3);

      ctx.fillStyle = "#0F172A";
      ctx.beginPath();
      ctx.moveTo(w * 0.2, 0);
      ctx.lineTo(w * 0.9, 0);
      ctx.lineTo(w * 0.7, h);
      ctx.lineTo(w * 0.1, h);
      ctx.fill();

      ctx.strokeStyle = "rgba(51, 65, 85, 0.4)";
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += 50) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
    } else {
      ctx.fillStyle = "#E0E7FF";
      ctx.fillRect(-w, -h, w * 3, h * 3);

      ctx.fillStyle = "#EDF2F7";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w * 0.85, 0);
      ctx.lineTo(w * 0.65, h);
      ctx.lineTo(0, h);
      ctx.fill();

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

    // 2. Tamil Nadu City Labels
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

    // 3. Highlight Route Line & Moving Marker for Selected Vehicle
    const selVeh = trackedOrders.find((o) => o.orderNo === selectedOrder.orderNo) || trackedOrders[0];
    if (selVeh) {
      const sX = selVeh.startX * w;
      const sY = selVeh.startY * h;
      const cX = selVeh.ctrlX * w;
      const cY = selVeh.ctrlY * h;
      const tX = selVeh.targetX * w;
      const tY = selVeh.targetY * h;

      ctx.beginPath();
      ctx.moveTo(sX, sY);
      ctx.quadraticCurveTo(cX, cY, tX, tY);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
      ctx.lineWidth = 6;
      ctx.stroke();

      ctx.beginPath();
      ctx.setLineDash([8, 6]);
      ctx.moveTo(sX, sY);
      ctx.quadraticCurveTo(cX, cY, tX, tY);
      ctx.strokeStyle = "#3B82F6";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.setLineDash([]);

      const t = selVeh.progress;
      const subMidX = (1 - t / 2) * sX + (t / 2) * cX;
      const subMidY = (1 - t / 2) * sY + (t / 2) * cY;
      const curX = (1 - t) * (1 - t) * sX + 2 * (1 - t) * t * cX + t * t * tX;
      const curY = (1 - t) * (1 - t) * sY + 2 * (1 - t) * t * cY + t * t * tY;

      ctx.beginPath();
      ctx.moveTo(sX, sY);
      ctx.quadraticCurveTo(subMidX, subMidY, curX, curY);
      ctx.strokeStyle = "#10B981";
      ctx.lineWidth = 5;
      ctx.stroke();
    }

    // 4. Render Moving Vehicles
    filteredOrders.slice(0, 18).forEach((o) => {
      const isSelected = o.orderNo === selectedOrder.orderNo;
      const t = o.progress;

      const sX = o.startX * w;
      const sY = o.startY * h;
      const cX = o.ctrlX * w;
      const cY = o.ctrlY * h;
      const tX = o.targetX * w;
      const tY = o.targetY * h;

      const px = (1 - t) * (1 - t) * sX + 2 * (1 - t) * t * cX + t * t * tX;
      const py = (1 - t) * (1 - t) * sY + 2 * (1 - t) * t * cY + t * t * tY;

      const pulseSize = 16 + Math.sin(pulsePulseRef.current) * 6;
      ctx.beginPath();
      ctx.arc(px, py, pulseSize, 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? "rgba(37, 99, 235, 0.25)" : "rgba(16, 185, 129, 0.2)";
      ctx.fill();

      const badgeW = isSelected ? 130 : 108;
      const badgeH = isSelected ? 42 : 36;
      const badgeX = px - badgeW / 2;
      const badgeY = py - badgeH / 2;

      ctx.shadowColor = isSelected ? "#2563EB" : "rgba(0,0,0,0.25)";
      ctx.shadowBlur = isSelected ? 18 : 6;

      ctx.fillStyle = isSelected ? "#0F172A" : "#FFFFFF";
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 18);
      ctx.fill();

      ctx.strokeStyle = isSelected ? "#38BDF8" : "#059669";
      ctx.lineWidth = isSelected ? 2.5 : 1.5;
      ctx.stroke();

      ctx.shadowBlur = 0;

      ctx.fillStyle = isSelected ? "#38BDF8" : "#0F172A";
      ctx.font = `bold ${isSelected ? "11.5px" : "10.5px"} sans-serif`;
      ctx.fillText(`🚚 Order #${o.orderNo}`, badgeX + 12, badgeY + (isSelected ? 16 : 14));

      ctx.fillStyle = o.speed > 35 ? "#059669" : o.speed > 0 ? "#D97706" : "#DC2626";
      ctx.font = `bold ${isSelected ? "10.5px" : "9.5px"} sans-serif`;
      ctx.fillText(`${o.speed} km/h`, badgeX + 12, badgeY + (isSelected ? 32 : 27));
    });

    ctx.restore();
  }

  return (
    <div className="orders-split-page">
      {/* Header Bar */}
      <div className="orders-header-row">
        <div>
          <h1 className="orders-main-title">🚚 {t("orders")} — Live GPS Navigation &amp; Fleet Tracking</h1>
          <p className="orders-sub-title">
            Continuous 60 FPS real-time GPS movement, road route navigation &amp; telemetry · 50 Active Vehicles
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={() => setIsLiveMoving(!isLiveMoving)}
            style={{
              padding: "8px 16px", borderRadius: 10, border: "none",
              background: isLiveMoving ? "#10B981" : "#64748B", color: "#FFF",
              fontSize: 12.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6
            }}
          >
            {isLiveMoving ? "🟢 Live 60FPS GPS Moving" : "⏸ Paused"}
          </button>
        </div>
      </div>

      {/* Main Split Layout Container */}
      <div className="orders-split-container">
        
        {/* LEFT PANEL: Search & Order Cards */}
        <div className="orders-left-panel">
          
          {/* Search Box */}
          <div className="orders-search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search Order No (1..50), Driver, or City..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="orders-search-input"
            />
          </div>

          {/* Status Counter Bar */}
          <div className="orders-count-bar">
            <span>Found {filteredOrders.length} Vehicles</span>
            <span className="live-pill">
              <span className="pulse-dot" /> 44 Moving Live (Real-Time)
            </span>
          </div>

          {/* Order Cards List */}
          <div className="orders-scroll-list">
            {filteredOrders.map((o) => {
              const isSelected = o.orderNo === selectedOrder.orderNo;
              const idx = STATUS_STEPS.indexOf(o.status);

              return (
                <div
                  key={o.id}
                  className={`order-card-item ${isSelected ? "active-selected" : ""}`}
                  onClick={() => {
                    setSelectedOrderNo(o.orderNo);
                    setDetailModalOrder(o);
                  }}
                >
                  <div className="card-header-line">
                    <span className="order-pill-badge">Order #{o.orderNo}</span>
                    <span className={`badge ${STATUS_TONE[o.status]}`}>{o.status}</span>
                  </div>

                  <div className="card-customer-name">{o.id} · {o.customer}</div>
                  <div className="card-product-sub">{o.product} · {o.qty.toLocaleString()} units</div>
                  <div className="card-truck-reg">🚚 {o.truckNo} · 👤 {o.driver}</div>
                  <div className="card-route-loc">📍 {o.route}</div>

                  <div className="card-footer-action">
                    <button
                      style={{ border: "none", background: "transparent", color: "#2563EB", fontWeight: 700, fontSize: 11.5, cursor: "pointer", padding: 0 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrderNo(o.orderNo);
                        setDetailModalOrder(o);
                      }}
                    >
                      🔎 View Shipment Details
                    </button>
                    {!readOnly && o.status !== "Delivered" && (
                      <button
                        className="btn-advance-step"
                        onClick={(e) => {
                          e.stopPropagation();
                          advanceStatus(o);
                        }}
                      >
                        Mark as {STATUS_STEPS[idx + 1]} →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT PANEL: Interactive GPS Map View with Smooth Live Movement */}
        <div className="orders-right-map-panel">
          
          {/* Map Layer Style Toggles */}
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

          {/* Interactive Zoom Controls Overlay (WORKING + and -) */}
          <div className="map-zoom-overlay">
            <button onClick={handleZoomIn} title="Zoom In (+)">＋</button>
            <span style={{ fontSize: 10, fontWeight: 800, color: "#fff", background: "rgba(15,23,42,0.8)", padding: "2px 4px", borderRadius: 4, textAlign: "center" }}>
              {Math.round(zoomScale * 100)}%
            </span>
            <button onClick={handleZoomOut} title="Zoom Out (-)">－</button>
            {zoomScale !== 1.0 && (
              <button onClick={handleResetZoom} title="Reset Zoom" style={{ fontSize: 10, height: 22, marginTop: 2 }}>
                ↺
              </button>
            )}
          </div>

          {/* Canvas Map View with Click Collision Detection */}
          <canvas
            ref={canvasRef}
            width={780}
            height={580}
            onClick={handleCanvasClick}
            className="orders-map-canvas"
            title="Click any vehicle marker pin to view full shipment details!"
          />

          {/* Selected Order Summary Footer */}
          <div className="map-selected-bar" onClick={() => setDetailModalOrder(selectedOrder)} style={{ cursor: "pointer" }}>
            <div>
              <div className="sel-title">🚚 Order #{selectedOrder.orderNo} ({selectedOrder.id}) · {selectedOrder.customer} (Click for Full Details)</div>
              <div className="sel-sub">{selectedOrder.product} · {selectedOrder.route} · Driver: {selectedOrder.driver}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="sel-speed">⚡ {selectedOrder.speed} km/h</div>
              <div className="sel-coords">Live GPS: {selectedOrder.lat}° N, {selectedOrder.lng}° E</div>
            </div>
          </div>

        </div>

      </div>

      {/* 📦 DETAILED SHIPMENT POPUP MODAL (Source, Destination, Product, Driver, Speed, GPS) */}
      {detailModalOrder && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.75)", backdropFilter: "blur(6px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => setDetailModalOrder(null)}>
          <div style={{ background: "#FFFFFF", borderRadius: 20, width: "100%", maxWidth: 520, boxShadow: "0 25px 50px rgba(0,0,0,0.35)", overflow: "hidden", animation: "modalPop 0.25s cubic-bezier(0.16, 1, 0.3, 1)" }} onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div style={{ padding: "18px 24px", background: "#0F172A", color: "#FFFFFF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: "#38BDF8" }}>🚚 Live Shipment Telemetry Details</div>
                <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>Order #{detailModalOrder.orderNo} · {detailModalOrder.id}</div>
              </div>
              <button onClick={() => setDetailModalOrder(null)} style={{ background: "none", border: "none", color: "#94A3B8", fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 24 }}>
              
              {/* Source ➔ Destination Banner */}
              <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 14, padding: 16, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#2563EB", textTransform: "uppercase" }}>🚩 SOURCE (ORIGIN)</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", marginTop: 3 }}>{detailModalOrder.origin}</div>
                </div>
                <div style={{ fontSize: 20, color: "#2563EB", padding: "0 12px" }}>➔</div>
                <div style={{ flex: 1, textAlign: "right" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#DC2626", textTransform: "uppercase" }}>🎯 DESTINATION</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", marginTop: 3 }}>{detailModalOrder.dest}</div>
                </div>
              </div>

              {/* Product & Customer Details */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>📦 PRODUCT TRANSPORTED</div>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: "#0F172A", marginTop: 4 }}>{detailModalOrder.product}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#2563EB", marginTop: 2 }}>{detailModalOrder.qty.toLocaleString()} Units Loaded</div>
                </div>

                <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>🏢 CUSTOMER</div>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: "#0F172A", marginTop: 4 }}>{detailModalOrder.customer}</div>
                  <div style={{ fontSize: 11.5, color: "#64748B", marginTop: 2 }}>Status: <span className={`badge ${STATUS_TONE[detailModalOrder.status]}`}>{detailModalOrder.status}</span></div>
                </div>
              </div>

              {/* Driver & Telemetry Specs */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>👤 DRIVER &amp; TRUCK</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", marginTop: 4 }}>{detailModalOrder.driver}</div>
                  <div style={{ fontSize: 11.5, color: "#475569", marginTop: 2 }}>🚚 Reg: <b>{detailModalOrder.truckNo}</b></div>
                  <div style={{ fontSize: 11.5, color: "#2563EB", fontWeight: 600, marginTop: 2 }}>📞 {detailModalOrder.phone}</div>
                </div>

                <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#047857", textTransform: "uppercase" }}>⚡ LIVE TELEMETRY</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#059669", marginTop: 4 }}>{detailModalOrder.speed} km/h</div>
                  <div style={{ fontSize: 11, color: "#047857", marginTop: 2 }}>GPS: {detailModalOrder.lat}° N, {detailModalOrder.lng}° E</div>
                  <div style={{ fontSize: 10.5, color: "#059669", fontWeight: 600, marginTop: 2 }}>🟢 Active Signal</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                <button onClick={() => setDetailModalOrder(null)} className="btn btn-outline" style={{ padding: "9px 18px", fontSize: 12.5 }}>Close</button>
                <button
                  onClick={() => alert(`Calling Driver ${detailModalOrder.driver} at ${detailModalOrder.phone}...`)}
                  className="btn btn-primary"
                  style={{ padding: "9px 20px", background: "#2563EB", color: "#FFF", fontSize: 12.5, fontWeight: 700, border: "none", borderRadius: 8, cursor: "pointer" }}
                >
                  📞 Call Driver ({detailModalOrder.driver})
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
