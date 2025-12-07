// src/pages/savings/SavingsTerms.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./AccountSavings.css";

const SavingsTerms = () => {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="savings-container">
      <div className="savings-form">
        <h2>Terms & Conditions</h2>

        <p>
          1. Minimum deposit: <strong>100,000 UGX</strong>.<br />
          2. A registration fee of <strong>50 AED</strong> is required.<br />
          3. Savings can be topped up anytime.<br />
          4. Account ID must always be used for deposits.<br />
          5. No interest is applied—this is a secure savings service only.<br />
        </p>

        {/* Checkbox */}
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
          />
          <span>I accept the Terms & Conditions</span>
        </label>

        {/* Button */}
        <Link
          to="/savings-register"
          className={`btn-primary ${!accepted ? "btn-disabled" : ""}`}
          onClick={(e) => {
            if (!accepted) {
              e.preventDefault();
              alert("You must accept Terms & Conditions first.");
            }
          }}
        >
          Continue to Registration
        </Link>

        <Link to="/savings-dashboard" className="btn-secondary back-btn">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default SavingsTerms;
