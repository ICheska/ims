import { Link, useNavigate } from "react-router-dom";
import "../components/Navbar.css";
export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <nav>
      <div className="brand">💄 IMS Cosmetics</div>
      <div>
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            {user.role === "Admin" && (
              <Link to="/admin/products">Admin Dashboard</Link>
        
        )}
            <button onClick={handleLogout}>Logout</button>

           
            {user.role === "User" && (
             <Link to="/user-dashboard">User Dashboard</Link>


            )}
          </>
        )}
      </div>
    </nav>
  );
}
