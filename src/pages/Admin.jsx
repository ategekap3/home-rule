// src/pages/Admin.jsx
import React, { useState, useEffect, useRef } from "react";
import { collection, getDocs, query, orderBy, onSnapshot, addDoc } from "firebase/firestore";
import { db, auth } from "../components/firebase";
import "./Admin.css";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [students, setStudents] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState({});
  const [inputValues, setInputValues] = useState({});
  const chatRefs = useRef({});

  // Redirect if not logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) window.location.href = "/admin-login";
    });
    return () => unsubscribe();
  }, []);

  // Fetch Orders
  useEffect(() => {
    const fetchOrders = async () => {
      const snap = await getDocs(collection(db, "laptopOrders"));
      setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchOrders();
  }, []);

  // Fetch Students
  useEffect(() => {
    const q = query(collection(db, "students"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, snap => {
      setStudents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Fetch Admissions
  useEffect(() => {
    const fetchAdmissions = async () => {
      const snap = await getDocs(collection(db, "admissions"));
      setAdmissions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchAdmissions();
  }, []);

  // Fetch Messages
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, snap => {
      const allMsgs = {};
      snap.docs.forEach(docSnap => {
        const data = docSnap.data();
        const studentId = data.senderId === "admin" ? data.receiverId : data.senderId;
        if (!allMsgs[studentId]) allMsgs[studentId] = [];
        allMsgs[studentId].push(data);
      });
      setMessages(allMsgs);

      // Scroll to bottom
      Object.keys(chatRefs.current).forEach(id => {
        chatRefs.current[id]?.scrollTo(0, chatRefs.current[id].scrollHeight);
      });
    });
    return () => unsubscribe();
  }, []);

  const handleSendMessage = async studentId => {
    const text = inputValues[studentId];
    if (!text?.trim()) return;
    await addDoc(collection(db, "messages"), {
      senderId: "admin",
      receiverId: studentId,
      text,
      timestamp: new Date(),
      read: false,
    });
    setInputValues(prev => ({ ...prev, [studentId]: "" }));
  };

  const filteredStudents = students.filter(
    s =>
      s.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button
          className="logout-btn"
          onClick={() => auth.signOut().then(() => window.location.href = "/admin-login")}
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>Orders</button>
        <button className={activeTab === "students" ? "active" : ""} onClick={() => setActiveTab("students")}>Students</button>
        <button className={activeTab === "admissions" ? "active" : ""} onClick={() => setActiveTab("admissions")}>Admissions</button>
      </div>

      <div className="table-wrapper">
        {/* Orders Table */}
        {activeTab === "orders" && (
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Laptop</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td>{o.name}</td>
                  <td>{o.email}</td>
                  <td>{o.phone}</td>
                  <td>{o.laptop?.name || "-"}</td>
                  <td>{o.laptop?.price || "-"}</td>
                  <td>{o.status || "Pending"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Students Table with Chat */}
        {activeTab === "students" && (
          <>
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {filteredStudents.map(s => (
              <div key={s.id} className="dashboard-card">
                <p><strong>Name:</strong> {s.firstName} {s.lastName}</p>
                <p><strong>Email:</strong> {s.email}</p>
                <p><strong>Course:</strong> {s.course}</p>

                {/* Chat */}
                <div className="chat-section">
                  <div className="chat-box" ref={el => chatRefs.current[s.id] = el}>
                    {(messages[s.id] || []).map((m, idx) => (
                      <div key={idx} className={`message ${m.senderId === "admin" ? "from-admin" : "from-student"}`}>
                        {m.text}
                      </div>
                    ))}
                  </div>
                  <div className="chat-form">
                    <input
                      placeholder="Type message..."
                      value={inputValues[s.id] || ""}
                      onChange={e => setInputValues(prev => ({ ...prev, [s.id]: e.target.value }))}
                      onKeyDown={e => { if (e.key === "Enter") { handleSendMessage(s.id); e.preventDefault(); } }}
                    />
                    <button onClick={() => handleSendMessage(s.id)}>Send</button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Admissions Table */}
        {activeTab === "admissions" && (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Course</th>
                <th>Status</th>
                <th>Comments</th>
                <th>Submitted On</th>
              </tr>
            </thead>
            <tbody>
              {admissions.map(a => (
                <tr key={a.id}>
                  <td>{a.firstName} {a.lastName}</td>
                  <td>{a.email}</td>
                  <td>{a.course}</td>
                  <td>{a.status || "Pending"}</td>
                  <td>{a.comments?.join(", ") || "-"}</td>
                  <td>{a.submissionDate ? new Date(a.submissionDate).toLocaleString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
