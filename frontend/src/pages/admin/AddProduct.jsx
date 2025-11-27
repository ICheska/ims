import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    price: "",
    stock: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(form).forEach((key) => data.append(key, form[key]));
    if (image) data.append("image", image);

    try {
      await axios.post("http://localhost:5000/api/products", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      });

      alert("✅ Product added!");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add product");
    }
  };

  return (
    <div className="form-container">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        {["name", "brand", "price", "stock", "description"].map((field) => (
          <input
            key={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            required={["name", "price", "stock"].includes(field)}
          />
        ))}

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}
