import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin pages
import AdminProducts from "./pages/admin/AdminProducts";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageAccounts from "./pages/admin/ManageAccounts";



// User pages
import UserDashboard from "./pages/user/UserDashboard";
import UserProducts from "./pages/user/UserProducts";
import AddStock from "./pages/user/AddStock";
import InventoryManagement from "./pages/user/InventoryManagement";
import StockReceived from "./pages/user/StockReceived";
import Reports from "./pages/user/Reports";

// Sidebars
import AdminSidebar from "./components/AdminSidebar";
import UserSidebar from "./components/UserSidebar";

// Navbar
import Navbar from "./components/Navbar";

import "./App.css";
import "./components/sidebar.css";


//sales

import CreateSales from "./pages/admin/CreateSales";

//SALES HISTORY
import SalesHistory from "./pages/admin/SalesHistory";



 
// ---------------------- APP CONTENT ----------------------
function AppContent() {
  const location = useLocation();

  const hideUI =
    location.pathname === "/login" || location.pathname === "/register";

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("userInfo"));
  } catch {}

  const role = user?.role;

  const defaultRoute = user
    ? role === "Admin"
      ? "/admin/dashboard"
      : "/user-dashboard"
    : "/login";

  return (
    <div>
      {!hideUI && <Navbar />}

      {!hideUI && role === "Admin" && <AdminSidebar />}
      {!hideUI && role === "User" && <UserSidebar />}

      <div
        className="main-content"
        style={{
          marginLeft: !hideUI ? "250px" : "0",
          marginTop: !hideUI ? "60px" : "0",
          padding: "20px",
          transition: "0.3s",
        }}
      >
        <Routes>
          {/* Auth routes */}
          <Route path="/" element={<Navigate to={defaultRoute} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/add" element={<AddProduct />} />
          <Route path="/admin/edit/:id" element={<EditProduct />} />
          <Route path="/admin/accounts" element={<ManageAccounts />} />

          {/* Admin Sales */}
       {/*}   <Route path="/admin/sales/create" element={<CreateSales />} />
          <Route path="/admin/sales/history" element={<SalesHistory />} />
*/}
          {/* User routes */}
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/user/products" element={<UserProducts />} />
          <Route path="/user/addstock/:id" element={<AddStock />} />
          <Route path="/user/inventory" element={<InventoryManagement />} />
          <Route path="/user/stock-received" element={<StockReceived />} />
          <Route path="/reports" element={<Reports />} />

<Route path="/admin/sales/create" element={<CreateSales />} />


<Route path="/admin/sales/history" element={<SalesHistory />} />

        </Routes>
      </div>
    </div>
  );
}

// ---------------------- MAIN APP ----------------------
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
export default App;

