import mongoose from "mongoose";

const salesSchema = new mongoose.Schema(
  {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: String,
        price: Number,
        cost: Number,
        quantity: Number,
        total: Number,
      },
    ],
    totalAmount: Number,
    totalProfit: Number,
    refunded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Sale", salesSchema);
