import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../../context/SettingsContext";
import NotificationBell from "../../components/NotificationBell";
import SearchBar from "../../components/SearchBar";
import SettingsDropdown from "../../components/SettingsDropdown";
import AiChatbot from "../../components/AiChatbot";
import "./AdminLayout.css";

export default function AdminLayout() {
  const { role, name, logout } = useAuth();
  const { t } = useSettings();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!role) navigate("/login");
  }, [role, navigate]);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="brand">
            <div className="logo-icon">🪔</div>
            <div>
              <div className="name">ISE System</div>
              <div className="tag">{t("adminConsole")}</div>
            </div>
          </div>
        </div>
        <nav>
          <NavLink to="/admin" end className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
            <span className="icon">📊</span> {t("dashboard")}
          </NavLink>
          <NavLink to="/admin/customer-reach" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
            <span className="icon">🌐</span> Customer Reach
          </NavLink>
          <NavLink to="/admin/employees" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
            <span className="icon">👷</span> {t("employees")}
          </NavLink>
          <NavLink to="/admin/production" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
            <span className="icon">⚙️</span> {t("production")}
          </NavLink>
          <NavLink to="/admin/inventory" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
            <span className="icon">🏬</span> {t("inventory")}
          </NavLink>
          <NavLink to="/admin/stock" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
            <span className="icon">📦</span> {t("stock")}
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
            <span className="icon">🚚</span> {t("orders")}
          </NavLink>
          <NavLink to="/admin/team" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
            <span className="icon">🧑‍🤝‍🧑</span> {t("team")}
          </NavLink>
          <NavLink to="/admin/profit-loss" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
            <span className="icon">💹</span> {t("profitLoss")}
          </NavLink>
          <NavLink to="/admin/settings" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
            <span className="icon">🔧</span> {t("settings")}
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <div className="user-row">
            <div className="avatar">{(name || "A").slice(0, 2).toUpperCase()}</div>
            <div>
              <div className="uname">{name || "Admin"}</div>
              <div className="urole">Administrator</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>↩ {t("signOut")}</button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="topbar">
          <div className="breadcrumb">{t("adminConsole")}</div>
          <div className="topbar-right" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <SearchBar />
            <NotificationBell audience="admin" />
            <SettingsDropdown />
            {/* Topbar Sign Out Button */}
            <button
              className="topbar-logout-btn"
              onClick={handleLogout}
              title={t("signOut")}
              style={{
                padding: "6px 12px", borderRadius: 20, border: "1px solid var(--border)",
                background: "var(--card-bg, #fff)", color: "#DC2626", fontSize: 12,
                fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4
              }}
            >
              ↩ {t("signOut")}
            </button>
          </div>
        </div>
        <div className="content">
          <Outlet />
        </div>
      </main>

      {/* Floating AI Chatbot Widget */}
      <AiChatbot />
    </div>
  );
}
