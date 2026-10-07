import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  EMPLOYEES,
  INVENTORY_ITEMS,
  ORDERS,
  TASKS,
  PRODUCTS,
  NOTIFICATIONS,
  USERS
} from "./seedData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "db.json");

function getInitialData() {
  return {
    employees: EMPLOYEES,
    inventory: INVENTORY_ITEMS,
    orders: ORDERS,
    tasks: TASKS,
    products: PRODUCTS,
    notifications: NOTIFICATIONS,
    users: USERS
  };
}

export function readDb() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initial = getInitialData();
      fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), "utf8");
      return initial;
    }
    const content = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(content);
  } catch (err) {
    console.error("Error reading db.json, returning defaults:", err.message);
    return getInitialData();
  }
}

export function writeDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Error writing db.json:", err.message);
    return false;
  }
}
