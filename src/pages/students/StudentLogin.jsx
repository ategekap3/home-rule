// src/pages/students/StudentLogin.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../components/firebase";
import { useNavigate, Link } from "react-router-dom";
import "./StudentPortal.css";

const StudentLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { email, password } = formData;
      await signInWithEmailAndPassword(auth, email, password);

      // Redirect to Student Dashboard
      navigate("/student-dashboard");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/user-not-found") setError("No account found with this email.");
      else if (err.code === "auth/wrong-password") setError("Incorrect password.");
      else if (err.code === "auth/invalid-email") setError("Invalid email address.");
      else setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-portal-container">
      <form className="student-form" onSubmit={handleLogin}>
        <h2>Student Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#007bff",
              fontWeight: "bold",
            }}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Don't have an account? <Link to="/student-register" style={{ color: "#007bff" }}>Register</Link>
        </p>
      </form>
    </div>
  );
};

export default StudentLogin;
