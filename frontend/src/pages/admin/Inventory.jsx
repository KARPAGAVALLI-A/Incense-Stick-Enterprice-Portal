import React, { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { INVENTORY_ITEMS, WAREHOUSES } from "../../data/mockData";
import { useSettings } from "../../context/SettingsContext";
import Pagination from "../../components/Pagination";
import ProductQrScanner from "../../components/ProductQrScanner";

const toneClass = { green: "badge-green", amber: "badge-amber", red: "badge-red" };

function downloadCSV(rows, filename) {
  const header = Object.keys(rows[0]).join(",");
  const body = rows.map((r) => Object.values(r).map((v) => `"${v}"`).join(",")).join("\n");
  const csv = header + "\n" + body;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function Inventory({ readOnly = false }) {
  const [items, setItems] = useState(INVENTORY_ITEMS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", warehouse: WAREHOUSES[0].name, stock: "", reorderLevel: "", icon: "🪔" });
  const [selectedWh, setSelectedWh] = useState(WAREHOUSES[0].id);
  const [activeQrProduct, setActiveQrProduct] = useState(null);

  const { t } = useSettings();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("limit") || "5", 10);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  function handlePageChange(newPage) {
    setSearchParams({ page: newPage.toString(), limit: pageSize.toString() });
  }

  function handlePageSizeChange(newSize) {
    setSearchParams({ page: "1", limit: newSize.toString() });
  }

  const outCount = items.filter((i) => i.tone === "red").length;
  const lowCount = items.filter((i) => i.tone === "amber").length;
  const inStockCount = items.filter((i) => i.tone === "green").length;

  function handleDelete(id) {
    if (!window.confirm("Remove this product from inventory?")) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function handleAddProduct(e) {
    e.preventDefault();
    if (!newProduct.name || !newProduct.stock || !newProduct.reorderLevel) {
      alert("Please fill in all required fields!");
      return;
    }
    const stock = Number(newProduct.stock);
    const reorderLevel = Number(newProduct.reorderLevel);
    const tone = stock === 0 ? "red" : stock < reorderLevel ? "amber" : "green";
    const status = stock === 0 ? "Out of Stock" : stock < reorderLevel ? "Low Stock" : "In Stock";
    const id = "PRD-" + String(items.length + 1).padStart(3, "0");

    const createdItem = {
      id,
      icon: newProduct.icon || "🪔",
      name: newProduct.name,
      tag: `${id} · Newly Added`,
      warehouse: newProduct.warehouse,
      stock,
      reorderLevel,
      status,
      tone
    };

    setItems((prev) => [createdItem, ...prev]);
    setShowAddModal(false);
    setNewProduct({ name: "", warehouse: WAREHOUSES[0].name, stock: "", reorderLevel: "", icon: "🪔" });
  }

  function handleDownloadReport() {
    const rows = items.map((it) => ({
      ID: it.id,
      Name: it.name,
      Warehouse: it.warehouse,
      Stock: it.stock,
      ReorderLevel: it.reorderLevel,
      Status: it.status
    }));
    downloadCSV(rows, `ise-inventory-report-${new Date().toISOString().slice(0, 10)}.csv`);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--navy)" }}>🏬 {t("inventory")} &amp; Warehouse</h1>
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>Live stock across all warehouse locations</p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn btn-outline" onClick={handleDownloadReport}>📥 Download CSV Report</button>
          <button className="btn btn-outline" onClick={() => setActiveQrProduct(items[0])}>📷 Scan Box QR Code</button>
          {!readOnly && (
            <button className="btn btn-primary" style={{ background: "#2563EB", border: "none" }} onClick={() => setShowAddModal(true)}>
              ➕ Add Product
            </button>
          )}
        </div>
      </div>

      {/* KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
        <div style={{ background: "var(--card-bg, #fff)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "var(--blue)" }} />
          <div style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 500 }}>Total Products</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "var(--navy)" }}>{items.length}</div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>across 3 warehouses</div>
        </div>
        <div style={{ background: "var(--card-bg, #fff)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "var(--green)" }} />
          <div style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 500 }}>In Stock</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "var(--navy)" }}>{inStockCount}</div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>healthy stock level</div>
        </div>
        <div style={{ background: "var(--card-bg, #fff)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "var(--amber)" }} />
          <div style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 500 }}>Low Stock</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "var(--navy)" }}>{lowCount}</div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>below reorder level</div>
        </div>
        <div style={{ background: "var(--card-bg, #fff)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "var(--red)" }} />
          <div style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 500 }}>Out of Stock</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "var(--navy)" }}>{outCount}</div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>needs urgent reorder</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Product table */}
        <div style={{ flex: "1 1 620px", minWidth: 0, background: "var(--card-bg, #fff)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 640 }}>
              <thead style={{ background: "var(--bg)" }}>
                <tr>
                  {["Product", "Warehouse", "Stock", "Reorder Level", "QR Price", "Status", !readOnly ? "Actions" : null].filter(Boolean).map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "11px 16px", fontSize: 10.5, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map((it) => (
                  <tr key={it.id} style={{ borderTop: "1px solid var(--border)" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 7, background: "linear-gradient(135deg,#DBEAFE,#EFF6FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{it.icon}</div>
                        <div>
                          <Link to={`/admin/inventory/${it.id}`} style={{ fontWeight: 600, color: "var(--blue)", fontSize: 13, textDecoration: "none" }}>{it.name}</Link>
                          <div style={{ fontSize: 11, color: "var(--muted)" }}>{it.tag}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", color: "var(--text)" }}>{it.warehouse}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, minWidth: 50, height: 6, background: "var(--border)", borderRadius: 99 }}>
                          <div style={{ height: "100%", borderRadius: 99, width: `${Math.min(100, Math.round((it.stock / (it.reorderLevel * 3)) * 100))}%`, background: it.tone === "green" ? "var(--green)" : it.tone === "amber" ? "var(--amber)" : "var(--red)" }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: it.tone === "red" ? "var(--red)" : "var(--text)", width: 44, textAlign: "right" }}>{it.stock.toLocaleString()}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", color: "var(--muted)" }}>{it.reorderLevel}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <button className="btn btn-outline" style={{ fontSize: 11, padding: "3px 8px" }} onClick={() => setActiveQrProduct(it)}>
                        📷 QR Offer
                      </button>
                    </td>
                    <td style={{ padding: "12px 16px" }}><span className={`badge ${toneClass[it.tone]}`}>{it.status}</span></td>
                    {!readOnly && (
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="btn btn-outline" style={{ fontSize: 11, padding: "5px 11px", color: "var(--red)" }} onClick={() => handleDelete(it.id)}>Del</button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>

        {/* Right panel */}
        <div style={{ flex: "1 1 300px", minWidth: 280, display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Warehouses */}
          <div style={{ background: "var(--card-bg, #fff)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--navy)" }}>Warehouses</div>
              <div style={{ fontSize: 11.5, color: "var(--muted)" }}>3 active locations</div>
            </div>
            <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              {WAREHOUSES.map((wh) => {
                const pct = Math.round((wh.used / wh.capacity) * 100);
                const warn = pct >= 85;
                return (
                  <div
                    key={wh.id} onClick={() => setSelectedWh(wh.id)}
                    style={{ border: `1.5px solid ${selectedWh === wh.id ? "var(--blue)" : "var(--border)"}`, borderRadius: 10, padding: 12, cursor: "pointer", background: selectedWh === wh.id ? "var(--blue-xs)" : "var(--card-bg)" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text)" }}>🏬 {wh.name}</div>
                        <div style={{ fontSize: 10.5, color: "var(--muted)" }}>📍 {wh.location}</div>
                      </div>
                      <span className="badge badge-green">Active</span>
                    </div>
                    <div style={{ height: 6, background: "var(--border)", borderRadius: 99, marginBottom: 8 }}>
                      <div style={{ height: "100%", borderRadius: 99, width: `${pct}%`, background: warn ? "var(--amber)" : "var(--blue)" }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "var(--muted)" }}>
                      <span>Cap {wh.capacity.toLocaleString()}</span>
                      <span>Used {wh.used.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ➕ ADD NEW PRODUCT MODAL */}
      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.65)", backdropFilter: "blur(4px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#FFFFFF", borderRadius: 18, width: "100%", maxWidth: 480, overflow: "hidden", boxShadow: "0 25px 50px rgba(0,0,0,0.3)" }}>
            <div style={{ padding: "16px 22px", background: "#0F172A", color: "#FFFFFF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#38BDF8" }}>➕ Add New Incense Product</div>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", color: "#94A3B8", fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>
            <form onSubmit={handleAddProduct} style={{ padding: 22 }}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>Product Icon &amp; Name:</label>
                <div style={{ display: "flex", gap: 10 }}>
                  <select
                    value={newProduct.icon}
                    onChange={(e) => setNewProduct({ ...newProduct, icon: e.target.value })}
                    style={{ padding: "9px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 16 }}
                  >
                    <option value="🪔">🪔 Incense Stick</option>
                    <option value="🌹">🌹 Rose Cone</option>
                    <option value="🌸">🌸 Jasmine Mogra</option>
                    <option value="🪵">🪵 Cedarwood Dhoop</option>
                    <option value="🪴">🪴 Sambrani Cup</option>
                  </select>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lotus Masala Premium"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    style={{ flex: 1, padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>Warehouse Location:</label>
                <select
                  value={newProduct.warehouse}
                  onChange={(e) => setNewProduct({ ...newProduct, warehouse: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
                >
                  {WAREHOUSES.map((wh) => (
                    <option key={wh.id} value={wh.name}>{wh.name} ({wh.location})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>Initial Stock Quantity:</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 15000"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>Reorder Threshold Level:</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 5000"
                    value={newProduct.reorderLevel}
                    onChange={(e) => setNewProduct({ ...newProduct, reorderLevel: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline" style={{ padding: "8px 16px" }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ padding: "8px 20px", background: "#2563EB", border: "none", color: "#FFF", fontWeight: 700 }}>Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Scanner & Audio Price Announcement Modal */}
      {activeQrProduct && (
        <ProductQrScanner product={activeQrProduct} onClose={() => setActiveQrProduct(null)} />
      )}
    </div>
  );
}
