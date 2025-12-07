// src/pages/savings/SavingsDashboard.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../../components/firebase";
import { doc, getDoc } from "firebase/firestore";
import './AccountSavings.css';

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
      const docRef = doc(db, "savingsAccounts", accountId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setError("Account ID does not exist. Contact admin.");
        return;
      }

      const data = docSnap.data();
      if (data.password !== password) {
        setError("Incorrect password.");
        return;
      }

      // ✅ Save logged-in member in localStorage
      localStorage.setItem("savingsMemberId", accountId);

      // Navigate to member dashboard
      navigate("/savings-member-dashboard");
    } catch (err) {
      console.error(err);
      setError("Login failed. Try again later.");
    }
  };

  return (
    <div className="savings-dashboard-container">
      <h1>Fixed Deposit Savings</h1>
      <p>Access your account, register, or explore our terms and payment plans.</p>

      <div className="savings-nav-buttons">
        <Link to="/savings-register" className="btn-secondary">
          Register New Account
        </Link>
        <Link to="/savings-terms" className="btn-primary">
          Terms & Conditions
        </Link>
        <Link to="/savings-plans" className="btn-secondary">
          Payment Plans
        </Link>
        <Link to="/savings-why" className="btn-primary">
          Why Open This Account?
        </Link>
      </div>

      <div className="savings-form">
        <h2>Member Login</h2>
        <input
          type="text"
          name="accountId"
          placeholder="Account ID"
          value={loginData.accountId}
          onChange={handleChange}
          className="savings-input"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={loginData.password}
          onChange={handleChange}
          className="savings-input"
        />
        {error && <div className="error">{error}</div>}
        <button onClick={handleLogin} className="btn-primary">
          Login
        </button>
      </div>
    </div>
  );
};

export default SavingsDashboard;
