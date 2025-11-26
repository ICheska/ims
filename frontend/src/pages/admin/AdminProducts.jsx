 import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

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
    <div style={{ padding: "30px" }}>
      <h1>All Products</h1>
      <Link
        to="/admin/dashboard"
        style={{ marginBottom: "20px", display: "inline-block" }}
      >
        ⬅️ Back to Dashboard
      </Link>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((p) => (
            <div
              key={p._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "12px",
                width: "250px",
                padding: "10px",
              }}
            >
              <img
                src={`http://localhost:5000/uploads/${p.image}`}
                alt={p.name}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <h3>{p.name}</h3>
              <p>Brand: {p.brand}</p>
              <p>Category: {p.category}</p>
              <p>Price: ₱{p.price}</p>
             <p>Stock: {p.quantity}</p>
              <p>{p.description}</p>

              <div style={{ marginTop: "10px" }}>
                <Link
                  to={`/admin/edit/${p._id}`}
                  style={{ marginRight: "10px" }}
                >
                  ✏️ Edit
                </Link>
                <button onClick={() => handleDelete(p._id)}>🗑 Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
