import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";
import "./AdminDashboard.css";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    recentlyAdded: 0,
    totalSales: 0,
    totalProfit: 0,
  });

  const [chartData, setChartData] = useState([]);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (!user || user.role !== "Admin") {
      navigate("/login");
      return;
    }

    loadProductStats();
    loadSalesStats();
  }, []);

  // -----------------------------
  // 📌 LOAD PRODUCT STATISTICS
  // -----------------------------
  const loadProductStats = () => {
    axios
      .get("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        const products = res.data.products || [];

        const lowStock = products.filter((p) => p.stock <= 10).length;
        const recentlyAdded = products.filter(
          (p) =>
            (new Date() - new Date(p.createdAt)) / (1000 * 60 * 60 * 24) <= 7
        ).length;

        setStats((prev) => ({
          ...prev,
          totalProducts: products.length,
          lowStock,
          recentlyAdded,
        }));
      })
      .catch((err) => console.error(err));
  };

  // -----------------------------
  // 📌 LOAD SALES + PROFIT + CHART
  // -----------------------------
  const loadSalesStats = () => {
    axios
      .get("http://localhost:5000/api/sales/history", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        const sales = res.data.sales || [];

        let totalSales = 0;
        let totalProfit = 0;

        const chartFormatted = [];

        sales.forEach((sale) => {
          totalSales += sale.totalAmount;

          let profitPerSale = 0;

          sale.items.forEach((item) => {
            const cost = item.cost || 0;
            const sell = item.price || 0;

            profitPerSale += (sell - cost) * item.quantity;
          });

          totalProfit += profitPerSale;

          chartFormatted.push({
            date: new Date(sale.createdAt).toLocaleDateString(),
            sales: sale.totalAmount,
            profit: profitPerSale,
          });
        });

        setStats((prev) => ({
          ...prev,
          totalSales,
          totalProfit,
        }));

        setChartData(chartFormatted.reverse());
      })
      .catch((err) => console.error(err));
  };

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

          <div className="stat-card">
            <h2>₱{stats.totalSales.toLocaleString()}</h2>
            <p>Total Sales</p>
          </div>

          <div className="stat-card">
            <h2>₱{stats.totalProfit.toLocaleString()}</h2>
            <p>Total Profit</p>
          </div>
        </div>

        <div className="charts-container">
          <h2>📊 Sales & Profit Overview</h2>

          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 40, bottom: 20, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="sales"
                stroke="#1E90FF"
                strokeWidth={3}
                name="Sales"
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#4CAF50"
                strokeWidth={3}
                name="Profit"
              />
            </LineChart>
          </ResponsiveContainer>
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
