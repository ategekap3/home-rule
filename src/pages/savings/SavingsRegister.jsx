// src/pages/savings/SavingsRegister.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../components/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import './AccountSavings.css';
import BackToDashboard from "../../components/BackToDashboard";

const SavingsRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "", phone: "", accountId: "", password: "", confirmPassword: "", acceptedTerms: false
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(""); setSuccess("");
    const { name, phone, accountId, password, confirmPassword, acceptedTerms } = formData;

    if (!name || !phone || !accountId || !password || !confirmPassword) {
      setError("All fields are required."); return;
    }
    if (!acceptedTerms) { setError("You must accept Terms & Conditions."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }

    try {
      const accountRef = doc(db, "savingsAccounts", accountId);
      const accountSnap = await getDoc(accountRef);

      if (!accountSnap.exists()) { setError("Invalid Account ID. Contact admin."); return; }
      if (accountSnap.data().name) { setError("This account is already registered."); return; }

      await setDoc(accountRef, {
        name, phone, accountId, password, registrationFee: 50, balance: 0,
        acceptedTerms, createdAt: serverTimestamp()
      });

      setSuccess("Account registered successfully!");
      setFormData({ name:"", phone:"", accountId:"", password:"", confirmPassword:"", acceptedTerms:false });

      setTimeout(() => navigate("/savings-member-dashboard"), 1000);

    } catch (err) {
      console.error(err); setError("Failed to register. Try again.");
    }
  };

  return (
    <div className="savings-dashboard-container">
      <h1>Register Your Savings Account</h1>
      <p>Registration Fee: <strong>50 AED</strong></p>

      <form className="savings-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="savings-input" />
        <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="savings-input" />
        <input type="text" name="accountId" placeholder="Account ID (given by admin)" value={formData.accountId} onChange={handleChange} className="savings-input" />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="savings-input" />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="savings-input" />

        <div className="terms-checkbox">
          <input type="checkbox" id="acceptTerms" name="acceptedTerms" checked={formData.acceptedTerms} onChange={handleChange} />
          <label htmlFor="acceptTerms">I accept the Terms & Conditions</label>
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button type="submit" className="btn-primary">Register Account</button>
      </form>
      <BackToDashboard/>
    </div>
  );
};

export default SavingsRegister;
