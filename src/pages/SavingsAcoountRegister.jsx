import React, { useState } from "react";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../components/firebase";
import { useNavigate } from "react-router-dom";
import "./Savings.css";

const SavingsRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    whatsapp: "",
    initialDeposit: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { firstName, secondName, whatsapp, initialDeposit } = formData;

    if (!firstName || !secondName || !whatsapp || !initialDeposit) {
      setError("All fields are required.");
      return;
    }

    if (!/^\d{10,15}$/.test(whatsapp)) {
      setError("Enter a valid WhatsApp number (digits only).");
      return;
    }

    const depositAmount = parseFloat(initialDeposit);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      setError("Enter a valid initial deposit amount.");
      return;
    }

    try {
      const accountRef = doc(db, "savingsAccounts", whatsapp); // use whatsapp as unique ID
      await setDoc(accountRef, {
        firstName,
        secondName,
        whatsapp,
        balance: depositAmount,
        createdAt: serverTimestamp(),
      });

      setSuccess("Account created successfully!");
      setTimeout(() => navigate("/savings-dashboard"), 2000);
    } catch (err) {
      console.error(err);
      setError("Failed to create account. Try again.");
    }
  };

  return (
    <div className="savings-register-container">
      <h2>Open Savings Account</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
        <input type="text" name="secondName" placeholder="Second Name" value={formData.secondName} onChange={handleChange} />
        <input type="text" name="whatsapp" placeholder="WhatsApp Number" value={formData.whatsapp} onChange={handleChange} />
        <input type="number" name="initialDeposit" placeholder="Initial Deposit (UGX)" value={formData.initialDeposit} onChange={handleChange} />

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <button type="submit" className="btn-primary">Create Account</button>
      </form>

      <div className="savings-info">
        <h3>Terms & Conditions</h3>
        <p>- Minimum lock-in period: 3 months.</p>
        <p>- No withdrawals before maturity.</p>
        <h3>Why Open a Savings Account?</h3>
        <ul>
          <li>Secure your money</li>
          <li>Earn fixed returns</li>
          <li>Track your deposits easily</li>
        </ul>
      </div>
    </div>
  );
};

export default SavingsRegister;
