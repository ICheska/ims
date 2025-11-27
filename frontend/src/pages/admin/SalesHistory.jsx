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

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Sales History</h1>

      {sales.length === 0 ? (
        <p>No sales yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Company</th>
              <th>Items</th>
              <th>Total (₱)</th>
            </tr>
          </thead>

          <tbody>
            {sales.map((sale) => (
              <tr key={sale._id}>
                {/* DATE */}
                <td>{new Date(sale.createdAt).toLocaleString()}</td>

                {/* COMPANY COLUMN */}
                <td>
                  {sale.items.map((item, index) => (
                    <div key={index}>
                      {item.company || "N/A"}
                    </div>
                  ))}
                </td>

                {/* ITEMS COLUMN */}
                <td>
                  {sale.items.map((item, index) => (
                    <div key={index} style={{ marginBottom: "4px" }}>
                      {item.name} × {item.quantity} (₱{item.price})
                    </div>
                  ))}
                </td>

                {/* TOTAL */}
                <td>₱{sale.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
