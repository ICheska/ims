import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "../components/sidebar.css";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Auto-close on navigation (mobile only)
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  return (
    <div>
      {/* Toggle Button */}
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <ul className="sidebar-menu">
          <li>
            <Link className="menu-item" to="/admin/dashboard">
              <span className="menu-icon">🏠</span>
              <span className="menu-text">Dashboard</span>
            </Link>
          </li>

          <li>
            <Link className="menu-item" to="/admin/products">
              <span className="menu-icon">📦</span>
              <span className="menu-text">Manage Products</span>
            </Link>
          </li>

          <li>
            <Link className="menu-item" to="/admin/add">
              <span className="menu-icon">➕</span>
              <span className="menu-text">Add Product</span>
            </Link>
          </li>

          <li>
            <Link className="menu-item" to="/admin/accounts">
              <span className="menu-icon">👥</span>
              <span className="menu-text">Manage Accounts</span>
            </Link>
          </li>

          <li style={{ marginTop: "20px", opacity: 0.6 }}>─── Sales ───</li>

          <li>
            <Link className="menu-item" to="/admin/sales/create">
              <span className="menu-icon">🧾</span>
              <span className="menu-text">Create Sales</span>
            </Link>
          </li>

          <li>
            <Link className="menu-item" to="/admin/sales/history">
              <span className="menu-icon">📊</span>
              <span className="menu-text">Sales History</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
