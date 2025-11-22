// src/pages/students/StudentRegister.jsx
import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, serverTimestamp, addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../components/firebase";
import { useNavigate, Link } from "react-router-dom";
import "./StudentPortal.css";

const availableCourses = [
  "FUNDAMENTALS OF IT",
  "GRAPHICS DESIGN",
  "PROGRAMMING",
  "MS.OFFICE",
];

const StudentRegister = ({ selectedCourse = "" }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    course: selectedCourse,
    whatsapp: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (selectedCourse) {
      setFormData((prev) => ({ ...prev, course: selectedCourse }));
    }
  }, [selectedCourse]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { firstName, secondName, course, whatsapp, password, confirmPassword } = formData;

    if (!firstName || !secondName || !course || !whatsapp || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (!/^\d{10,15}$/.test(whatsapp)) {
      setError("Enter a valid WhatsApp number (only digits).");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // Convert WhatsApp number to email format for Firebase Auth
      const generatedEmail = `${whatsapp}@mcschool.ug`;

      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, generatedEmail, password);
      const user = userCredential.user;

      // Save student data in Firestore
      await setDoc(doc(db, "students", user.uid), {
        uid: user.uid,
        firstName,
        secondName,
        course,
        whatsapp,
        email: generatedEmail,
        progress: [course],
        certificates: [],
        comments: [],
        createdAt: serverTimestamp(),
      });

      // Send welcome message
      await addDoc(collection(db, "messages"), {
        senderId: "admin",
        receiverId: user.uid,
        text: `Welcome ${firstName} to Modern Computer World UG!`,
        timestamp: serverTimestamp(),
        read: false,
      });

      setSuccess("Registration successful! Redirecting...");
      setFormData({
        firstName: "",
        secondName: "",
        course: selectedCourse,
        whatsapp: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => navigate("/student-dashboard"), 2000);
    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use")
        setError("This WhatsApp number is already registered.");
      else setError("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-portal-container">
      <form className="student-form" onSubmit={handleSubmit}>
        <h2>Student Registration</h2>

        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
        />

        <input
          type="text"
          name="secondName"
          placeholder="Second Name"
          value={formData.secondName}
          onChange={handleChange}
        />

        {/* Select Course */}
        <select
          name="course"
          value={formData.course}
          onChange={handleChange}
        >
          <option value="">Select a course</option>
          {availableCourses.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="whatsapp"
          placeholder="WhatsApp Number"
          value={formData.whatsapp}
          onChange={handleChange}
        />

        {/* Password */}
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{ position: "absolute", right: 10, top: 10, cursor: "pointer" }}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        {/* Confirm Password */}
        <div style={{ position: "relative" }}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{ position: "absolute", right: 10, top: 10, cursor: "pointer" }}
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </span>
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Already have an account?{" "}
          <Link to="/student-login" style={{ color: "#007bff" }}>
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default StudentRegister;
