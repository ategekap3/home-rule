// src/pages/savings/SavingsWhy.jsx
import React from "react";
import './Savings.css';
import BackToDashboard from "../../components/BackToDashboard";

const SavingsWhy = () => {
  return (
    <div className="savings-dashboard-container">
      <h1>Why Open a Fixed Deposit Account?</h1>
      <ul style={{ textAlign: "left", maxWidth: "600px", marginTop: "20px" }}>
        <li>Secure your money safely for a fixed period</li>
        <li>Earn guaranteed returns after maturity</li>
        <li>Plan for your short-term financial goals</li>
        <li>Easy to track and manage through your dashboard</li>
        <li>Exclusive benefits for account holders</li>
      </ul>
       <BackToDashboard />
    </div>
  );
};

export default SavingsWhy;
