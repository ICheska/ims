import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "../components/sidebar.css";

export default function UserSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Auto-close when navigating (mobile only)
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  return (
    <div>
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✕" : "☰"}
      </button>

      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <ul className="sidebar-menu">
          <li>
            <Link className="menu-item" to="/user-dashboard">
              <span className="menu-icon">🏠</span>
              <span className="menu-text">Dashboard</span>
            </Link>
          </li>

          <li>
            <Link className="menu-item" to="/user/products">
              <span className="menu-icon">📦</span>
              <span className="menu-text">Product Management</span>
            </Link>
          </li>

          <li>
            <Link className="menu-item" to="/user/inventory">
              <span className="menu-icon">📊</span>
              <span className="menu-text">Inventory Management</span>
            </Link>
          </li>

          <li>
            <Link className="menu-item" to="/user/stock-received">
              <span className="menu-icon">📥</span>
              <span className="menu-text">Stock Received</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
