import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PRODUCTS } from "../data/mockData";
import { useData } from "../context/DataContext";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const { employees } = useData();

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const q = query.trim().toLowerCase();

  // useMemo: only re-filter when the search text or employee list actually changes
  const matchedEmployees = useMemo(() => {
    return q ? employees.filter((e) => e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q)).slice(0, 4) : [];
  }, [q, employees]);

  const matchedProducts = useMemo(() => {
    return q ? PRODUCTS.filter((p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)).slice(0, 4) : [];
  }, [q]);

  const hasResults = matchedEmployees.length > 0 || matchedProducts.length > 0;

  // useCallback: stable function identities across re-renders
  const closeSearch = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  const handleSelectEmployee = useCallback(() => {
    navigate("/admin/employees");
    closeSearch();
  }, [navigate, closeSearch]);

  const handleSelectProduct = useCallback(() => {
    navigate("/admin/production");
    closeSearch();
  }, [navigate, closeSearch]);

  // Pressing Enter jumps straight to the first matching result (employee first, then product)
  const handleKeyDown = useCallback((e) => {
    if (e.key !== "Enter") return;
    if (matchedEmployees.length > 0) {
      handleSelectEmployee();
    } else if (matchedProducts.length > 0) {
      handleSelectProduct();
    }
  }, [matchedEmployees, matchedProducts, handleSelectEmployee, handleSelectProduct]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "7px 12px", width: 240 }}>
        <span style={{ fontSize: 13 }}>🔍</span>
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search employee or product…"
          style={{ border: "none", outline: "none", background: "transparent", fontSize: 13, color: "var(--text)", width: "100%" }}
        />
      </div>

      {open && q && (
        <div style={{ position: "absolute", top: 42, left: 0, width: 300, background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "0 12px 32px rgba(15,23,42,0.14)", zIndex: 200, overflow: "hidden" }}>
          {!hasResults && (
            <div style={{ padding: "20px 16px", textAlign: "center", fontSize: 12.5, color: "var(--muted)" }}>No results for "{query}"</div>
          )}
          {matchedEmployees.length > 0 && (
            <div>
              <div style={{ padding: "9px 16px 4px", fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Employees</div>
              {matchedEmployees.map((e) => (
                <div
                  key={e.id}
                  onClick={handleSelectEmployee}
                  style={{ padding: "9px 16px", cursor: "pointer", fontSize: 13 }}
                  onMouseEnter={(ev) => (ev.currentTarget.style.background = "var(--bg)")}
                  onMouseLeave={(ev) => (ev.currentTarget.style.background = "transparent")}
                >
                  <div style={{ fontWeight: 600, color: "var(--text)" }}>{e.name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{e.id} · {e.dept}</div>
                </div>
              ))}
            </div>
          )}
          {matchedProducts.length > 0 && (
            <div>
              <div style={{ padding: "9px 16px 4px", fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Products</div>
              {matchedProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={handleSelectProduct}
                  style={{ padding: "9px 16px", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}
                  onMouseEnter={(ev) => (ev.currentTarget.style.background = "var(--bg)")}
                  onMouseLeave={(ev) => (ev.currentTarget.style.background = "transparent")}
                >
                  <span>{p.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--text)" }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{p.id} · {p.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
