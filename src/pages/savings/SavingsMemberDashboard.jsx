// src/pages/savings/SavingsMemberDashboard.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../components/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import './AccountSavings.css';

const SavingsMemberDashboard = () => {
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accountId = localStorage.getItem("savingsMemberId");
    if (!accountId) {
      navigate("/savings-dashboard");
      return;
    }

    const fetchMember = async () => {
      try {
        const docRef = doc(db, "savingsAccounts", accountId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setMember(docSnap.data());
        } else {
          alert("Member not found. Contact admin.");
          localStorage.removeItem("savingsMemberId");
          navigate("/savings-dashboard");
        }
      } catch (err) {
        console.error(err);
        alert("Error fetching member data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("savingsMemberId");
    navigate("/savings-dashboard");
  };

  if (loading) return <p>Loading member dashboard...</p>;

  return (
    <div className="savings-dashboard-container">
      <h1>Welcome, {member.name}</h1>
      <p>Account ID: {member.accountId}</p>
      <p>Phone: {member.phone}</p>
      <p>Balance: {member.balance?.toLocaleString() || 0} UGX</p>
      <button className="btn-secondary" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default SavingsMemberDashboard;
