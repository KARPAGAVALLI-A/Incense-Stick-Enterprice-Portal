import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../services/dbService";
import { employeeApi, orderApi, taskApi } from "../services/api";
import { PRODUCTS } from "../data/mockData";

const DataContext = createContext(null);
const ORD_KEY = "ise_orders";
const TASK_KEY = "ise_tasks";

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

const SEED_ORDERS = [
  { id: "ORD-2031", customer: "Sri Balaji Traders", product: "Rose Sandalwood Premium", qty: 3000, status: "Shipped", placed: "10 Jul 2026", updated: "13 Jul 2026" },
  { id: "ORD-2032", customer: "Devi Exports", product: "Rose Sandalwood Premium", qty: 3800, status: "Processing", placed: "11 Jul 2026", updated: "12 Jul 2026" },
  { id: "ORD-2033", customer: "Annapoorna Pooja Store", product: "Jasmine Natural Masala", qty: 1200, status: "Placed", placed: "13 Jul 2026", updated: "13 Jul 2026" },
  { id: "ORD-2034", customer: "Meenakshi Agencies", product: "Jasmine Natural Masala", qty: 3000, status: "Delivered", placed: "05 Jul 2026", updated: "11 Jul 2026" },
];

export const STATUS_STEPS = ["Placed", "Processing", "Shipped", "Delivered"];
export const TASK_STEPS = ["Assigned", "In Progress", "Completed"];

const SEED_TASKS = [
  { id: "TSK-001", productId: "PRD-003", productName: "Cedarwood Dhoop Stick", employeeId: "EMP-1042", employeeName: "Muthu Selvam", qty: 1500, status: "In Progress", assignedBy: "Ravi Kumar", assignedDate: "13 Jul 2026", note: "Cedarwood Chips shortage — priority roll" },
];

export function getStockList() {
  const rows = [];
  PRODUCTS.forEach((p) => {
    p.materials.forEach((m) => {
      rows.push({ product: p.name, productId: p.id, icon: p.icon, ...m });
    });
  });
  return rows;
}

export function DataProvider({ children }) {
  const [employees, setEmployees] = useState(() => db.getEmployees());
  const [orders, setOrders] = useState(() => load(ORD_KEY, SEED_ORDERS));
  const [tasks, setTasks] = useState(() => load(TASK_KEY, SEED_TASKS));

  // Sync to local storage for instant offline availability
  useEffect(() => { db.saveEmployees(employees); }, [employees]);
  useEffect(() => { localStorage.setItem(ORD_KEY, JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem(TASK_KEY, JSON.stringify(tasks)); }, [tasks]);

  // Fetch live records from Backend API / MongoDB on mount
  useEffect(() => {
    employeeApi.getAll()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setEmployees(res.data);
        }
      })
      .catch((err) => console.log("Using cached employees:", err.message));

    orderApi.getAll()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setOrders(res.data);
        }
      })
      .catch((err) => console.log("Using cached orders:", err.message));

    taskApi.getAll()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setTasks(res.data);
        }
      })
      .catch((err) => console.log("Using cached tasks:", err.message));
  }, []);

  async function addEmployee(emp) {
    // Optimistic / Local update
    const updated = db.addEmployee(emp);
    setEmployees(updated);

    // Sync with backend API
    try {
      await employeeApi.create(emp);
    } catch (err) {
      console.warn("Backend sync failed for addEmployee:", err.message);
    }
  }

  async function updateEmployee(id, fields) {
    const updated = db.updateEmployee(id, fields);
    setEmployees(updated);

    try {
      await employeeApi.update(id, fields);
    } catch (err) {
      console.warn("Backend sync failed for updateEmployee:", err.message);
    }
  }

  async function removeEmployee(id) {
    const updated = db.removeEmployee(id);
    setEmployees(updated);

    try {
      await employeeApi.delete(id);
    } catch (err) {
      console.warn("Backend sync failed for removeEmployee:", err.message);
    }
  }

  async function updateOrderStatus(orderId, status) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status, updated: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) }
          : o
      )
    );

    try {
      await orderApi.updateStatus(orderId, status);
    } catch (err) {
      console.warn("Backend sync failed for updateOrderStatus:", err.message);
    }
  }

  async function addTask(task) {
    const id = "TSK-" + String(tasks.length + 1).padStart(3, "0");
    const newTask = {
      id,
      status: "Assigned",
      assignedDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      ...task,
    };
    setTasks((prev) => [newTask, ...prev]);

    try {
      await taskApi.create(newTask);
    } catch (err) {
      console.warn("Backend sync failed for addTask:", err.message);
    }
    return newTask;
  }

  async function updateTaskStatus(taskId, status) {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)));

    try {
      await taskApi.updateStatus(taskId, status);
    } catch (err) {
      console.warn("Backend sync failed for updateTaskStatus:", err.message);
    }
  }

  return (
    <DataContext.Provider
      value={{
        employees,
        addEmployee,
        updateEmployee,
        removeEmployee,
        orders,
        updateOrderStatus,
        tasks,
        addTask,
        updateTaskStatus,
        db
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
