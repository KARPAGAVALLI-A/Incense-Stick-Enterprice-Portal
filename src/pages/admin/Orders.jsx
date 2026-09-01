import React, { useMemo } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { useNotifications } from "../../context/NotificationContext";
import { useSettings } from "../../context/SettingsContext";
import Pagination from "../../components/Pagination";

const STATUS_STEPS = ["Placed", "Processing", "Shipped", "Delivered"];
const STATUS_TONE = { Placed: "badge-blue", Processing: "badge-amber", Shipped: "badge-blue", Delivered: "badge-green" };

export default function Orders({ readOnly = false }) {
  const { orders, updateOrderStatus } = useData();
  const { push } = useNotifications();
  const { t } = useSettings();

  // Router hooks for Pagination URL query parameters
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("limit") || "5", 10);

  const totalItems = orders.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return orders.slice(start, start + pageSize);
  }, [orders, currentPage, pageSize]);

  function handlePageChange(newPage) {
    setSearchParams({ page: newPage.toString(), limit: pageSize.toString() });
  }

  function handlePageSizeChange(newSize) {
    setSearchParams({ page: "1", limit: newSize.toString() });
  }

  function advance(order) {
    const idx = STATUS_STEPS.indexOf(order.status);
    if (idx >= STATUS_STEPS.length - 1) return;
    const next = STATUS_STEPS[idx + 1];
    updateOrderStatus(order.id, next);
    push("admin", `Order ${order.id} updated`, `${order.customer}'s order is now "${next}".`);
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--navy)" }}>🚚 {t("orders")}</h1>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
          {readOnly ? "Live status of every customer order." : "Track and update every customer order's status."} · Route: <code>{location.pathname}</code>
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
        {paginatedOrders.map((o) => {
          const idx = STATUS_STEPS.indexOf(o.status);
          return (
            <div key={o.id} style={{ background: "var(--card-bg, #fff)", border: "1px solid var(--border)", borderRadius: 14, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{ fontWeight: 700, color: "var(--navy)", fontSize: 14.5 }}>{o.id} · {o.customer}</div>
                  <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>{o.product} · {o.qty.toLocaleString()} units · placed {o.placed}</div>
                </div>
                <span className={`badge ${STATUS_TONE[o.status]}`}>{o.status}</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", marginBottom: readOnly ? 0 : 16 }}>
                {STATUS_STEPS.map((step, i) => (
                  <React.Fragment key={step}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 70 }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 700,
                        background: i <= idx ? "var(--blue)" : "var(--border)",
                        color: i <= idx ? "#fff" : "var(--muted)",
                      }}>{i < idx ? "✓" : i + 1}</div>
                      <div style={{ fontSize: 10.5, fontWeight: 600, color: i <= idx ? "var(--navy)" : "var(--muted)" }}>{step}</div>
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div style={{ flex: 1, height: 2, background: i < idx ? "var(--blue)" : "var(--border)", marginBottom: 18 }} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {!readOnly && o.status !== "Delivered" && (
                <button className="btn btn-primary" style={{ fontSize: 12.5, padding: "8px 16px" }} onClick={() => advance(o)}>
                  Mark as {STATUS_STEPS[idx + 1]} →
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination Bar */}
      <div style={{ background: "var(--card-bg, #fff)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
}
