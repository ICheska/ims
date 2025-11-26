import { useState, useEffect } from "react";
import axios from "axios";

export default function ManageAccounts() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("userInfo"));

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/auth/users", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to fetch users.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== "Admin") {
      setError("Access denied. Admins only.");
      setLoading(false);
      return;
    }
    fetchUsers();
  }, []);

  // Delete a user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      // Remove user from state after deletion
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user.");
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Accounts</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Name</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Email
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Role</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {u.name}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {u.email}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {u.role}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  <button
                    style={{
                      backgroundColor: "#ff4d4f",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleDelete(u._id)}
                  >
                    Delete
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
