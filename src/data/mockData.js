export const PRODUCTS = [
  {
    id: "PRD-001", icon: "🌹", name: "Rose Sandalwood Premium", status: "In Progress",
    tone: "blue", inProd: 3200, target: 5000, pct: 64, stock: 4120, orders: 6800, toComplete: 2680,
    materials: [
      { name: "Bamboo Core Sticks", need: 5000, avail: 8200, status: "Sufficient", tone: "green" },
      { name: "Rose Fragrance Oil", need: 40, avail: 52, status: "Sufficient", tone: "green" },
      { name: "Sandalwood Powder", need: 120, avail: 95, status: "Low Stock", tone: "amber" },
    ],
  },
  {
    id: "PRD-002", icon: "🌿", name: "Jasmine Natural Masala", status: "In Progress",
    tone: "blue", inProd: 2100, target: 4000, pct: 53, stock: 340, orders: 4200, toComplete: 3860,
    materials: [
      { name: "Bamboo Core Sticks", need: 4000, avail: 3900, status: "Low Stock", tone: "amber" },
      { name: "Jasmine Fragrance Oil", need: 35, avail: 10, status: "Shortage", tone: "red" },
      { name: "Masala Base Powder", need: 150, avail: 210, status: "Sufficient", tone: "green" },
    ],
  },
  {
    id: "PRD-003", icon: "🪵", name: "Cedarwood Dhoop Stick", status: "On Hold",
    tone: "red", inProd: 0, target: 3000, pct: 0, stock: 0, orders: 2500, toComplete: 2500,
    materials: [
      { name: "Cedarwood Chips", need: 3000, avail: 400, status: "Shortage", tone: "red" },
      { name: "Dhoop Binding Resin", need: 80, avail: 25, status: "Shortage", tone: "red" },
    ],
  },
  {
    id: "PRD-004", icon: "🌸", name: "Lavender Floral Standard", status: "Completed",
    tone: "green", inProd: 4000, target: 4000, pct: 100, stock: 2860, orders: 1800, toComplete: 0,
    materials: [
      { name: "Bamboo Core Sticks", need: 4000, avail: 6000, status: "Sufficient", tone: "green" },
      { name: "Lavender Fragrance Oil", need: 30, avail: 44, status: "Sufficient", tone: "green" },
    ],
  },
  {
    id: "PRD-005", icon: "🔥", name: "Camphor Temple Premium", status: "In Progress",
    tone: "blue", inProd: 1900, target: 2500, pct: 76, stock: 180, orders: 2200, toComplete: 2020,
    materials: [
      { name: "Camphor Blocks", need: 2500, avail: 2100, status: "Low Stock", tone: "amber" },
      { name: "Bamboo Core Sticks", need: 2500, avail: 3400, status: "Sufficient", tone: "green" },
    ],
  },
  {
    id: "PRD-006", icon: "🍋", name: "Lemon Grass Fresh", status: "Completed",
    tone: "green", inProd: 5000, target: 5000, pct: 100, stock: 5460, orders: 1400, toComplete: 0,
    materials: [
      { name: "Bamboo Core Sticks", need: 5000, avail: 7100, status: "Sufficient", tone: "green" },
      { name: "Lemon Grass Oil", need: 38, avail: 60, status: "Sufficient", tone: "green" },
    ],
  },
];

export const EMPLOYEES = [
  { id: "EMP-1042", name: "Muthu Selvam", dept: "Rolling Unit", status: "Present", production: 6240, manager: "Priya Manager" },
  { id: "EMP-1055", name: "Kavya Priya", dept: "Rolling Unit", status: "Present", production: 5810, manager: "Priya Manager" },
  { id: "EMP-1061", name: "Arun Prakash", dept: "Drying & Packing", status: "Half Day", production: 2980, manager: "Priya Manager" },
  { id: "EMP-1073", name: "Deepa Lakshmi", dept: "Rolling Unit", status: "Absent", production: 0, manager: "Priya Manager" },
  { id: "EMP-1088", name: "Suresh Babu", dept: "Quality Check", status: "On Leave", production: 0, manager: "Priya Manager" },
];

export const WAREHOUSES = [
  { id: "WH-01", name: "Salem WH-01", location: "Salem, Tamil Nadu", capacity: 10000, used: 6800 },
  { id: "WH-02", name: "Chennai WH-02", location: "Chennai, Tamil Nadu", capacity: 8000, used: 7040 },
  { id: "WH-03", name: "Madurai WH-03", location: "Madurai, Tamil Nadu", capacity: 6000, used: 2520 },
];

export const INVENTORY_ITEMS = [
  { id: "PRD-001", icon: "🌹", name: "Rose Sandalwood Premium", tag: "PRD-001 · Premium", warehouse: "Salem WH-01", stock: 4120, reorderLevel: 500, status: "In Stock", tone: "green" },
  { id: "PRD-002", icon: "🌿", name: "Jasmine Natural Masala", tag: "PRD-002 · Masala", warehouse: "Salem WH-01", stock: 340, reorderLevel: 400, status: "Low Stock", tone: "amber" },
  { id: "PRD-003", icon: "🪵", name: "Cedarwood Dhoop Stick", tag: "PRD-003 · Dhoop", warehouse: "Chennai WH-02", stock: 0, reorderLevel: 300, status: "Out of Stock", tone: "red" },
  { id: "PRD-004", icon: "🌸", name: "Lavender Floral Standard", tag: "PRD-004 · Standard", warehouse: "Madurai WH-03", stock: 2860, reorderLevel: 600, status: "In Stock", tone: "green" },
  { id: "PRD-005", icon: "🔥", name: "Camphor Temple Premium", tag: "PRD-005 · Premium", warehouse: "Salem WH-01", stock: 180, reorderLevel: 250, status: "Low Stock", tone: "amber" },
  { id: "PRD-006", icon: "🍋", name: "Lemon Grass Fresh", tag: "PRD-006 · Standard", warehouse: "Chennai WH-02", stock: 5460, reorderLevel: 400, status: "In Stock", tone: "green" },
];

export const PAST_EMPLOYEES = [
  { id: "EMP-0912", name: "Vignesh G.", dept: "Rolling Unit", joined: "04 Jan 2023", left: "28 Feb 2026", total: 482600, reason: "Resigned" },
  { id: "EMP-0877", name: "Pooja R.", dept: "Drying & Packing", joined: "18 Aug 2022", left: "15 May 2026", total: 391200, reason: "Resigned" },
  { id: "EMP-0803", name: "Karthik M.", dept: "Quality Check", joined: "02 Mar 2022", left: "10 Apr 2026", total: 215400, reason: "Terminated" },
];
