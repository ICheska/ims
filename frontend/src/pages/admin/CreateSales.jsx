import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";
import Navbar from "../../components/Navbar";

export default function CreateSales() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Fetch products with token
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("PRODUCTS FROM BACKEND:", res.data);

        // Handle API responses consistently
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.products;

        setProducts(data || []);
      } catch (error) {
        console.log("Error loading products:", error.response?.data || error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  // Add item to cart
  const addToCart = () => {
    if (!selectedProduct) return alert("Select a product first!");

    const product = products.find((p) => p._id === selectedProduct);
    if (!product) return;

    if (quantity <= 0) return alert("Quantity must be greater than 0!");
    if (quantity > product.quantity)
      return alert("Not enough stock available!");

    const exists = cart.find((item) => item._id === product._id);
    if (exists) return alert("Item is already in cart!");

    const item = {
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity,
      total: product.price * quantity,
    };

    setCart([...cart, item]);
    setSelectedProduct("");
    setQuantity(1);
  };

  // Remove item
  const removeItem = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  // Compute total
  const grandTotal = cart.reduce((acc, item) => acc + item.total, 0);

  // Submit sale to backend
  const submitSale = async () => {
    if (cart.length === 0) return alert("Cart is empty!");

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/sales/create",
        {
          items: cart,
          totalAmount: grandTotal,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Sale completed!");
      setCart([]);
    } catch (error) {
      console.log("Error submitting sale:", error.response?.data || error);
      alert("Error processing sale.");
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />

      <div className="admin-content">
        <h1 style={{ marginTop: "20px" }}>Create Sales</h1>

        {/* Product Selection */}
        <div className="sales-form">
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">Select Product...</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} — Stock: {p.quantity}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            placeholder="Quantity"
          />

          <button onClick={addToCart}>Add to Cart</button>
        </div>

        {/* Cart Table */}
        <table className="sales-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price (₱)</th>
              <th>Quantity</th>
              <th>Total (₱)</th>
              <th>Remove</th>
            </tr>
          </thead>

          <tbody>
            {cart.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>{item.stock}</td>
                <td>{item.total}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => removeItem(item._id)}
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}

            {cart.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No items added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Total + Submit */}
        <div className="sales-total">
          <h2>Total: ₱{grandTotal}</h2>
          <button className="submit-btn" onClick={submitSale}>
            Complete Sale
          </button>
        </div>
      </div>
    </div>
  );
}

