import React from "react";
import { Link } from "react-router-dom";
import "./Savings.css";
import BackToDashboard from "../../components/BackToDashboard";

const SavingsHome = () => {
  return (
    <div className="savings-container">
      <div className="savings-box">
        <h1>Modern Savings Account</h1>
        <p>Your trusted secure savings platform.</p>

        <div className="savings-links">
          <Link to="/savings/register" className="btn-primary">Register Account</Link>
          <Link to="/savings/terms" className="btn-secondary">Terms & Conditions</Link>
          <Link to="/savings/requirements" className="btn-secondary">Savings Requirements</Link>
        </div>
      </div>
        <BackToDashboard/>
    </div>
  );
};

export default SavingsHome;

