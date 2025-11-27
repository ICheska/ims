import { useEffect, useState } from "react";
import axios from "axios";

export default function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/sales/history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSales(res.data.sales);
      } catch (error) {
        console.error("Error loading sales history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  // --------------------------
  // REFUND SALE
  // --------------------------
  const refundSale = async (id) => {
    if (!window.confirm("Refund this sale? This will return items to stock."))
      return;

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:5000/api/sales/${id}/refund`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Remove from UI after refund
      setSales((prev) => prev.filter((s) => s._id !== id));

      alert("Sale refunded successfully!");
    } catch (error) {
      console.error("Refund error:", error);
      alert("Refund failed. Check backend.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Sales History</h1>

      {sales.length === 0 ? (
        <p>No sales yet.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Company</th>
              <th style={thStyle}>Items</th>
              <th style={thStyle}>Total (₱)</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>

          <tbody>
            {sales.map((sale) => (
              <tr key={sale._id}>
                <td style={tdStyle}>
                  {new Date(sale.createdAt).toLocaleString()}
                </td>

                <td style={tdStyle}>
                  {sale.items.map((item, index) => (
                    <div key={index}>{item.company || "N/A"}</div>
                  ))}
                </td>

                <td style={tdStyle}>
                  {sale.items.map((item, index) => (
                    <div key={index}>
                      {item.name} × {item.quantity} (₱{item.price})
                    </div>
                  ))}
                </td>

                <td style={tdStyle}>₱{sale.totalAmount}</td>

                <td style={tdStyle}>
                  <button
                    onClick={() => refundSale(sale._id)}
                    style={{
                      padding: "6px 12px",
                      background: "#2196f3",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Refund
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// STYLE OBJECTS
const thStyle = {
  textAlign: "left",
  padding: "10px",
  borderBottom: "1px solid #ccc",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #eee",
};
