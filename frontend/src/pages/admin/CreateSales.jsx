import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";
import Navbar from "../../components/Navbar";
import "./CreateSales.css";

export default function CreateSales() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [companyInput, setCompanyInput] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = Array.isArray(res.data) ? res.data : res.data?.products;
        setProducts(data || []);
      } catch (err) {
        console.error("Error loading products:", err.response?.data || err);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = () => {
    if (!selectedProduct) return alert("Select a product first!");
    const product = products.find((p) => p._id === selectedProduct);
    if (!product) return;

    if (quantity <= 0) return alert("Quantity must be greater than 0!");
    if (quantity > product.quantity)
      return alert("Not enough stock available!");

    const exists = cart.find((item) => item._id === product._id);
    if (exists) return alert("Item is already in cart!");

    const costValue = Number(product.cost ?? product.purchasePrice ?? 0);

    const item = {
      _id: product._id,
      name: product.name,
      company: companyInput || product.company || "N/A",
      priceOriginal: product.price,
      priceOverride: product.price,
      quantity,
      discount: 0,
      discountType: "amount",
      cost: costValue,
      total: product.price * quantity,
      profit: Number((product.price - costValue) * quantity),
    };

    setCart([...cart, item]);
    setSelectedProduct("");
    setQuantity(1);
    setCompanyInput("");
  };

  const removeItem = (id) => {
    setCart(cart.filter((c) => c._id !== id));
  };

  const updateCartItem = (id, changes) => {
    setCart((cart) =>
      cart.map((it) => {
        if (it._id !== id) return it;

        const updated = { ...it, ...changes };

        const qty = Number(updated.quantity) || 0;
        const price = Number(updated.priceOverride) || 0;
        const cost = Number(updated.cost) || 0;

        let discountValue = 0;
        if (updated.discount) {
          const d = Number(updated.discount);
          discountValue =
            updated.discountType === "percent" ? (price * d) / 100 : d;
        }

        const finalUnitPrice = Math.max(0, price - discountValue);

        updated.total = Number((finalUnitPrice * qty).toFixed(2));

        const perUnitProfit = price - cost - discountValue;
        updated.profit = Number((perUnitProfit * qty).toFixed(2));

        return updated;
      })
    );
  };

  const grandTotal = cart.reduce((sum, i) => sum + Number(i.total), 0);
  const grandProfit = cart.reduce((sum, i) => sum + Number(i.profit), 0);

  const submitSale = async () => {
    if (cart.length === 0) return alert("Cart is empty!");

    try {
      const token = localStorage.getItem("token");

      const payload = {
        items: cart,
        totalAmount: grandTotal,
      };

      // ✅ FIXED: removed /create
      await axios.post("http://localhost:5000/api/sales", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Sale completed!");
      setCart([]);
    } catch (err) {
      console.error("Error submitting sale:", err.response?.data || err);
      alert("Error processing sale.");
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-content">
        <h1>Create Sales</h1>

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
            type="text"
            placeholder="Company"
            value={companyInput}
            onChange={(e) => setCompanyInput(e.target.value)}
          />

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            placeholder="Quantity"
          />

          <button onClick={addToCart}>Add to Cart</button>
        </div>

        <div className="table-wrapper">
          <table className="sales-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Company</th>
                <th>Price (₱)</th>
                <th>Discount</th>
                <th>Qty</th>
                <th>Total (₱)</th>
                <th>Profit (₱)</th>
                <th>Remove</th>
              </tr>
            </thead>

            <tbody>
              {cart.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.company}</td>

                  <td>
                    <input
                      type="number"
                      value={item.priceOverride}
                      onChange={(e) =>
                        updateCartItem(item._id, {
                          priceOverride: Number(e.target.value),
                        })
                      }
                      style={{ width: 90 }}
                    />
                    <div style={{ fontSize: 12, color: "#666" }}>
                      orig: {item.priceOriginal}
                    </div>
                  </td>

                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <input
                        type="number"
                        value={item.discount}
                        onChange={(e) =>
                          updateCartItem(item._id, {
                            discount: Number(e.target.value),
                          })
                        }
                        style={{ width: 70 }}
                      />
                      <select
                        value={item.discountType}
                        onChange={(e) =>
                          updateCartItem(item._id, {
                            discountType: e.target.value,
                          })
                        }
                      >
                        <option value="amount">₱</option>
                        <option value="percent">%</option>
                      </select>
                    </div>
                  </td>

                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateCartItem(item._id, {
                          quantity: Number(e.target.value),
                        })
                      }
                      style={{ width: 70 }}
                    />
                  </td>

                  <td>{item.total.toFixed(2)}</td>
                  <td>{item.profit.toFixed(2)}</td>

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
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    No items added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="sales-total">
          <h3>Total: ₱{grandTotal.toFixed(2)}</h3>
          <div style={{ fontSize: 14, color: "#666" }}>
            Estimated Profit: ₱{grandProfit.toFixed(2)}
          </div>
          <button className="submit-btn" onClick={submitSale}>
            Complete Sale
          </button>
        </div>
      </div>
    </div>
  );
}
