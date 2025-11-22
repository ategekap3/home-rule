import React, { useState } from "react";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../../components/firebase";

const PhoneLogin = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [message, setMessage] = useState("");

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible", // invisible or 'normal'
        callback: (response) => {
          console.log("reCAPTCHA solved");
        },
      },
      auth
    );
  };

  const sendOtp = async () => {
    if (!phone) return alert("Enter phone number");

    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      setMessage("OTP sent successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to send OTP. Try again.");
    }
  };

  const verifyOtp = async () => {
    if (!otp || !confirmationResult) return;

    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      console.log("Phone verified user:", user);
      setMessage("Phone number verified! You can now complete registration.");
    } catch (err) {
      console.error(err);
      setMessage("Invalid OTP. Try again.");
    }
  };

  return (
    <div>
      <h2>Phone Number Login</h2>
      <input
        type="tel"
        placeholder="+256700000000"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button onClick={sendOtp}>Send OTP</button>

      {confirmationResult && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}

      <div id="recaptcha-container"></div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PhoneLogin;
