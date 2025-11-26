import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../lowgow.png";
import RegisterImage from "../registerimage.png";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const navigate = useNavigate();


const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email, password, role } // <-- include role
      );

      alert("Registration successful!");
      navigate("/"); // go back to login
    } catch (err) {
      alert("Registration failed");
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <div className="login-card">
        {/* Left Image */}
        <div
          className="login-image"
          style={{
            backgroundImage: `url(${RegisterImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        {/* Right Side */}
        <div className="login-right">
          <div className="login-title">
            <img src={Logo} alt="IMS Logo" className="ims-logo" />
            <h2>
              IMS <br /> Cosmetics
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="login-form">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

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

            {/* Role Selection */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              style={{ marginTop: "10px", padding: "8px" }}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>

            <button type="submit" style={{ marginTop: "15px" }}>
              Register
            </button>
          </form>

          <p className="register-text">
            Already have an account? <Link to="/">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}





































/*
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role,
      });
      alert("✅ Registered successfully! Please login.");
      navigate("/login");
    } catch (err) {
      alert("❌ Registration failed");
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email, password, role } // <-- include role
      );

      alert("Registration successful!");
      navigate("/"); // go back to login
    } catch (err) {
      alert("Registration failed");
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
      <div className="login-card">
        {/* Left Image */
  /*
        <div
          className="login-image"
          style={{
            backgroundImage: `url(${RegisterImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
/*
       //right 
        <div className="login-right">
          <div className="login-title">
            <img src={Logo} alt="IMS Logo" className="ims-logo" />
            <h2>
              IMS <br /> Cosmetics
            </h2>
          </div>
*/
          /* Form */
   
          /*
        <form onSubmit={handleRegister} className="login-form">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

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

            /* Role Selection */
       /*  
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              style={{ marginTop: "10px", padding: "8px" }}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>

            <button type="submit" style={{ marginTop: "15px" }}>
              Register
            </button>
          </form>

          <p className="register-text">
            Already have an account? <Link to="/">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
*/