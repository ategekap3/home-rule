// src/pages/savings/SavingsMemberLogin.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../../components/firebase";
import { doc, getDoc } from "firebase/firestore";
import './AccountSavings.css';

const SavingsMemberLogin = () => {
  const navigate = useNavigate();
  const [accountId, setAccountId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!accountId || !password) {
      setError("Please enter both Account ID and Password.");
      return;
    }

    try {
      const accountRef = doc(db, "savingsAccounts", accountId);
      const accountSnap = await getDoc(accountRef);

      if (!accountSnap.exists()) {
        setError("Invalid Account ID. Contact admin if you don’t have one.");
        return;
      }

      const accountData = accountSnap.data();
      if (accountData.password !== password) {
        setError("Incorrect password. Try again.");
        return;
      }

      // Successful login
      navigate("/savings-member-dashboard");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="savings-dashboard-container">
      <h2>Member Login</h2>
      <p>Enter your Account ID and Password to access your savings dashboard.</p>

      <form className="savings-form" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Account ID"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          className="savings-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="savings-input"
        />

        {error && <div className="error">{error}</div>}

        <button type="submit" className="btn-primary">
          Login
        </button>
      </form>

      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Don't have an account?{" "}
        <Link to="/savings-register" className="btn-secondary">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default SavingsMemberLogin;
