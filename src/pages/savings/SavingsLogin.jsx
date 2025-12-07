// src/pages/savings/SavingsLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../components/firebase";
import { query, collection, where, getDocs } from "firebase/firestore";
import "./AccountSavings.css";

const SavingsLogin = () => {
  const navigate = useNavigate();
  const [accountId, setAccountId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!accountId || !password) {
      setError("Both Account ID and Password are required.");
      return;
    }

    try {
      const q = query(
        collection(db, "savingsAccounts"),
        where("accountId", "==", accountId)
      );
      const querySnap = await getDocs(q);

      if (querySnap.empty) {
        setError("No account found with this Account ID.");
        return;
      }

      const member = querySnap.docs[0].data();

      if (member.password !== password) {
        setError("Incorrect password.");
        return;
      }

      // Redirect to dashboard with accountId
      navigate("/savings-member-dashboard", { state: { accountId: member.accountId } });

    } catch (err) {
      console.error(err);
      setError("Failed to login. Please try again.");
    }
  };

  return (
    <div className="savings-dashboard-container">
      <h1>Savings Member Login</h1>
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
        <button type="submit" className="btn-primary">Login</button>
      </form>
    </div>
  );
};

export default SavingsLogin;
