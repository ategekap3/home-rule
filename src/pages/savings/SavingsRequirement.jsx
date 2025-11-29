// src/pages/savings/SavingsRequirements.jsx
import React from "react";
import { Link } from "react-router-dom";
import './AccountSavings.css';

const SavingsRequirements = () => {
  return (
    <div className="savings-container">
      <div className="savings-form">
        <h2>Savings Account Requirements</h2>
        <ul>
          <li>Provide full name and phone number.</li>
          <li>Use the Account ID given by the admin.</li>
          <li>Minimum initial deposit: 100,000 UGX.</li>
          <li>Funds can only be accessed after 3 months.</li>
        </ul>

        <Link to="/savings-dashboard" className="btn-secondary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default SavingsRequirements;
