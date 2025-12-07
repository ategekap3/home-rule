// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Components & Pages
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Home & Sections
import Home from "./pages/Home";
import EnrollNow from "./pages/enroll-now";
import LaptopShop from "./components/ShopSection";

// Students
import StudentLogin from "./pages/students/StudentLogin";
import StudentRegister from "./pages/students/StudentRegister";
import StudentsDashboard from "./pages/students/StudentsDashboard";

// Admin
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";

// Savings Account
import SavingsRegister from "./pages/savings/SavingsRegister";
import SavingsLogin from "./pages/savings/SavingsDashboard"; // Login page
import SavingsDashboard from "./pages/savings/SavingsMemberDashboard"; // Member dashboard
import SavingsPlans from "./pages/savings/SavingPlans";
import SavingsTerms from "./pages/savings/SavingsTerms";
import SavingsWhy from "./pages/savings/SavingsWhy";

// Firebase
import { auth } from "./components/firebase";

// Protect Student Route
function PrivateStudentRoute({ children }) {
  if (auth.currentUser) return children;
  return <Navigate to="/student-login" replace />;
}

// Protect Admin Route
function PrivateAdminRoute({ children }) {
  if (auth.currentUser) return children;
  return <Navigate to="/admin-login" replace />;
}

// Protect Savings Member Route
function PrivateSavingsMemberRoute({ children }) {
  const memberId = localStorage.getItem("savingsMemberId");
  if (memberId) return children;
  return <Navigate to="/savings-login" replace />;
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/enroll-now" element={<EnrollNow />} />
        <Route path="/laptop-shop" element={<LaptopShop />} />

        {/* Student Routes */}
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

        {/* Admin Routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <PrivateAdminRoute>
              <Admin />
            </PrivateAdminRoute>
          }
        />

        {/* Savings Routes */}
        <Route path="/savings-login" element={<SavingsLogin />} />
        <Route
          path="/savings-member-dashboard"
          element={
            <PrivateSavingsMemberRoute>
              <SavingsDashboard />
            </PrivateSavingsMemberRoute>
          }
        />
        <Route path="/savings-register" element={<SavingsRegister />} />
        <Route path="/savings-terms" element={<SavingsTerms />} />
        <Route path="/savings-plans" element={<SavingsPlans />} />
        <Route path="/savings-why" element={<SavingsWhy />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
