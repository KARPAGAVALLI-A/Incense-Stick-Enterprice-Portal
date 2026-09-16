import React, { useState, useEffect, useRef, useMemo } from "react";
import { useData } from "../../context/DataContext";
import { useNotifications } from "../../context/NotificationContext";
import { useSettings } from "../../context/SettingsContext";
import "./Orders.css";

const STATUS_STEPS = ["Placed", "Processing", "Shipped", "Delivered"];
const STATUS_TONE = { Placed: "badge-blue", Processing: "badge-amber", Shipped: "badge-blue", Delivered: "badge-green" };

// 50 Active Tracked Vehicles & Customer Orders
const SEED_TRACKED_ORDERS = Array.from({ length: 50 }).map((_, i) => {
  const drivers = ["Shanmugam", "Kani", "Suresh Gopi", "Samy", "Muthu Kumar", "Selvakumar", "Ravi Chandran", "Venkatesh", "Anbarasu", "Saravanan"];
  const customers = ["Sri Balaji Traders", "Devi Exports", "Annapoorna Pooja Store", "Meenakshi Agencies", "Murugan Stores", "Kavitha Enterprises", "Senthil & Co", "Vasantham Traders"];
  const products = ["Rose Sandalwood Premium", "Jasmine Natural Masala", "Cedarwood Dhoop Stick", "Chandan Supreme", "Sambrani Cup Premium"];
  const cities = ["Salem Factory", "Coimbatore Hub", "Erode Depot", "Madurai Center", "Kovilpatti / NEC Campus", "Thoothukudi Harbour", "Tirunelveli Junction", "Chennai Port", "Bangalore Gate", "Hyderabad Outer"];
  const regPrefixes = ["TN-54", "TN-96", "TN-30", "TN-38", "TN-58", "KA-01", "AP-09"];

  const idNum = i + 1;
  const driver = drivers[i % drivers.length];
  const customer = customers[i % customers.length];
  const product = products[i % products.length];
  const origin = cities[i % cities.length];
  const dest = cities[(i + 3) % cities.length];
  const speed = Math.floor(18 + (i * 7) % 55);
  const statusStep = i % 4 === 3 ? "Delivered" : i % 3 === 2 ? "Shipped" : i % 2 === 1 ? "Processing" : "Placed";

  const lat = 8.8 + ((i * 1.37) % 4.5);
  const lng = 76.8 + ((i * 1.83) % 3.4);

  return {
    orderNo: idNum,
    id: `ORD-20${30 + idNum}`,
    customer,
    product,
    qty: (i + 1) * 500,
    truckNo: `${regPrefixes[i % regPrefixes.length]}-AJ-${2000 + idNum}`,
    driver,
    origin,
    dest,
    route: `${origin} ➔ ${dest}`,
    speed,
    status: statusStep,
    lat: lat.toFixed(4),
    lng: lng.toFixed(4)
  };
});

export default function Orders({ readOnly = false }) {
  const { updateOrderStatus } = useData();
  const { push } = useNotifications();
  const { t } = useSettings();

  const [trackedOrders, setTrackedOrders] = useState(SEED_TRACKED_ORDERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderNo, setSelectedOrderNo] = useState(1);
  const [mapStyle, setMapStyle] = useState("street"); // 'street' or 'satellite'
  const [zoomLevel, setZoomLevel] = useState(1);

  const canvasRef = useRef(null);

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

  // Live truck speed animation timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTrackedOrders((prev) =>
        prev.map((o) => {
          if (o.status === "Delivered") return { ...o, speed: 0 };
          return { ...o, speed: Math.max(12, Math.floor(18 + Math.random() * 45)) };
        })
      );
    }, 2000);
    return () => clearInterval(timer);
  }, []);

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

  // Draw Interactive Map Canvas (Street vs Satellite Hybrid)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // 1. Draw Map Background
    if (mapStyle === "satellite") {
      ctx.fillStyle = "#1E293B"; // Dark Satellite Ocean
      ctx.fillRect(0, 0, w, h);

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
      ctx.fillStyle = "#E0E7FF"; // Light ocean
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "#EDF2F7";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w * 0.85, 0);
      ctx.lineTo(w * 0.65, h);
      ctx.lineTo(0, h);
      ctx.fill();

      // Highways
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

    // 2. City Labels
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

    // 3. Highlight Selected Route Line
    const selIdx = trackedOrders.findIndex((o) => o.orderNo === selectedOrder.orderNo);
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

    // 4. Render Floating Pin Badges (Matching reference UI screenshot)
    filteredOrders.slice(0, 16).forEach((o) => {
      const isSelected = o.orderNo === selectedOrder.orderNo;
      const oIdx = o.orderNo;

      const px = w * (0.22 + ((oIdx * 0.038) % 0.48));
      const py = h * (0.15 + ((oIdx * 0.052) % 0.72));

      const badgeW = isSelected ? 128 : 108;
      const badgeH = isSelected ? 42 : 36;
      const badgeX = px - badgeW / 2;
      const badgeY = py - badgeH / 2;

      ctx.shadowColor = isSelected ? "#2563EB" : "rgba(0,0,0,0.2)";
      ctx.shadowBlur = isSelected ? 16 : 6;

      ctx.fillStyle = isSelected ? "#0F172A" : "#FFFFFF";
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 18);
      ctx.fill();

      ctx.strokeStyle = isSelected ? "#3B82F6" : "#059669";
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

  }, [filteredOrders, selectedOrder, mapStyle, zoomLevel]);

  return (
    <div className="orders-split-page">
      {/* Header Bar */}
      <div className="orders-header-row">
        <div>
          <h1 className="orders-main-title">🚚 {t("orders")} — Live GPS Tracking</h1>
          <p className="orders-sub-title">
            Real-time GPS vehicle tracking, customer order status &amp; route telemetry · 50 Active Shipments
          </p>
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
              <span className="pulse-dot" /> 44 Moving Live
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
                  onClick={() => setSelectedOrderNo(o.orderNo)}
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
                    <span className={`speed-text ${o.speed > 35 ? "fast" : o.speed > 0 ? "slow" : "stop"}`}>
                      ⚡ {o.speed} km/h
                    </span>
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

        {/* RIGHT PANEL: Interactive GPS Map View */}
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

          {/* Zoom Overlay */}
          <div className="map-zoom-overlay">
            <button onClick={() => setZoomLevel((z) => Math.min(5, z + 1))}>＋</button>
            <button onClick={() => setZoomLevel((z) => Math.max(1, z - 1))}>－</button>
          </div>

          {/* Canvas Map View */}
          <canvas
            ref={canvasRef}
            width={780}
            height={580}
            className="orders-map-canvas"
          />

          {/* Selected Order Summary Footer */}
          <div className="map-selected-bar">
            <div>
              <div className="sel-title">🚚 Order #{selectedOrder.orderNo} ({selectedOrder.id}) · {selectedOrder.customer}</div>
              <div className="sel-sub">{selectedOrder.product} · {selectedOrder.route} · Driver: {selectedOrder.driver}</div>
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
