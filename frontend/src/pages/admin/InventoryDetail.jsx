import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { INVENTORY_ITEMS } from "../../data/mockData";

const toneClass = { green: "badge-green", amber: "badge-amber", red: "badge-red" };

export default function InventoryDetail() {
  const { id } = useParams(); // useParams: reads the ":id" segment, e.g. /admin/inventory/PRD-001
  const navigate = useNavigate();

  const item = INVENTORY_ITEMS.find((i) => i.id === id);

  if (!item) {
    return (
      <div>
        <p style={{ color: "var(--muted)" }}>No product found for ID "{id}".</p>
        <button className="btn btn-outline" onClick={() => navigate("/admin/inventory")}>← Back to Inventory</button>
      </div>
    );
  }

  return (
    <div>
      <button className="btn btn-outline" style={{ marginBottom: 16 }} onClick={() => navigate(-1)}>← Back</button>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: 24, maxWidth: 480 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(135deg,#DBEAFE,#EFF6FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{item.icon}</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "var(--navy)" }}>{item.name}</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{item.tag}</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <div style={{ fontSize: 10.5, color: "var(--muted)", textTransform: "uppercase", fontWeight: 600 }}>Warehouse</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{item.warehouse}</div>
          </div>
          <div>
            <div style={{ fontSize: 10.5, color: "var(--muted)", textTransform: "uppercase", fontWeight: 600 }}>Status</div>
            <span className={`badge ${toneClass[item.tone]}`}>{item.status}</span>
          </div>
          <div>
            <div style={{ fontSize: 10.5, color: "var(--muted)", textTransform: "uppercase", fontWeight: 600 }}>Stock</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{item.stock.toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: 10.5, color: "var(--muted)", textTransform: "uppercase", fontWeight: 600 }}>Reorder Level</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{item.reorderLevel}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
