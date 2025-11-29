// src/pages/Admin.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../components/firebase";
import "./Admin.css";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("students"); // "students" or "savings"
  const [students, setStudents] = useState([]);
  const [savingsAccounts, setSavingsAccounts] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [updateAmount, setUpdateAmount] = useState({});
  const [newAccountId, setNewAccountId] = useState("");
  const [messages, setMessages] = useState({});
  const chatRefs = useRef({});

  // Redirect if not logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) window.location.href = "/admin-login";
    });
    return () => unsubscribe();
  }, []);

  // Fetch Students
  useEffect(() => {
    const q = query(collection(db, "students"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setStudents(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Fetch Savings Accounts
  useEffect(() => {
    const q = query(collection(db, "savingsAccounts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setSavingsAccounts(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Fetch Messages
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      const allMsgs = {};
      snap.docs.forEach((docSnap) => {
        const data = docSnap.data();
        const userId = data.senderId === "admin" ? data.receiverId : data.senderId;
        if (!allMsgs[userId]) allMsgs[userId] = [];
        allMsgs[userId].push(data);
      });
      setMessages(allMsgs);

      // Scroll to bottom for chats
      Object.keys(chatRefs.current).forEach((id) => {
        chatRefs.current[id]?.scrollTo(0, chatRefs.current[id].scrollHeight);
      });
    });
    return () => unsubscribe();
  }, []);

  // --- Students ---
  const handleSendMessage = async (userId) => {
    const text = inputValues[userId];
    if (!text?.trim()) return;
    await addDoc(collection(db, "messages"), {
      senderId: "admin",
      receiverId: userId,
      text,
      timestamp: new Date(),
      read: false,
    });
    setInputValues((prev) => ({ ...prev, [userId]: "" }));
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await deleteDoc(doc(db, "students", studentId));
      alert("Student deleted successfully");
      setSelectedStudent(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete student.");
    }
  };

  // --- Savings Accounts ---
  const generateSavingsAccountId = async () => {
    if (!newAccountId) {
      alert("Enter a unique Account ID first.");
      return;
    }
    try {
      await setDoc(doc(db, "savingsAccounts", newAccountId), {
        name: "",
        phone: "",
        accountId: newAccountId,
        balance: 0,
        createdAt: serverTimestamp(),
      });
      alert(`Savings account ${newAccountId} generated successfully!`);
      setNewAccountId("");
    } catch (err) {
      console.error(err);
      alert("Failed to create savings account. Make sure the ID is unique.");
    }
  };

  const handleDeleteSavings = async (accountId) => {
    if (!window.confirm("Are you sure you want to delete this savings account?")) return;
    try {
      await deleteDoc(doc(db, "savingsAccounts", accountId));
      alert("Savings account deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete savings account.");
    }
  };

  const handleUpdateBalance = async (accountId) => {
    const amount = parseFloat(updateAmount[accountId]);
    if (isNaN(amount)) return alert("Enter a valid amount.");
    try {
      const accountRef = doc(db, "savingsAccounts", accountId);
      const current = savingsAccounts.find((acc) => acc.id === accountId)?.balance || 0;
      await updateDoc(accountRef, { balance: current + amount });
      setUpdateAmount((prev) => ({ ...prev, [accountId]: "" }));
    } catch (err) {
      console.error(err);
      alert("Failed to update balance.");
    }
  };

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button
          className="logout-btn"
          onClick={() => auth.signOut().then(() => (window.location.href = "/admin-login"))}
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button className={activeTab === "students" ? "active" : ""} onClick={() => setActiveTab("students")}>
          Students
        </button>
        <button className={activeTab === "savings" ? "active" : ""} onClick={() => setActiveTab("savings")}>
          Savings Members
        </button>
      </div>

      {/* Students Table */}
      {activeTab === "students" && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Course</th>
                <th>WhatsApp</th>
                <th>Send Message</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td>{s.firstName} {s.secondName}</td>
                  <td>{s.course}</td>
                  <td>{s.whatsapp}</td>
                  <td>
                    <input
                      type="text"
                      placeholder="Message"
                      value={inputValues[s.id] || ""}
                      onChange={(e) => setInputValues(prev => ({ ...prev, [s.id]: e.target.value }))}
                    />
                    <button onClick={() => handleSendMessage(s.id)}>Send</button>
                  </td>
                  <td>
                    <button className="btn-danger" onClick={() => handleDeleteStudent(s.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Savings Members Table */}
      {activeTab === "savings" && (
        <div className="table-wrapper">
          <div className="create-savings">
            <input type="text" placeholder="Enter unique Account ID" value={newAccountId} onChange={(e) => setNewAccountId(e.target.value)} />
            <button onClick={generateSavingsAccountId}>Generate Account</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Account ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Balance</th>
                <th>Update Balance</th>
                <th>Send Message</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {savingsAccounts.map((acc) => (
                <tr key={acc.id}>
                  <td>{acc.accountId}</td>
                  <td>{acc.name || "-"}</td>
                  <td>{acc.phone || "-"}</td>
                  <td>UGX {(acc.balance || 0).toLocaleString()}</td>
                  <td>
                    <input
                      type="number"
                      placeholder="Amount"
                      value={updateAmount[acc.id] || ""}
                      onChange={(e) => setUpdateAmount(prev => ({ ...prev, [acc.id]: e.target.value }))}
                      style={{ width: "80px" }}
                    />
                    <button onClick={() => handleUpdateBalance(acc.id)}>Update</button>
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Message"
                      value={inputValues[acc.id] || ""}
                      onChange={(e) => setInputValues(prev => ({ ...prev, [acc.id]: e.target.value }))}
                    />
                    <button onClick={() => handleSendMessage(acc.id)}>Send</button>
                  </td>
                  <td>
                    <button className="btn-danger" onClick={() => handleDeleteSavings(acc.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
