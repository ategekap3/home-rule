// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Components & Pages
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PhoneLogin from "./pages/students/PhoneLogin";



import Home from "./pages/Home";
import EnrollNow from "./pages/enroll-now";
import LaptopShop from "./components/ShopSection";

// Students
import StudentLogin from "./pages/students/StudentLogin";
import StudentRegister from "./pages/students/StudentRegister";
import PhoneRegister from "./pages/students/PhoneRegister"; // NEW
import StudentsDashboard from "./pages/students/StudentsDashboard";

// Admin
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";

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

         <Route path="/phone-login" element={<PhoneLogin />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student-register" element={<StudentRegister />} />
        <Route path="/student-phone-register" element={<PhoneRegister />} /> {/* OTP phone register */}
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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
