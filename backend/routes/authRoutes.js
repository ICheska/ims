import express from "express";


import {  
  registerUser,
  loginUser,
  getUsers,
  deleteUser,
} from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// ADMIN ONLY ROUTES
router.get("/users", protect, adminOnly, getUsers);
router.delete("/users/:id", protect, adminOnly, deleteUser);


export default router;
