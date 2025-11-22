// src/pages/students/PhoneRegister.jsx
import React, { useState } from "react";
import { auth, db, RecaptchaVerifier, signInWithPhoneNumber } from "../../components/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, serverTimestamp, addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./StudentPortal.css";

const availableCourses = [
  "Web Development",
  "Graphic Design",
  "Video Editing",
  "IT Support",
  "Data Science",
];

const PhoneRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = phone, 2 = OTP, 3 = full registration
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    course: "",
    whatsapp: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // --- STEP 1: Send OTP ---
  const sendOtp = async () => {
    if (!phone) return alert("Enter phone number");

    try {
      const verifier = new RecaptchaVerifier(
        "recaptcha-container",
        { size: "invisible" },
        auth
      );

      const confirmationResult = await signInWithPhoneNumber(auth, phone, verifier);
      setVerificationId(confirmationResult.verificationId);
      setStep(2);
      setMessage("OTP sent to your phone!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to send OTP. Check phone number and domain authorization.");
    }
  };

  // --- STEP 2: Verify OTP ---
  const verifyOtp = async () => {
    if (!otp) return alert("Enter OTP");
    try {
      const credential = await auth.signInWithPhoneNumber(verificationId, otp);
      await credential.confirm(otp);
      setStep(3); // Move to full registration
      setMessage("Phone verified! Complete your registration.");
    } catch (err) {
      console.error(err);
      setMessage("Invalid OTP. Try again.");
    }
  };

  // --- STEP 3: Full Registration ---
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, course, whatsapp, password, confirmPassword } = formData;

    if (!firstName || !lastName || !course || !whatsapp || !password || !confirmPassword) {
      setMessage("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // Firebase Auth using phone as email substitute (temporary)
      const email = `${phone.replace(/\D/g, "")}@mcwug.com`; // e.g., +256700000000 -> 256700000000@mcwug.com
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save student in Firestore
      await setDoc(doc(db, "students", user.uid), {
        uid: user.uid,
        firstName,
        lastName,
        phone,
        course,
        whatsapp,
        progress: [course],
        certificates: [],
        notifications: [],
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

      setMessage("Registration successful! Redirecting to dashboard...");
      setTimeout(() => navigate("/student-dashboard"), 2000);
    } catch (err) {
      console.error(err);
      setMessage("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-portal-container">
      {step === 1 && (
        <div>
          <h2>Enter Your Phone</h2>
          <input type="text" placeholder="+256700000000" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <button onClick={sendOtp}>Send OTP</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Enter OTP</h2>
          <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <button onClick={verifyOtp}>Verify OTP</button>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit}>
          <h2>Complete Registration</h2>
          <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
          <input type="text" name="lastName" placeholder="Second Name" value={formData.lastName} onChange={handleChange} />
          <select name="course" value={formData.course} onChange={handleChange}>
            <option value="">Select Course</option>
            {availableCourses.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="text" name="whatsapp" placeholder="WhatsApp Number" value={formData.whatsapp} onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
          <button type="submit" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
        </form>
      )}

      <div id="recaptcha-container"></div>
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default PhoneRegister;
