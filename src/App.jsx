import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { NotificationProvider } from "./context/NotificationContext";
import { SettingsProvider } from "./context/SettingsContext";
import LoadingScreen from "./components/LoadingScreen";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EmployeeApp from "./pages/EmployeeApp";

import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Employees from "./pages/admin/Employees";
import EmployeeDetail from "./pages/admin/EmployeeDetail";
import Production from "./pages/admin/Production";
import Orders from "./pages/admin/Orders";
import Stock from "./pages/admin/Stock";
import Inventory from "./pages/admin/Inventory";
import InventoryDetail from "./pages/admin/InventoryDetail";
import ProfitLoss from "./pages/admin/ProfitLoss";
import TeamOverview from "./pages/admin/TeamOverview";
import Settings from "./pages/admin/Settings";
import CustomerReach from "./pages/admin/CustomerReach";
import IndiaFleetGpsMap from "./components/IndiaFleetGpsMap";

import ManagerLayout from "./pages/manager/ManagerLayout";
import ManagerHome from "./pages/manager/ManagerHome";
import ManagerOrders from "./pages/manager/ManagerOrders";
import ManagerStock from "./pages/manager/ManagerStock";
import ManagerInventory from "./pages/manager/ManagerInventory";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <SettingsProvider>
      <AuthProvider>
        <DataProvider>
          <NotificationProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/employee" element={<EmployeeApp />} />

              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="fleet-gps" element={<IndiaFleetGpsMap />} />
                <Route path="customer-reach" element={<CustomerReach />} />
                <Route path="employees" element={<Employees />} />
                <Route path="employees/:id" element={<EmployeeDetail />} />
                <Route path="production" element={<Production />} />
                <Route path="production/:id" element={<Production />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="inventory/:id" element={<InventoryDetail />} />
                <Route path="orders" element={<Orders />} />
                <Route path="stock" element={<Stock />} />
                <Route path="team" element={<TeamOverview />} />
                <Route path="profit-loss" element={<ProfitLoss />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              <Route path="/manager" element={<ManagerLayout />}>
                <Route index element={<ManagerHome />} />
                <Route path="orders" element={<ManagerOrders />} />
                <Route path="inventory" element={<ManagerInventory />} />
                <Route path="stock" element={<ManagerStock />} />
              </Route>
            </Routes>
          </NotificationProvider>
        </DataProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}
