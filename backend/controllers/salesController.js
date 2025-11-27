import Sale from "../models/SalesModel.js";
import Product from "../models/productModel.js";

// --------------------------------------------------
// CREATE SALE (fixed to match your frontend structure)
// --------------------------------------------------
export const createSale = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalProfit = 0;

    for (const item of items) {
      const productId = item.productId || item._id; // FIX
      const sellingPrice = item.sellingPrice || item.price || 0; // FIX

      const product = await Product.findById(productId);

      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.name}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`,
        });
      }

      const cost = product.costPrice || 0;

      totalProfit += (sellingPrice - cost) * item.quantity;

      // Deduct stock
      product.stock -= item.quantity;
      await product.save();
    }

    const sale = await Sale.create({
      items,
      totalAmount,
      totalProfit,
      refunded: false,
      createdAt: new Date(),
    });

    res.status(201).json(sale);
  } catch (error) {
    console.error("Error creating sale:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// --------------------------------------------------
// GET SALES
// --------------------------------------------------
export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// --------------------------------------------------
// SALES HISTORY
// --------------------------------------------------
export const getSalesHistory = async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.json({ success: true, sales });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch sales history" });
  }
};

// --------------------------------------------------
// DAILY SALES SUMMARY (🔥 REQUIRED FOR CHART)
// --------------------------------------------------
export const getDailySalesSummary = async (req, res) => {
  try {
    const summary = await Sale.aggregate([
      { $match: { refunded: false } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          totalSales: { $sum: "$totalAmount" },
          totalProfit: { $sum: "$totalProfit" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(
      summary.map((s) => ({
        date: s._id,
        sales: s.totalSales,
        profit: s.totalProfit,
      }))
    );
  } catch (error) {
    console.error("Daily summary error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// --------------------------------------------------
// REFUND SALE
// --------------------------------------------------
export const refundSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);

    if (!sale) return res.status(404).json({ message: "Sale not found" });
    if (sale.refunded)
      return res.status(400).json({ message: "Sale already refunded" });

    for (const item of sale.items) {
      const productId = item.productId || item._id; // FIX
      await Product.findByIdAndUpdate(productId, {
        $inc: { stock: item.quantity },
      });
    }

    sale.refunded = true;
    await sale.save();

    res.json({ success: true, message: "Sale refunded", sale });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// --------------------------------------------------
// SALES STATS (Total revenue, profit, count)
// --------------------------------------------------
export const getSalesStats = async (req, res) => {
  try {
    const stats = await Sale.aggregate([
      { $match: { refunded: false } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalProfit: { $sum: "$totalProfit" },
          totalSales: { $sum: 1 },
        },
      },
    ]);

    res.json(stats[0] || { totalRevenue: 0, totalProfit: 0, totalSales: 0 });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
