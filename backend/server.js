

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
///<<<<<<< HEAD

import connectDB from "./config/db.js";

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors());

// Serve uploaded images
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Routes imports
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";

//sales
import salesRoutes from "./routes/salesRoutes.js";

app.use("/api/sales", salesRoutes);

// ✅ Added this
/*

import customerRoutes from "./routes/customerRoutes.js";*/



app.get("/", (req, res) => {
  res.send("✅ IMS Cosmetics API is running...");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/inventory", inventoryRoutes);

// ✅ Added this
/*app.use("/api/customers", customerRoutes);*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});



