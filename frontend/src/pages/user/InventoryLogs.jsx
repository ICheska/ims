import { useState, useEffect } from "react";
import axios from "axios";
import "./InventoryLogs.css";

export default function InventoryLogs() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const res = await axios.get("/api/inventory/logs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load inventory logs");
      }
    };

    if (token) loadLogs();
  }, [token]);

  const filteredLogs = logs.filter((log) => {
    const matchFilter =
      filter === "all" || log.type.toLowerCase() === filter.toLowerCase();

    const matchSearch = log.product?.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    return matchFilter && matchSearch;
  });

  return (
    <div className="log-container">
      <h2>📚 Inventory Logs</h2>

      <div className="log-controls">
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="log-tabs">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={filter === "in" ? "active" : ""}
            onClick={() => setFilter("in")}
          >
            Stock In
          </button>
          <button
            className={filter === "out" ? "active" : ""}
            onClick={() => setFilter("out")}
          >
            Stock Out
          </button>
        </div>
      </div>

      <table className="log-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Product</th>
            <th>Supplier / Released To</th>
            <th>Qty</th>
            <th>Notes</th>
          </tr>
        </thead>

        <tbody>
          {filteredLogs.length === 0 ? (
            <tr>
              <td colSpan="6" className="empty">
                No logs found
              </td>
            </tr>
          ) : (
            filteredLogs.map((log) => (
              <tr key={log._id}>
                <td>{log.date?.slice(0, 10)}</td>
                <td className={log.type === "IN" ? "type-in" : "type-out"}>
                  {log.type}
                </td>
                <td>{log.product?.name}</td>
                <td>{log.supplier?.name || log.releasedTo}</td>
                <td>{log.quantity}</td>
                <td>{log.notes}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
