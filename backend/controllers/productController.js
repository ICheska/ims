import Product from "../models/productModel.js";
//<<<<<<< HEAD
import StockReceived from "../models/stockReceived.js";


//w
export const getUserProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ productName: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to load products" });
  }
};

// Create product //o
export const createProduct = async (req, res) => {
  try {
    const newProduct = new Product({
      ...req.body,
      image: req.file ? req.file.filename : null,
    });
    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Get all products //o
/*export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    const lowStockItems = products.filter(
      (p) => p.stock <= p.lowStockThreshold
    );
    res.json({ products, lowStockItems });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
*/
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    // FIX: Ensure quantity is returned even if DB still uses "stock"
    const updatedProducts = products.map(p => ({
      ...p._doc,
      quantity: p.quantity ?? p.stock ?? 0,
    }));

    res.json({ products: updatedProducts });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// Get product by ID //o
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




// Update product //o
export const updateProduct = async (req, res) => {
  try {
    const updatedData = { ...req.body };
    if (req.file) updatedData.image = req.file.filename;
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




// Delete product //w
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET STOCK HISTORY //w
export const getStockHistory = async (req, res) => {
  try {
    const history = await StockReceived.find({
      product: req.params.id,
    }).populate("user", "name");

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stock history" });
  }
};


// ADD STOCK (Used by AddStock.jsx)
export const addStock = async (req, res) => {

  // ✅ ADD THIS LINE (shows sent quantity + product ID)
  console.log("📥 Add Stock Route Hit!", {
    body: req.body,
    params: req.params,
  });

  try {
    const qty = Number(req.body.quantity);
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!qty || qty <= 0) {
      return res.status(400).json({ message: "Quantity must be positive" });
    }

    // Update stock
    product.stock += qty;
    await product.save();

    // Record stock log
    await StockReceived.create({
      product: req.params.id,
      quantity: qty,
      dateReceived: new Date(),
      notes: "Stock added through AddStock page",
    });

    return res.status(200).json({
      message: "Stock updated successfully",
      newStock: product.stock,
    });

  } catch (error) {

    // ✅ IMPORTANT: show the actual backend error
    console.error("Add stock error:", error);

    return res.status(500).json({ message: "Server error" });
  }


  

};

