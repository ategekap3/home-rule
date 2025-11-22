// src/pages/students/PhoneAuth.jsx
import React, { useState } from "react";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../../components/firebase";
import { useNavigate } from "react-router-dom";

const PhoneAuth = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const [message, setMessage] = useState("");

  // Step 1: Initialize reCAPTCHA and send OTP
  const sendOtp = async () => {
    setMessage("");
    if (!phone) return alert("Enter phone number");

    try {
      const verifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            // reCAPTCHA solved, allow sendOtp
          },
        },
        auth
      );

      const confirmationResult = await signInWithPhoneNumber(auth, phone, verifier);
      setVerificationId(confirmationResult.verificationId);
      setMessage("OTP sent successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to send OTP. Make sure the number is correct and the domain is authorized.");
    }
  };

  // Step 2: Verify OTP
  const verifyOtp = async () => {
    if (!otp) return alert("Enter OTP");
    try {
      const credential = await auth.signInWithPhoneNumber(verificationId, otp);
      // OR: Using confirmationResult from Firebase
      await credential.confirm(otp);

      setMessage("Phone verified successfully!");
      navigate("/student-register"); // Redirect to full registration
    } catch (err) {
      console.error(err);
      setMessage("Invalid OTP. Try again.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h2>Phone Login / Register</h2>
      <div>
        <input
          type="text"
          placeholder="+256700000000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />
        <button onClick={sendOtp} style={{ width: "100%", padding: "0.5rem", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px" }}>
          Send OTP
        </button>
      </div>

      {verificationId && (
        <div style={{ marginTop: "1rem" }}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
          />
          <button onClick={verifyOtp} style={{ width: "100%", padding: "0.5rem", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "4px" }}>
            Verify OTP
          </button>
        </div>
      )}

      <div id="recaptcha-container"></div>
      {message && <p style={{ marginTop: "1rem", color: "green" }}>{message}</p>}
    </div>
  );
};

export default PhoneAuth;
