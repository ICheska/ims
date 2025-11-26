import Sale from "../models/SalesModel.js";
import Product from "../models/productModel.js";

// Create Sale
export const createSale = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Check inventory + update stock
    for (const item of items) {
      const product = await Product.findById(item._id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`,
        });
      }

      // Deduct stock
      product.quantity -= item.quantity;
      await product.save();
    }

    // Save Sale
    const sale = await Sale.create({
      items,
      totalAmount,
    });

    res.status(201).json({
      message: "Sale created successfully",
      sale,
    });
  } catch (error) {
    console.error("Error creating sale:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all sales
export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ message: "Server error" });
  }
};


