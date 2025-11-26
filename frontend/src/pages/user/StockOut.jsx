import { useState, useEffect } from "react";
import axios from "axios";
import "./StockOut.css";

export default function StockOut() {
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    product: "",
    quantity: "",
    releasedTo: "",
    purpose: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await axios.get("/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load products");
      }
    };

    if (token) loadProducts();
  }, [token]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "/api/inventory/stockout",
        {
          product: form.product,
          quantity: Number(form.quantity),
          releasedTo: form.releasedTo,
          purpose: form.purpose,
          date: form.date,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Stock-Out recorded!");

      setForm({
        product: "",
        quantity: "",
        releasedTo: "",
        purpose: "",
        date: new Date().toISOString().slice(0, 10),
      });
    } catch (err) {
      console.error(err);
      alert("Failed to record stock-out");
    }
  };

  return (
    <div className="inv-container">
      <h2>📤 Stock Out</h2>

      <form className="inv-form" onSubmit={submit}>
        <div className="form-row">
          <label>Product</label>
          <select
            name="product"
            value={form.product}
            onChange={handleChange}
            required
          >
            <option value="">-- Choose Product --</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} (Available: {p.stock})
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label>Quantity Released</label>
          <input
            type="number"
            name="quantity"
            min="1"
            value={form.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Released To</label>
          <input
            type="text"
            name="releasedTo"
            value={form.releasedTo}
            onChange={handleChange}
            required
            placeholder="Name / Department"
          />
        </div>

        <div className="form-row">
          <label>Purpose / Remarks</label>
          <textarea
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            required
            placeholder="Reason for stock-out"
          ></textarea>
        </div>

        <div className="form-row">
          <label>Date Released</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        <button className="inv-btn" type="submit">
          Save Stock Out
        </button>
      </form>
    </div>
  );
}
