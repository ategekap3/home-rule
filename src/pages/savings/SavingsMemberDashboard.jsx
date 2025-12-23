// src/pages/savings/SavingsMemberDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../components/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import "./AccountSavings.css";

const SavingsMemberDashboard = () => {
  const navigate = useNavigate();
  const accountId = localStorage.getItem("savingsAccountId");

  const [member, setMember] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch member info
  useEffect(() => {
    if (!accountId) {
      navigate("/savings-dashboard");
      return;
    }

    const fetchMember = async () => {
      const ref = doc(db, "savingsAccounts", accountId);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        localStorage.removeItem("savingsAccountId");
        navigate("/savings-dashboard");
        return;
      }

      setMember(snap.data());
      setLoading(false);
    };

    fetchMember();
  }, [accountId, navigate]);

  // 🔹 Listen for messages
  useEffect(() => {
    if (!accountId) return;

    const q = query(
      collection(db, "messages"),
      where("receiverId", "==", accountId),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => unsubscribe();
  }, [accountId]);

  const logout = () => {
    localStorage.removeItem("savingsAccountId");
    navigate("/savings-dashboard");
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div className="member-dashboard">
      <h2>Welcome, {member.name}</h2>

      <div className="member-info">
        <p><strong>Account ID:</strong> {accountId}</p>
        <p><strong>Balance:</strong> {member.balance?.toLocaleString()} UGX</p>
      </div>

      {/* 📩 Messages */}
      <div className="messages-section">
        <h3>Messages from Admin</h3>

        <div className="chat-box">
          {messages.length === 0 ? (
            <p>No messages yet.</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="message from-admin">
                <p>{msg.text}</p>
                <small>
                  {msg.timestamp?.toDate().toLocaleString()}
                </small>
              </div>
            ))
          )}
        </div>
      </div>

      <button className="btn-secondary" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default SavingsMemberDashboard;
