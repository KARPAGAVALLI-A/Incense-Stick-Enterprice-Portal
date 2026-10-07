import express from "express";
import {
  getEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee
} from "../data/dbService.js";

const router = express.Router();

// GET /api/employees
router.get("/", async (req, res) => {
  try {
    let list = await getEmployees();
    const { dept, status, search } = req.query;

    if (dept && dept !== "All") {
      list = list.filter((e) => e.dept.toLowerCase() === dept.toLowerCase());
    }
    if (status && status !== "All") {
      list = list.filter((e) => e.status.toLowerCase() === status.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q) ||
          e.dept.toLowerCase().includes(q)
      );
    }

    return res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/employees/:id
router.get("/:id", async (req, res) => {
  try {
    const emp = await getEmployeeById(req.params.id);
    if (!emp) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }
    return res.json({ success: true, data: emp });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/employees
router.post("/", async (req, res) => {
  try {
    const { name, dept, status, production, phone, email, salary } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Employee name is required" });
    }

    const currentList = await getEmployees();
    const nextId = req.body.id || `EMP-${1000 + currentList.length + 1}`;

    const newEmp = {
      id: nextId,
      name: name.trim(),
      dept: dept || "Rolling Unit",
      status: status || "Present",
      production: Number(production) || 0,
      joined: req.body.joined || new Date().toISOString().slice(0, 10),
      phone: phone || "",
      email: email || "",
      salary: Number(salary) || 18000
    };

    const saved = await addEmployee(newEmp);
    return res.status(201).json({ success: true, message: "Employee created successfully", data: saved });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/employees/:id
router.put("/:id", async (req, res) => {
  try {
    const updated = await updateEmployee(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }
    return res.json({ success: true, message: "Employee updated successfully", data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/employees/:id
router.delete("/:id", async (req, res) => {
  try {
    await deleteEmployee(req.params.id);
    return res.json({ success: true, message: "Employee deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
