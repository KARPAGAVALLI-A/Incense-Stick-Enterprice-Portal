import express from "express";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser, addEmployee, getEmployees, addNotification } from "../data/dbService.js";
import { authenticateToken } from "../middleware/auth.js";
import { getMongoStatus } from "../config/db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "ise_enterprise_security_secret_key_2026";

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ success: false, message: "Valid email address is required" });
    }

    const domain = email.split("@")[1]?.toLowerCase() || "";
    let detectedRole = role || "admin";
    if (domain === "manager.com" || email.includes("manager")) detectedRole = "manager";
    else if (domain === "employee.com" || email.includes("employee")) detectedRole = "employee";

    const name = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    const payload = {
      email,
      role: detectedRole,
      name
    };

    const token = generateToken(payload);

    return res.json({
      success: true,
      message: "Authentication successful",
      token,
      user: payload
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, dept, email, password } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ success: false, message: "Valid email is required" });
    }
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Full name is required" });
    }

    // Determine ID
    const currentEmployees = await getEmployees();
    const nextNum = 1000 + currentEmployees.length + 1;
    const empId = `EMP-${nextNum}`;

    const newEmp = {
      id: empId,
      name: name.trim(),
      dept: dept || "Rolling Unit",
      status: "Present",
      production: 0,
      joined: new Date().toISOString().slice(0, 10),
      email: email.trim(),
      phone: "",
      salary: 18000
    };

    await addEmployee(newEmp);

    // Create user record
    await createUser({
      name: name.trim(),
      email: email.trim(),
      password: password || "Password@123",
      role: "employee"
    });

    // Fire notifications
    await addNotification({
      id: "n" + Date.now() + Math.random().toString(36).slice(2, 6),
      audience: "admin",
      title: "New employee registered",
      body: `${name.trim()} (${empId}) joined ${dept || "Rolling Unit"}. Profile stored in MongoDB.`,
      time: Date.now(),
      read: false
    });

    await addNotification({
      id: "n" + (Date.now() + 1) + Math.random().toString(36).slice(2, 6),
      audience: "employee",
      title: "Welcome to ISE System",
      body: `Hi ${name.trim()}, your profile has been registered in the enterprise database.`,
      time: Date.now(),
      read: false
    });

    const payload = {
      email,
      role: "employee",
      name: name.trim(),
      empId
    };
    const token = generateToken(payload);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: payload,
      employee: newEmp
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/google
router.post("/google", async (req, res) => {
  try {
    const { email, name, role } = req.body;
    const resolvedRole = role || "employee";
    const resolvedName = name || email.split("@")[0];

    const payload = {
      email,
      name: resolvedName,
      role: resolvedRole
    };
    const token = generateToken(payload);

    return res.json({
      success: true,
      token,
      user: payload
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/auth/me
router.get("/me", authenticateToken, async (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
});

// GET /api/auth/status
router.get("/status", (req, res) => {
  const status = getMongoStatus();
  return res.json({
    success: true,
    mongodb: status,
    message: status.connected
      ? "🍃 Connected to MongoDB! Database viewable in MongoDB Compass."
      : "⚠️ MongoDB not connected yet. Running in local persistence fallback mode."
  });
});

export default router;
