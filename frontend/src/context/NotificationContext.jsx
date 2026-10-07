import React, { createContext, useContext, useState, useEffect } from "react";
import { notificationApi } from "../services/api";

const NotificationContext = createContext(null);
const STORAGE_KEY = "ise_notifications";

function defaultNotifications() {
  return [
    { id: "n1", audience: "admin", title: "Low stock alert", body: "Cedarwood Chips running low at Salem Unit.", time: Date.now() - 1000 * 60 * 40, read: false },
    { id: "n2", audience: "admin", title: "Order shipped", body: "Order #ORD-2031 for Sri Balaji Traders has shipped.", time: Date.now() - 1000 * 60 * 120, read: false },
    { id: "n3", audience: "employee", title: "Shift reminder", body: "Your morning shift starts at 8:00 AM tomorrow.", time: Date.now() - 1000 * 60 * 200, read: true },
  ];
}

function loadNotifications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultNotifications();
  } catch {
    return defaultNotifications();
  }
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(loadNotifications);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  // Sync notifications from Backend API / MongoDB on mount
  useEffect(() => {
    notificationApi.getAll()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setNotifications(res.data);
        }
      })
      .catch((err) => console.log("Using cached notifications:", err.message));
  }, []);

  // Keep notifications in sync across browser tabs
  useEffect(() => {
    function onStorage(e) {
      if (e.key === STORAGE_KEY && e.newValue) {
        setNotifications(JSON.parse(e.newValue));
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  async function push(audience, title, body) {
    const newNotif = {
      id: "n" + Date.now() + Math.random().toString(36).slice(2, 6),
      audience,
      title,
      body,
      time: Date.now(),
      read: false
    };

    setNotifications((prev) => [newNotif, ...prev]);

    try {
      await notificationApi.create({ audience, title, body });
    } catch (err) {
      console.warn("Backend notification sync failed:", err.message);
    }
  }

  async function markRead(id) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

    try {
      await notificationApi.markRead(id);
    } catch (err) {
      console.warn("Backend markRead sync failed:", err.message);
    }
  }

  async function markAllRead(audience) {
    setNotifications((prev) => prev.map((n) => (n.audience === audience ? { ...n, read: true } : n)));

    try {
      await notificationApi.markAllRead(audience);
    } catch (err) {
      console.warn("Backend markAllRead sync failed:", err.message);
    }
  }

  function forAudience(audience) {
    return notifications.filter((n) => n.audience === audience).sort((a, b) => b.time - a.time);
  }

  function unreadCount(audience) {
    return notifications.filter((n) => n.audience === audience && !n.read).length;
  }

  return (
    <NotificationContext.Provider value={{ push, markRead, markAllRead, forAudience, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
