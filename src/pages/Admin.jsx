// src/pages/Admin.jsx
import React, { useState, useEffect, useRef } from "react";
import { collection, getDocs, query, orderBy, onSnapshot, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../components/firebase";
import "./Admin.css";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("students");
  const [students, setStudents] = useState([]);
  const [messages, setMessages] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);
  const chatRefs = useRef({});

  // Redirect if not logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) window.location.href = "/admin-login";
    });
    return () => unsubscribe();
  }, []);

  // Fetch Students
  useEffect(() => {
    const q = query(collection(db, "students"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, snap => {
      setStudents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
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

  const handleDeleteStudent = async studentId => {
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

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <p>Total Students: {students.length}</p>
        <button
          className="logout-btn"
          onClick={() => auth.signOut().then(() => window.location.href = "/admin-login")}
        >
          Logout
        </button>
      </div>

      {/* Students List */}
      <div className="students-wrapper">
        <div className="students-list">
          {students.map(s => (
            <div
              key={s.id}
              className={`student-item ${selectedStudent?.id === s.id ? "selected" : ""}`}
              onClick={() => setSelectedStudent(s)}
            >
              <p><strong>{s.firstName} {s.secondName}</strong></p>
              <p>{s.course}</p>
              <p>{s.whatsapp}</p>
            </div>
          ))}
        </div>

        {selectedStudent && (
          <div className="student-chat-details">
            <div className="student-info">
              <h3>{selectedStudent.firstName} {selectedStudent.secondName}</h3>
              <p><strong>Course:</strong> {selectedStudent.course}</p>
              <p><strong>WhatsApp:</strong> {selectedStudent.whatsapp}</p>
              <button className="btn-danger" onClick={() => handleDeleteStudent(selectedStudent.id)}>Delete Student</button>
            </div>

            {/* Chat */}
            <div className="chat-section">
              <div className="chat-box" ref={el => chatRefs.current[selectedStudent.id] = el}>
                {(messages[selectedStudent.id] || []).map((m, idx) => (
                  <div key={idx} className={`message ${m.senderId === "admin" ? "from-admin" : "from-student"}`}>
                    {m.text}
                  </div>
                ))}
              </div>
              <div className="chat-form">
                <input
                  placeholder="Type message..."
                  value={inputValues[selectedStudent.id] || ""}
                  onChange={e => setInputValues(prev => ({ ...prev, [selectedStudent.id]: e.target.value }))}
                  onKeyDown={e => { if (e.key === "Enter") { handleSendMessage(selectedStudent.id); e.preventDefault(); } }}
                />
                <button onClick={() => handleSendMessage(selectedStudent.id)}>Send</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
