import React from "react";
import { Link } from "react-router-dom";
import './Savings.css';

const SavingsDashboard = () => {
  return (
    <div className="savings-dashboard-container">
      <h1>Fixed Deposit Savings Dashboard</h1>
      <p>Welcome! Access your savings account, register, or explore our terms and payment plans.</p>

      <div className="savings-nav-buttons">
        <Link to="/savings-login" className="btn-primary">
          Member Login
        </Link>
        <Link to="/savings-register" className="btn-secondary">
          Register New Account
        </Link>
        <Link to="/savings-terms" className="btn-primary">
          Terms & Conditions
        </Link>
        <Link to="/savings-plans" className="btn-secondary">
          Payment Plans
        </Link>
        <Link to="/savings-why" className="btn-primary">
          Why Open This Account?
        </Link>
      </div>
    </div>
  );
};

export default SavingsDashboard;
