import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";
import "./AdminDashboard.css"; // <-- IMPORT CSS

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    recentlyAdded: 0,
  });

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
        const products = res.data.products || [];

        const lowStock = products.filter((p) => p.stock <= 10).length;
        const recentlyAdded = products.filter(
          (p) =>
            (new Date() - new Date(p.createdAt)) /
              (1000 * 60 * 60 * 24) <= 7
        ).length;

        setStats({
          totalProducts: products.length,
          lowStock,
          recentlyAdded,
        });
      })
      .catch((err) => console.error(err));
  }, [navigate, user]);

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />

      <div className="dashboard-main">
        <h1 className="dashboard-title">Welcome, {user.name} 👋</h1>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h2>{stats.totalProducts}</h2>
            <p>Total Products</p>
          </div>

          <div className="stat-card">
            <h2>{stats.lowStock}</h2>
            <p>Low Stock Items</p>
          </div>

          <div className="stat-card">
            <h2>{stats.recentlyAdded}</h2>
            <p>Recently Added</p>
          </div>
        </div>

        <div className="dashboard-actions">
          <Link to="/admin/add" className="btn-action">
            ➕ Add Product
          </Link>

          <Link to="/admin/products" className="btn-action">
            View Products
          </Link>
        </div>
      </div>
    </div>
  );
}
