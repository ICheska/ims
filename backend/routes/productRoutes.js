import express from "express";
import multer from "multer";


import { getUserProducts } from "../controllers/productController.js";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addStock,

} from "../controllers/productController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";



const router = express.Router();

// Multer setup for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });


router.put("/:id/addStock", addStock);

// === Routes ===

// PRODUCT ROUTES
router.get("/user", protect, getUserProducts);  
router.put("/:id/addStock", protect, addStock);


// Anyone logged in can view products
router.get("/", protect, getProducts);
router.get("/:id", protect, getProductById);

// Admin only
router.post("/", protect, adminOnly, upload.single("image"), createProduct);
router.put("/:id", protect, adminOnly, upload.single("image"), updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

// User only (employee) can add stock
router.put("/addstock/:id", protect, addStock);

export default router;

