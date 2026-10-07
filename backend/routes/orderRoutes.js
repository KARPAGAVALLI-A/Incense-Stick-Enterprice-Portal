import express from "express";
import { getOrders, addOrder, updateOrderStatus, addNotification } from "../data/dbService.js";

const router = express.Router();

// GET /api/orders
router.get("/", async (req, res) => {
  try {
    const orders = await getOrders();
    return res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/orders
router.post("/", async (req, res) => {
  try {
    const { customer, product, qty } = req.body;
    if (!customer || !product || !qty) {
      return res.status(400).json({ success: false, message: "Customer, product, and qty are required" });
    }

    const currentOrders = await getOrders();
    const id = req.body.id || `ORD-${2030 + currentOrders.length + 1}`;

    const newOrder = {
      id,
      customer: customer.trim(),
      product: product.trim(),
      qty: Number(qty),
      status: "Placed",
      placed: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      updated: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    };

    const saved = await addOrder(newOrder);

    await addNotification({
      id: "n" + Date.now(),
      audience: "admin",
      title: "New order placed",
      body: `Order ${id} for ${customer} (${qty} units) has been recorded in database.`,
      time: Date.now(),
      read: false
    });

    return res.status(201).json({ success: true, message: "Order created successfully", data: saved });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/orders/:id/status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    const updated = await updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    await addNotification({
      id: "n" + Date.now(),
      audience: "admin",
      title: `Order status updated: ${status}`,
      body: `Order #${req.params.id} for ${updated.customer} is now marked as ${status}.`,
      time: Date.now(),
      read: false
    });

    return res.json({ success: true, message: "Order status updated", data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
