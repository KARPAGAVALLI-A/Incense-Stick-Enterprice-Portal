import express from "express";
import { getInventory, updateInventoryItem } from "../data/dbService.js";

const router = express.Router();

// GET /api/inventory
router.get("/", async (req, res) => {
  try {
    const items = await getInventory();
    return res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/inventory/:id
router.put("/:id", async (req, res) => {
  try {
    const updated = await updateInventoryItem(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Inventory item not found" });
    }
    return res.json({ success: true, message: "Inventory updated", data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
