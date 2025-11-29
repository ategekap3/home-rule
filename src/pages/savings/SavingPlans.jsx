// src/pages/savings/SavingsPlans.jsx
import React from "react";
import './Savings.css';
import BackToDashboard from "../../components/BackToDashboard";

const SavingsPlans = () => {
  return (
    <div className="savings-dashboard-container">
      <h1>Payment Plans</h1>
      <ul style={{ textAlign: "left", maxWidth: "600px", marginTop: "20px" }}>
        <li>Plan A: Deposit UGX 50,000 – UGX 100,000</li>
        <li>Plan B: Deposit UGX 101,000 – UGX 500,000</li>
        <li>Plan C: Deposit UGX 500,001 and above</li>
        <li>All plans earn fixed interest after 3 months</li>
      </ul>
     <BackToDashboard />
    </div>
  
  );
};

export default SavingsPlans;
