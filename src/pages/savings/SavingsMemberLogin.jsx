// src/pages/savings/SavingsMemberLogin.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../../components/firebase";
import { doc, getDoc } from "firebase/firestore";
import './savings.css';

const SavingsMemberLogin = () => {
  const navigate = useNavigate();
  const [accountId, setAccountId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!accountId || !password) {
      setError("Both fields are required.");
      return;
    }

    try {
      const docRef = doc(db, "savingsAccounts", accountId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setError("Invalid Account ID. Contact the admin.");
        return;
      }

      const data = docSnap.data();

      if (!data.password) {
        setError("Account not registered yet. Complete registration first.");
        return;
      }

      if (data.password !== password) {
        setError("Incorrect password.");
        return;
      }

      // Login successful, redirect to member dashboard
      // Pass account ID as state or you can use context/auth state
      navigate("/savings-member-dashboard", { state: { accountId } });

    } catch (err) {
      console.error(err);
      setError("Login failed. Try again later.");
    }
  };

  return (
    <div className="savings-dashboard-container">
      <h1>Member Login</h1>
      <p>Enter your Account ID and password to access your savings account.</p>

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

      <Link to="/savings-dashboard" className="btn-secondary" style={{ marginTop: "20px", display: "inline-block" }}>
        Back to Dashboard
      </Link>
    </div>
  );
};

export default SavingsMemberLogin;
