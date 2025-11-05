import React from "react";
import { FaBook, FaCheckCircle, FaCertificate } from "react-icons/fa";

const TopStats = ({ coursesCount, completedCount, certificatesCount }) => {
  const stats = [
    { label: "Courses Enrolled", value: coursesCount, icon: <FaBook /> },
    { label: "Completed Courses", value: completedCount, icon: <FaCheckCircle /> },
    { label: "Certificates", value: certificatesCount, icon: <FaCertificate /> },
  ];

  return (
    <div className="top-stats">
      {stats.map((stat) => (
        <div key={stat.label} className="stat-card">
          <div className="stat-icon">{stat.icon}</div>
          <h3>{stat.value}</h3>
          <p>{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default TopStats;
