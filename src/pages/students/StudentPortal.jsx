// src/pages/students/StudentPortal.jsx
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import StudentLogin from "./StudentLogin";
import StudentRegister from "./StudentRegister";
import StudentDashboard from "./StudentDashboard";
import "./StudentPortal.css";

const StudentPortal = () => {
  const [user, setUser] = useState(null); // Firebase authenticated user

  return (
    <div className="student-portal-container">
      <Routes>
        {!user ? (
          <>
            <Route path="login" element={<StudentLogin setUser={setUser} />} />
            <Route path="register" element={<StudentRegister setUser={setUser} />} />
            <Route path="*" element={<Navigate to="login" />} />
          </>
        ) : (
          <>
            <Route path="dashboard" element={<StudentDashboard user={user} />} />
            <Route path="*" element={<Navigate to="dashboard" />} />
          </>
        )}
      </Routes>
    </div>
  );
};

export default StudentPortal;
