import express from "express";
import {
  getNotifications,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead
} from "../data/dbService.js";

const router = express.Router();

// GET /api/notifications
router.get("/", async (req, res) => {
  try {
    const { audience } = req.query;
    const list = await getNotifications(audience);
    const unread = list.filter((n) => !n.read).length;
    return res.json({ success: true, count: list.length, unread, data: list });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/notifications
router.post("/", async (req, res) => {
  try {
    const { audience, title, body } = req.body;
    if (!title || !body) {
      return res.status(400).json({ success: false, message: "Title and body are required" });
    }

    const notif = {
      id: "n" + Date.now() + Math.random().toString(36).slice(2, 6),
      audience: audience || "admin",
      title,
      body,
      time: Date.now(),
      read: false
    };

    const saved = await addNotification(notif);
    return res.status(201).json({ success: true, data: saved });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/notifications/:id/read
router.patch("/:id/read", async (req, res) => {
  try {
    await markNotificationRead(req.params.id);
    return res.json({ success: true, message: "Notification marked as read" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/notifications/read-all
router.patch("/read-all", async (req, res) => {
  try {
    const { audience } = req.body;
    await markAllNotificationsRead(audience);
    return res.json({ success: true, message: `All notifications for ${audience || "all"} marked as read` });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
