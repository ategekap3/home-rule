// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import EnrollNow from "./pages/enroll-now";

// Students
import StudentLogin from "./pages/students/StudentLogin";
import StudentRegister from "./pages/students/StudentRegister";
import StudentsDashboard from "./pages/students/StudentsDashboard";

// Admin
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";

// Savings
import SavingsMemberDashboard from "./pages/savings/SavingsMemberDashboard";
import SavingsRegister from "./pages/savings/SavingsRegister";
import SavingsTerms from "./pages/savings/SavingsTerms";
import SavingsPlans from "./pages/savings/SavingPlans";


// Firebase (ONLY for admin & students)
import { auth } from "./components/firebase";

/* ================= PROTECTED ROUTES ================= */

// Student
function PrivateStudentRoute({ children }) {
  if (auth.currentUser) return children;
  return <Navigate to="/student-login" replace />;
}

// Admin
function PrivateAdminRoute({ children }) {
  if (auth.currentUser) return children;
  return <Navigate to="/admin-login" replace />;
}

// ✅ Savings Member (LOCAL STORAGE – NOT FIREBASE AUTH)
function PrivateSavingsMemberRoute({ children }) {
  const accountId = localStorage.getItem("savingsAccountId");
  if (accountId) return children;
  return <Navigate to="/savings-dashboard" replace />;
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/enroll-now" element={<EnrollNow />} />

        {/* Students */}
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student-register" element={<StudentRegister />} />
        <Route
          path="/student-dashboard"
          element={
            <PrivateStudentRoute>
              <StudentsDashboard />
            </PrivateStudentRoute>
          }
        />

        {/* Admin */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <PrivateAdminRoute>
              <Admin />
            </PrivateAdminRoute>
          }
        />

        {/* Savings */}
        <Route path="/savings-dashboard" element={<SavingsDashboard />} />
        <Route path="/savings-login" element={<SavingsDashboard />} />
        <Route path="/savings-register" element={<SavingsRegister />} />
        <Route path="/savings-terms" element={<SavingsTerms />} />
        <Route path="/savings-plans" element={<SavingsPlans />} />

        <Route
          path="/savings-member-dashboard"
          element={
            <PrivateSavingsMemberRoute>
              <SavingsMemberDashboard />
            </PrivateSavingsMemberRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
