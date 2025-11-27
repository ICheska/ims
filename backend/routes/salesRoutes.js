import express from "express";
import { createSale, getSalesHistory, getSales } from "../controllers/salesController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";


const router = express.Router();

// Create Sale
router.post("/create", createSale);

// CREATE SALE
/*router.post("/", protect, adminOnly, createSale);*/

// Get All Sales
router.get("/", adminOnly, getSales);

// GET ALL SALES HISTORY
router.get("/history", protect, adminOnly, getSalesHistory);


export default router;

