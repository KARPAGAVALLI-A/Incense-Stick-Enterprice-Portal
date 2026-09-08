import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../services/dbService";
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
  // Always query database service for 50 employees
  const [employees, setEmployees] = useState(() => db.getEmployees());
  const [orders, setOrders] = useState(() => load(ORD_KEY, SEED_ORDERS));
  const [tasks, setTasks] = useState(() => load(TASK_KEY, SEED_TASKS));

  useEffect(() => { db.saveEmployees(employees); }, [employees]);
  useEffect(() => { localStorage.setItem(ORD_KEY, JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem(TASK_KEY, JSON.stringify(tasks)); }, [tasks]);

  function addEmployee(emp) {
    const updated = db.addEmployee(emp);
    setEmployees(updated);
  }

  function updateEmployee(id, fields) {
    const updated = db.updateEmployee(id, fields);
    setEmployees(updated);
  }

  function removeEmployee(id) {
    const updated = db.removeEmployee(id);
    setEmployees(updated);
  }

  function updateOrderStatus(orderId, status) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status, updated: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) }
          : o
      )
    );
  }

  function addTask(task) {
    const id = "TSK-" + String(tasks.length + 1).padStart(3, "0");
    const newTask = {
      id,
      status: "Assigned",
      assignedDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      ...task,
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }

  function updateTaskStatus(taskId, status) {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)));
  }

  return (
    <DataContext.Provider value={{ employees, addEmployee, updateEmployee, removeEmployee, orders, updateOrderStatus, tasks, addTask, updateTaskStatus, db }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
