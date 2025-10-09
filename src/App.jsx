// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Components & Pages
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import EnrollNow from "./pages/enroll-now";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";

import StudentLogin from "./pages/students/StudentLogin";
import StudentRegister from "./pages/students/StudentRegister";
import StudentsDashboard from "./pages/students/StudentsDashboard";

// Firebase
import { auth } from "./components/firebase";

// Protected route for students
const PrivateStudentRoute = ({ children }) => {
  const user = auth.currentUser;
  return user ? children : <Navigate to="/student-login" replace />;
};

// Protected route for admin
const PrivateAdminRoute = ({ children }) => {
  const user = auth.currentUser;
  return user ? children : <Navigate to="/admin-login" replace />;
};

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/enroll-now" element={<EnrollNow />} />

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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
