import Product from "../models/productModel.js";
import StockIn from "../models/stockin.js";
import StockOut from "../models/stockout.js";
import InventoryLog from "../models/inventorylog.js";

// -----------------------------
// STOCK IN
// -----------------------------
export const StockInModel = async (req, res) => {
  try {
    const { productId, supplier, quantity, costPrice } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const beforeQty = product.stock;
    const afterQty = beforeQty + quantity;

    product.stock = afterQty;
    await product.save();

    await StockIn.create({
      product: productId,
      supplier,
      quantity,
      costPrice,
      performedBy: req.user._id,
    });

    await InventoryLog.create({
      product: productId,
      type: "IN",
      qtyChanged: quantity,
      beforeQty,
      afterQty,
      performedBy: req.user._id,
    });

    res.json({ message: "Stock In successful" });
  } catch (err) {
    res.status(500).json({ message: "Stock In failed", error: err.message });
  }
};

// -----------------------------
// STOCK OUT
// -----------------------------
export const StockOutModel = async (req, res) => {
  try {
    const { productId, quantity, type, reason } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (quantity > product.stock) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    const beforeQty = product.stock;
    const afterQty = beforeQty - quantity;

    product.stock = afterQty;
    await product.save();

    await StockOut.create({
      product: productId,
      quantity,
      type,
      reason,
      performedBy: req.user._id,
    });

    await InventoryLog.create({
      product: productId,
      type: "OUT",
      qtyChanged: quantity,
      beforeQty,
      afterQty,
      performedBy: req.user._id,
    });

    res.json({ message: "Stock Out successful" });
  } catch (err) {
    res.status(500).json({ message: "Stock Out failed", error: err.message });
  }
};

// -----------------------------
// INVENTORY LOGS
// -----------------------------
export const InventoryLogs = async (req, res) => {
  try {
    const logs = await InventoryLog.find()
      .populate("product", "name")
      .populate("performedBy", "name")
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Failed to load logs" });
  }
};
