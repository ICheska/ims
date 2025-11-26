import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../lowgow.png";
import LoginImage from "../loginimage.png"; // <-- Make sure this file exists

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data));

      /*alert(`Welcome, ${data.fullName || data.name || "User"}!`);*/
      alert(`Welcome, ${data.name}!`);


      if (data.role === "Admin") {
        navigate("/admin/dashboard");
      } else if (data.role === "User") {
        navigate("/user-dashboard");
      } else {
        alert("Unknown user role!");
      }
    } catch (err) {
      alert("Invalid login credentials");
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <div className="login-card">

        {/* LEFT IMAGE (missing before) */}
        <div
          className="login-image"
          style={{
            backgroundImage: `url(${LoginImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        {/* RIGHT CONTENT */}
        <div className="login-right">
          <div className="login-title">
            <img src={Logo} alt="IMS Logo" className="ims-logo" />
            <h2>
              IMS <br /> Cosmetics
            </h2>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Login</button>
          </form>

          <p className="register-text">
            Don’t have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}