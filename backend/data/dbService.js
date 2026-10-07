import mongoose from "mongoose";
import Employee from "../models/Employee.js";
import Order from "../models/Order.js";
import Task from "../models/Task.js";
import Inventory from "../models/Inventory.js";
import Product from "../models/Product.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { readDb, writeDb } from "./jsonDb.js";

function isMongo() {
  return mongoose.connection.readyState === 1;
}

// EMPLOYEES
export async function getEmployees() {
  if (isMongo()) {
    return await Employee.find().sort({ createdAt: -1 }).lean();
  }
  return readDb().employees || [];
}

export async function getEmployeeById(id) {
  if (isMongo()) {
    return await Employee.findOne({ id }).lean();
  }
  const emps = readDb().employees || [];
  return emps.find((e) => e.id === id) || null;
}

export async function addEmployee(empData) {
  if (isMongo()) {
    const created = await Employee.create(empData);
    return created.toObject();
  }
  const db = readDb();
  db.employees = [empData, ...(db.employees || [])];
  writeDb(db);
  return empData;
}

export async function updateEmployee(id, updateData) {
  if (isMongo()) {
    return await Employee.findOneAndUpdate({ id }, updateData, { new: true }).lean();
  }
  const db = readDb();
  db.employees = (db.employees || []).map((e) => (e.id === id ? { ...e, ...updateData } : e));
  writeDb(db);
  return db.employees.find((e) => e.id === id);
}

export async function deleteEmployee(id) {
  if (isMongo()) {
    await Employee.findOneAndDelete({ id });
    return true;
  }
  const db = readDb();
  db.employees = (db.employees || []).filter((e) => e.id !== id);
  writeDb(db);
  return true;
}

// ORDERS
export async function getOrders() {
  if (isMongo()) {
    return await Order.find().sort({ createdAt: -1 }).lean();
  }
  return readDb().orders || [];
}

export async function addOrder(orderData) {
  if (isMongo()) {
    const created = await Order.create(orderData);
    return created.toObject();
  }
  const db = readDb();
  db.orders = [orderData, ...(db.orders || [])];
  writeDb(db);
  return orderData;
}

export async function updateOrderStatus(id, status) {
  const updatedDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  if (isMongo()) {
    return await Order.findOneAndUpdate({ id }, { status, updated: updatedDate }, { new: true }).lean();
  }
  const db = readDb();
  db.orders = (db.orders || []).map((o) => (o.id === id ? { ...o, status, updated: updatedDate } : o));
  writeDb(db);
  return db.orders.find((o) => o.id === id);
}

// TASKS
export async function getTasks() {
  if (isMongo()) {
    return await Task.find().sort({ createdAt: -1 }).lean();
  }
  return readDb().tasks || [];
}

export async function addTask(taskData) {
  if (isMongo()) {
    const created = await Task.create(taskData);
    return created.toObject();
  }
  const db = readDb();
  db.tasks = [taskData, ...(db.tasks || [])];
  writeDb(db);
  return taskData;
}

export async function updateTaskStatus(id, status) {
  if (isMongo()) {
    return await Task.findOneAndUpdate({ id }, { status }, { new: true }).lean();
  }
  const db = readDb();
  db.tasks = (db.tasks || []).map((t) => (t.id === id ? { ...t, status } : t));
  writeDb(db);
  return db.tasks.find((t) => t.id === id);
}

// INVENTORY
export async function getInventory() {
  if (isMongo()) {
    return await Inventory.find().lean();
  }
  return readDb().inventory || [];
}

export async function updateInventoryItem(id, updateData) {
  if (isMongo()) {
    return await Inventory.findOneAndUpdate({ id }, updateData, { new: true }).lean();
  }
  const db = readDb();
  db.inventory = (db.inventory || []).map((i) => (i.id === id ? { ...i, ...updateData } : i));
  writeDb(db);
  return db.inventory.find((i) => i.id === id);
}

// PRODUCTS
export async function getProducts() {
  if (isMongo()) {
    return await Product.find().lean();
  }
  return readDb().products || [];
}

// NOTIFICATIONS
export async function getNotifications(audience) {
  if (isMongo()) {
    const filter = audience && audience !== "all" ? { audience: { $in: [audience, "all"] } } : {};
    return await Notification.find(filter).sort({ time: -1 }).lean();
  }
  const list = readDb().notifications || [];
  if (audience && audience !== "all") {
    return list.filter((n) => n.audience === audience || n.audience === "all").sort((a, b) => b.time - a.time);
  }
  return list.sort((a, b) => b.time - a.time);
}

export async function addNotification(notifData) {
  if (isMongo()) {
    const created = await Notification.create(notifData);
    return created.toObject();
  }
  const db = readDb();
  db.notifications = [notifData, ...(db.notifications || [])];
  writeDb(db);
  return notifData;
}

export async function markNotificationRead(id) {
  if (isMongo()) {
    return await Notification.findOneAndUpdate({ id }, { read: true }, { new: true }).lean();
  }
  const db = readDb();
  db.notifications = (db.notifications || []).map((n) => (n.id === id ? { ...n, read: true } : n));
  writeDb(db);
  return true;
}

export async function markAllNotificationsRead(audience) {
  if (isMongo()) {
    const filter = audience && audience !== "all" ? { audience } : {};
    await Notification.updateMany(filter, { read: true });
    return true;
  }
  const db = readDb();
  db.notifications = (db.notifications || []).map((n) => (audience && n.audience !== audience ? n : { ...n, read: true }));
  writeDb(db);
  return true;
}

// USERS
export async function findUserByEmail(email) {
  if (isMongo()) {
    return await User.findOne({ email: email.toLowerCase() }).lean();
  }
  const users = readDb().users || [];
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function createUser(userData) {
  if (isMongo()) {
    const created = await User.create({ ...userData, email: userData.email.toLowerCase() });
    return created.toObject();
  }
  const db = readDb();
  const normalized = { ...userData, email: userData.email.toLowerCase() };
  db.users = [normalized, ...(db.users || [])];
  writeDb(db);
  return normalized;
}
