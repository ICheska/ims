import { useEffect, useState } from "react";
import axios from "axios";
/*import "../../UserDashboard";*/
/*import UserDashboard from "./UserDashboard";*/
import "../../user-dashboard.css";



export default function UserDashboard() {
  const [summary, setSummary] = useState({
    todaysSales: 0,
    transactions: 0,
    lowStock: []
  });

  useEffect(() => {
  const loadSummary = async () => {
    try {
      const { data } = await axios.get("/api/dashboard/user-summary", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});

console.log("SUMMARY DATA:", data);

      setSummary({
  todaysSales: data.todaysSales ?? 0,
  transactions: data.transactions ?? 0,
  lowStock: Array.isArray(data.lowStock) ? data.lowStock : []
});


    } catch (err) {
      console.error("User dashboard error:", err);
    }
  };

  loadSummary();
}, []);


  return (
    <div className="user-dashboard">
      <h1 className="title">User Dashboard</h1>

      {/* DASHBOARD CARDS */}
      <div className="card-grid">
        <div className="card">
          <h2>Today's Sales</h2>
          <p>₱{summary.todaysSales}</p>
        </div>

        <div className="card">
          <h2>Transactions Today</h2>
          <p>{summary.transactions}</p>
        </div>

        <div className="card">
          <h2>Low Stock Items</h2>
         <p>{summary.lowStock?.length || 0}</p>

        </div>
      </div>

      {/* LOW STOCK LIST */}
      <div className="low-stock-section">
        <h2 className="section-title">Low Stock Items</h2>

        {summary.lowStock.length === 0 ? (
          <p className="no-items">✔ No low-stock items</p>
        ) : (
          <table className="stock-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
            {summary.lowStock?.map((item, index) => (

                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
