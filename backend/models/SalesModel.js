import mongoose from "mongoose";

const salesSchema = new mongoose.Schema(
  {
    items: [
      {
        _id: String,
        name: String,
        company: String,
        price: Number,
        quantity: Number,
        total: Number,
      },
    ],
    totalAmount: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Sale", salesSchema);
