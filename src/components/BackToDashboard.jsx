// src/components/BackToDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const BackToDashboard = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/savings-dashboard")}
      className="btn-secondary"
      style={{ marginTop: "20px" }}
    >
      Back to Dashboard
    </button>
  );
};

export default BackToDashboard;
