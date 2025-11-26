import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function UserStockHistory() {
  const { id } = useParams(); // productId from URL
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (!user || user.role !== "User") {
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:5000/api/stock-received/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        setHistory(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id, navigate, user]);

  if (loading) return <p>Loading stock history...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Stock History</h2>

      {history.length === 0 ? (
        <p>No stock history found.</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>Quantity</th>
              <th>Date Received</th>
              <th>Notes</th>
              <th>Recorded By</th>
            </tr>
          </thead>

          <tbody>
            {history.map((entry) => (
              <tr key={entry._id}>
                <td>{entry.quantity}</td>
                <td>{new Date(entry.dateReceived).toLocaleDateString()}</td>
                <td>{entry.notes || "—"}</td>
                <td>{entry.user?.name || "Unknown"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
