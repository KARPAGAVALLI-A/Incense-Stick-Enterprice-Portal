import { EMPLOYEES, INVENTORY_ITEMS, WAREHOUSES } from "../data/mockData";

const DB_KEYS = {
  EMPLOYEES: "ise_db_employees",
  ORDERS: "ise_db_orders",
  INVENTORY: "ise_db_inventory",
  WEATHER_LOGS: "ise_db_weather_logs",
  FEEDBACK: "ise_db_feedback"
};

class DatabaseService {
  constructor() {
    this.initDatabase();
  }

  initDatabase() {
    // Seed 50 employees if not present in DB
    if (!localStorage.getItem(DB_KEYS.EMPLOYEES)) {
      localStorage.setItem(DB_KEYS.EMPLOYEES, JSON.stringify(EMPLOYEES));
    }
    // Seed inventory if not present
    if (!localStorage.getItem(DB_KEYS.INVENTORY)) {
      localStorage.setItem(DB_KEYS.INVENTORY, JSON.stringify(INVENTORY_ITEMS));
    }
  }

  // --- EMPLOYEES CRUD ---
  getEmployees() {
    try {
      const data = localStorage.getItem(DB_KEYS.EMPLOYEES);
      return data ? JSON.parse(data) : EMPLOYEES;
    } catch {
      return EMPLOYEES;
    }
  }

  saveEmployees(list) {
    localStorage.setItem(DB_KEYS.EMPLOYEES, JSON.stringify(list));
  }

  addEmployee(emp) {
    const list = this.getEmployees();
    const updated = [emp, ...list];
    this.saveEmployees(updated);
    return updated;
  }

  // --- INVENTORY CRUD ---
  getInventory() {
    try {
      const data = localStorage.getItem(DB_KEYS.INVENTORY);
      return data ? JSON.parse(data) : INVENTORY_ITEMS;
    } catch {
      return INVENTORY_ITEMS;
    }
  }

  saveInventory(list) {
    localStorage.setItem(DB_KEYS.INVENTORY, JSON.stringify(list));
  }

  // --- BACKUP & EXPORT ---
  exportBackup() {
    const backup = {
      timestamp: new Date().toISOString(),
      employees: this.getEmployees(),
      inventory: this.getInventory()
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ise-system-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

export const db = new DatabaseService();
