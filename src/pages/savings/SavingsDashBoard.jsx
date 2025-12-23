// src/pages/savings/SavingsDashboard.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../../components/firebase";
import { doc, getDoc } from "firebase/firestore";
import "./AccountSavings.css";

const SavingsDashboard = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ accountId: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const { accountId, password } = loginData;

    if (!accountId || !password) {
      setError("Please enter Account ID and password.");
      return;
    }

    try {
      const ref = doc(db, "savingsAccounts", accountId);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        setError("No member found with this Account ID.");
        return;
      }

      const data = snap.data();
      if (data.password !== password) {
        setError("Incorrect password.");
        return;
      }

      // ✅ SAVE SESSION
      localStorage.setItem("savingsAccountId", accountId);

      navigate("/savings-member-dashboard");
    } catch (err) {
      console.error(err);
      setError("Login failed.");
    }
  };

  return (
    <div className="savings-dashboard-container">
      <h1>Fixed Deposit Savings</h1>

      <div className="savings-nav-buttons">
        <Link to="/savings-register" className="btn-secondary">Register</Link>
        <Link to="/savings-terms" className="btn-primary">Terms</Link>
        <Link to="/savings-plans" className="btn-secondary">Plans</Link>
      </div>

      <form className="savings-form" onSubmit={handleLogin}>
        <h2>Member Login</h2>

        <input
          type="text"
          name="accountId"
          placeholder="Account ID"
          onChange={handleChange}
          className="savings-input"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="savings-input"
        />

        {error && <div className="error">{error}</div>}

        <button type="submit" className="btn-primary">
          Login
        </button>
      </form>
    </div>
  );
};

export default SavingsDashboard;
