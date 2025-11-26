import express from "express";
import { loginUser } from "../controllers/userController.js";
import { getUsers, deleteUser } from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);

// Admin only
router.get("/", protect, adminOnly, getUsers);
router.delete("/:id", protect, adminOnly, deleteUser);

export default router;
