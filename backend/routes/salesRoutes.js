import express from "express";
import {
  createSale,
  getSalesHistory,
  getSales,
  refundSale,
  getSalesStats,
} from "../controllers/salesController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Sale
router.post("/", protect, adminOnly, createSale);

// Get All Sales
router.get("/", protect, adminOnly, getSales);

// Get Sales History
router.get("/history", protect, adminOnly, getSalesHistory);

// Refund Sale
router.post("/:id/refund", protect, adminOnly, refundSale);

// Dashboard Stats (Total Sales & Profit)
router.get("/stats", protect, adminOnly, getSalesStats);

export default router;
