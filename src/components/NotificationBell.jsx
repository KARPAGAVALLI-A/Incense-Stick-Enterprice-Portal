import React, { useState, useRef, useEffect } from "react";
import { useNotifications } from "../context/NotificationContext";

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationBell({ audience }) {
  const { forAudience, unreadCount, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const list = forAudience(audience);
  const count = unreadCount(audience);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div
        onClick={() => setOpen((o) => !o)}
        style={{ width: 36, height: 36, borderRadius: 8, background: "var(--bg)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, position: "relative", cursor: "pointer" }}
      >
        🔔
        {count > 0 && (
          <span style={{ position: "absolute", top: -4, right: -4, minWidth: 16, height: 16, borderRadius: 99, background: "var(--red)", color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff", padding: "0 3px" }}>
            {count}
          </span>
        )}
      </div>

      {open && (
        <div style={{ position: "absolute", top: 44, right: 0, width: 320, background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "0 12px 32px rgba(15,23,42,0.14)", zIndex: 200, overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--navy)" }}>Notifications</div>
            {count > 0 && (
              <div onClick={() => markAllRead(audience)} style={{ fontSize: 11, fontWeight: 600, color: "var(--blue)", cursor: "pointer" }}>Mark all read</div>
            )}
          </div>
          <div style={{ maxHeight: 340, overflowY: "auto" }}>
            {list.length === 0 && (
              <div style={{ padding: "28px 16px", textAlign: "center", fontSize: 12.5, color: "var(--muted)" }}>No notifications yet</div>
            )}
            {list.map((n) => (
              <div
                key={n.id} onClick={() => markRead(n.id)}
                style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", cursor: "pointer", background: n.read ? "#fff" : "var(--blue-xs)" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  {!n.read && <span style={{ width: 6, height: 6, borderRadius: 99, background: "var(--blue)", flexShrink: 0 }} />}
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text)" }}>{n.title}</div>
                </div>
                <div style={{ fontSize: 11.5, color: "var(--slate)", marginBottom: 3 }}>{n.body}</div>
                <div style={{ fontSize: 10, color: "var(--muted)" }}>{timeAgo(n.time)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
