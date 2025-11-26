import express from "express";
import { createSale, getSales } from "../controllers/salesController.js";

const router = express.Router();

// Create Sale
router.post("/create", createSale);

// Get All Sales
router.get("/", getSales);

export default router;

