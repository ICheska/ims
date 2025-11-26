import mongoose from "mongoose";

const stockInSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    supplier: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    costPrice: {
      type: Number,
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("StockIn", stockInSchema);
