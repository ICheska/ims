// salesStatsController.js
import Sales from "../models/SalesModel.js";

// Get sales statistics
export const getSalesStats = async (req, res) => {
  try {
    const sales = await Sales.find();

    let totalSales = 0;
    let totalProfit = 0;

    sales.forEach((s) => {
      totalSales += s.totalAmount || 0;
      totalProfit += s.totalProfit || 0;
    });

    res.json({
      totalSales,
      totalProfit,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales stats", error });
  }
};

// ========================
// salesController.js
// ========================
import Sales from "../models/SalesModel.js";
import { getSalesStats } from "./salesStatsController.js";

// Create Sale
export const createSale = async (req, res) => {
  try {
    const sale = new Sales(req.body);
    await sale.save();
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: "Error creating sale", error });
  }
};

// Get Sales History
export const getSalesHistory = async (req, res) => {
  try {
    const sales = await Sales.find();
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching history", error });
  }
};

// Get All Sales
export const getSales = async (req, res) => {
  try {
    const sales = await Sales.find();
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales", error });
  }
};

// Refund Sale
export const refundSale = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sales.findById(id);
    if (!sale) return res.status(404).json({ message: "Sale not found" });

    sale.isRefunded = true;
    await sale.save();

    res.json({ message: "Sale refunded" });
  } catch (error) {
    res.status(500).json({ message: "Error refunding sale", error });
  }
};

export { getSalesStats };

// ========================
// salesRoutes.js
// ========================
import express from "express";
import {
  createSale,
  getSalesHistory,
  getSales,
  refundSale,
} from "../controllers/salesController.js";
import { getSalesStats } from "../controllers/salesStatsController.js";

const router = express.Router();

router.post("/create", createSale);
router.get("/history", getSalesHistory);
router.get("/", getSales);
router.put("/refund/:id", refundSale);
router.get("/stats", getSalesStats);

export default router;
