// src/pages/savings/SavingsMemberDashboard.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db, auth } from "../../components/firebase";
import { doc, getDoc, collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import './Savings.css';

const SavingsMemberDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const accountId = location.state?.accountId;

  const [accountData, setAccountData] = useState(null);
  const [messages, setMessages] = useState([]);

  // Fetch account info
  useEffect(() => {
    if (!accountId) {
      navigate("/savings-dashboard"); // redirect if no accountId
      return;
    }

    const fetchAccount = async () => {
      const docRef = doc(db, "savingsAccounts", accountId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAccountData(docSnap.data());
      } else {
        navigate("/savings-dashboard");
      }
    };

    fetchAccount();
  }, [accountId, navigate]);

  // Fetch admin messages
  useEffect(() => {
    if (!accountId) return;
    const q = query(
      collection(db, "messages"),
      where("receiverId", "==", accountId),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map(doc => doc.data());
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [accountId]);

  const handleLogout = () => {
    navigate("/savings-dashboard");
  };

  if (!accountData) return <p>Loading...</p>;

  return (
    <div className="savings-dashboard-container">
      <h1>Welcome, {accountData.name || "Member"}!</h1>
      <p><strong>Account ID:</strong> {accountData.accountId}</p>
      <p><strong>Balance:</strong> UGX {accountData.balance?.toLocaleString()}</p>

      <button className="btn-secondary" onClick={handleLogout}>
        Logout
      </button>

      <h2>Messages from Admin</h2>
      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <div className="messages-list">
          {messages.map((msg, idx) => (
            <div key={idx} className="admin-message">
              {msg.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavingsMemberDashboard;
