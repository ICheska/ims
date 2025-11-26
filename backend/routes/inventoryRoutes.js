import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  StockInModel,
  StockOutModel,
  InventoryLogs,
} from "../controllers/inventoryController.js";

const router = express.Router();

// Routes
router.post("/stock-in", protect, StockInModel);
router.post("/stock-out", protect, StockOutModel);
router.get("/logs", protect, InventoryLogs);

export default router;
