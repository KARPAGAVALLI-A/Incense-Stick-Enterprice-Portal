import express from "express";
import { getTasks, addTask, updateTaskStatus } from "../data/dbService.js";

const router = express.Router();

// GET /api/tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await getTasks();
    return res.json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/tasks
router.post("/", async (req, res) => {
  try {
    const { productName, employeeName, qty, note, productId, employeeId, assignedBy } = req.body;
    if (!productName || !employeeName) {
      return res.status(400).json({ success: false, message: "Product name and employee name are required" });
    }

    const currentTasks = await getTasks();
    const id = "TSK-" + String(currentTasks.length + 1).padStart(3, "0");

    const newTask = {
      id,
      productId: productId || "",
      productName,
      employeeId: employeeId || "",
      employeeName,
      qty: Number(qty) || 1000,
      status: "Assigned",
      assignedBy: assignedBy || "Admin",
      assignedDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      note: note || ""
    };

    const saved = await addTask(newTask);
    return res.status(201).json({ success: true, message: "Task assigned successfully", data: saved });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/tasks/:id/status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    const updated = await updateTaskStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    return res.json({ success: true, message: "Task status updated", data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
