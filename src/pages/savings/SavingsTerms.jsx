// src/pages/savings/SavingsTerms.jsx
import React from "react";
import { Link } from "react-router-dom";
import './Savings.css';

const SavingsTerms = () => {
  return (
    <div className="savings-container">
      <div className="savings-form">
        <h2>Terms & Conditions</h2>
        <p>
          1. Minimum deposit: 100,000 UGX.<br />
          2. Funds can only be withdrawn after 3 months.<br />
          3. Interest is fixed at 5% per quarter.<br />
          4. Account ID is mandatory for registration.<br />
        </p>

        <Link to="/savings-dashboard" className="btn-secondary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default SavingsTerms;
