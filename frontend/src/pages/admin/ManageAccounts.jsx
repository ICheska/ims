import { useState, useEffect } from "react";
import axios from "axios";
import "./ManageAccounts.css";

export default function ManageAccounts() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("userInfo"));

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user.");
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="manage-container">
      <h2>Manage Accounts</h2>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="manage-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(u._id)}>
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
