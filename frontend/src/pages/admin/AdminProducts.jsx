import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./AdminProducts.css";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (!user || user.role !== "Admin") {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        setProducts(res.data.products || []);
      })
      .catch((err) => console.error(err));
  }, [navigate, user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  return (
    <div className="admin-products-container">
      <h1 className="admin-products-header">All Products</h1>

      <Link to="/admin/dashboard" className="admin-products-back">
        ⬅️ Back to Dashboard
      </Link>

      <div className="admin-products-list">
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((p) => (
            <div key={p._id} className="admin-product-card">
              <img
                src={`http://localhost:5000/uploads/${p.image}`}
                alt={p.name}
              />
              <h3>{p.name}</h3>
              <p>Brand: {p.brand}</p>
              <p>Category: {p.category}</p>
              <p>Price: ₱{p.price}</p>
              <p>Stock: {p.quantity}</p>
              <p>{p.description}</p>

              <div className="admin-product-actions">
                <Link to={`/admin/edit/${p._id}`}>✏️ Edit</Link>
                <button onClick={() => handleDelete(p._id)}>🗑 Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
