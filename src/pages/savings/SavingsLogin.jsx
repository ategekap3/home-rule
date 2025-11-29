// src/pages/savings/SavingsLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../components/firebase";
import './AccountSavings.css';

const SavingsLogin = () => {
  const navigate = useNavigate();
  const [accountId, setAccountId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!accountId || !password) {
      setError("All fields are required.");
      return;
    }

    const docRef = doc(db, "savingsAccounts", accountId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      setError("Account ID not found.");
      return;
    }

    const data = docSnap.data();
    if (data.password !== password) {
      setError("Incorrect password.");
      return;
    }

    navigate("/savings-dashboard");
  };

  return (
    <div className="savings-dashboard-container">
      <h1>Savings Account Login</h1>
      <form className="savings-form" onSubmit={handleLogin}>
        <input type="text" placeholder="Account ID" value={accountId} onChange={e => setAccountId(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <div className="error">{error}</div>}
        <button type="submit" className="btn-primary">Login</button>
      </form>
    </div>
  );
};

export default SavingsLogin;
