// src/pages/students/StudentRegister.jsx
import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../../components/firebase";
import { useNavigate, Link } from "react-router-dom";
import "./StudentPortal.css";

const StudentRegister = ({ selectedCourse = "" }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    course: selectedCourse,
    nationality: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedCourse) {
      setFormData(prev => ({ ...prev, course: selectedCourse }));
    }
  }, [selectedCourse]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    setSuccess("");

    const { firstName, lastName, dob, course, nationality, email, password, confirmPassword } = formData;

    if (!firstName || !lastName || !dob || !course || !nationality || !email || !password || !confirmPassword) {
      setError("All fields are required."); return;
    }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "students", user.uid), {
        uid: user.uid,
        firstName,
        lastName,
        dob,
        course,
        nationality,
        email,
        progress: [],
        comments: [],
        createdAt: new Date(),
      });

      setSuccess("Registration successful!");
      setFormData({ firstName:"", lastName:"", dob:"", course:selectedCourse, nationality:"", email:"", password:"", confirmPassword:"" });

      setTimeout(() => navigate("/student-dashboard"), 2000);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") setError("This email is already registered.");
      else if (err.code === "auth/invalid-email") setError("Invalid email address.");
      else if (err.code === "auth/weak-password") setError("Password should be at least 6 characters.");
      else setError("Registration failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="student-portal-container">
      <form className="student-form" onSubmit={handleSubmit}>
        <h2>Student Registration</h2>

        <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
        <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
        <input type="text" name="course" value={formData.course} readOnly placeholder="Selected Course" />
        <input type="text" name="nationality" placeholder="Nationality" value={formData.nationality} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />

        {error && <div className="error">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
          <button type="button" onClick={() => window.history.back()} className="btn-secondary">
            Cancel
          </button>
        </div>

        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Already have an account? <Link to="/student-login" style={{ color: "#007bff" }}>Login</Link>
        </p>
      </form>
    </div>
  );
};

export default StudentRegister;
