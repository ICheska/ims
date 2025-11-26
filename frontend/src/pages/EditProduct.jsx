import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const user = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        setProduct(res.data);
        if (res.data.image)
          setPreview(`http://localhost:5000/uploads/${res.data.image}`);
      })
      .catch((err) => console.error(err));
  }, [id, user.token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();

      // append all product fields
      Object.keys(product).forEach((key) => data.append(key, product[key]));

      // append new image if selected
      if (image) data.append("image", image);

      await axios.put(`http://localhost:5000/api/products/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      });

      alert("✅ Product updated!");
      navigate("/admin/products");
    } catch (err) {
      alert("❌ Failed to update product");
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        {/* FIELDS INCLUDING lowStockThreshold */}
        {[
          "name",
          "brand",
          "price",
          "stock",
          "description",
          "lowStockThreshold",
        ].map((field) => (
          <input
            key={field}
            value={product[field] || ""}
            onChange={(e) =>
              setProduct({ ...product, [field]: e.target.value })
            }
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            required={["name", "price", "stock", "lowStockThreshold"].includes(
              field
            )}
          />
        ))}

        {/* IMAGE INPUT */}
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            style={{ width: "100%", marginTop: "10px", borderRadius: "8px" }}
          />
        )}

        <button type="submit">Update</button>
      </form>
    </div>
  );
}
