import express from "express";
import { userSummary } from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/user-summary", protect, userSummary);


export default router;



