import { useState, useEffect } from "react";
import axios from "axios";
import "./StockIn.css";

export default function StockIn() {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [form, setForm] = useState({
    product: "",
    supplier: "",
    quantity: "",
    invoice: "",
    date: new Date().toISOString().slice(0, 10),
    notes: "",
  });

  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  // Load products + suppliers
  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: productData } = await axios.get(
          "http://localhost:5000/api/products",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const { data: supplierData } = await axios.get(
          "http://localhost:5000/api/suppliers",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setProducts(productData.products || []);
        setSuppliers(supplierData.suppliers || []);
      } catch (err) {
        console.error("Load error:", err);
      }
    };

    loadData();
  }, [token]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/inventory/stockin",
        {
          product: form.product,
          supplier: form.supplier,
          quantity: Number(form.quantity),
          invoice: form.invoice,
          date: form.date,
          notes: form.notes,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Stock-In recorded!");

      setForm({
        product: "",
        supplier: "",
        quantity: "",
        invoice: "",
        date: new Date().toISOString().slice(0, 10),
        notes: "",
      });
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to record stock-in");
    }
  };

  return (
    <div className="inv-container">
      <h2>📦 Stock In</h2>

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
                {p.name} (Current: {p.stock})
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label>Supplier</label>
          <select
            name="supplier"
            value={form.supplier}
            onChange={handleChange}
            required
          >
            <option value="">-- Choose Supplier --</option>
            {suppliers.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label>Quantity Received</label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            required
            min="1"
          />
        </div>

        <div className="form-row">
          <label>Invoice #</label>
          <input
            type="text"
            name="invoice"
            value={form.invoice}
            onChange={handleChange}
            placeholder="Optional"
          />
        </div>

        <div className="form-row">
          <label>Date Received</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Optional remarks"
          ></textarea>
        </div>

        <button className="inv-btn" type="submit">
          Save Stock In
        </button>
      </form>
    </div>
  );
}
