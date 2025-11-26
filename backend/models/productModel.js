import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String },
    category: { type: String, default: "General" },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    description: { type: String },
    lowStockThreshold: { type: Number, default: 10 },
    image: { type: String },

  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
