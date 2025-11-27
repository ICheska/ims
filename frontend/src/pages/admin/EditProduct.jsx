import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./EditProduct.css";   // <-- IMPORT CSS HERE

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
      Object.keys(product).forEach((key) => data.append(key, product[key]));
      if (image) data.append("image", image);

      await axios.put(`http://localhost:5000/api/products/${id}`, data, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      alert("✅ Product updated!");
      navigate("/admin/products");
    } catch (err) {
      alert("❌ Failed to update product");
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="edit-h2">Edit Product</h2>

    <div className="edit-product-wrapper">
      <div className="edit-product-flex">

        {/* LEFT SIDE IMAGE */}
        <div>
          {preview && (
            <img src={preview} alt="Preview" className="edit-product-image" />
          )}
        </div>

        {/* RIGHT SIDE FORM */}
        <form onSubmit={handleSubmit} className="edit-product-form">
          {["name", "brand", "price", "stock", "description"].map((field) => (
            <input
              key={field}
              value={product[field] || ""}
              onChange={(e) =>
                setProduct({ ...product, [field]: e.target.value })
              }
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              required={["name", "price", "stock"].includes(field)}
              className="edit-product-input"
            />
          ))}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="edit-product-file"
          />

          <button type="submit">Update</button>
        </form>
      </div>
    </div>
   </div> 
  );
}
