import express from "express";
import { getProducts } from "../data/dbService.js";

const router = express.Router();

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const products = await getProducts();
    return res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
