import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  arrayUnion,
  deleteDoc
} from "firebase/firestore";
import { db, auth } from "../components/firebase";
import "./Admin.css";

export default function Admin() {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [totalStudents, setTotalStudents] = useState(0);
  const chatRef = useRef();

  // Redirect if not logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) window.location.href = "/admin-login";
    });
    return () => unsubscribe();
  }, []);

  // Fetch students and count
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "students"), (snap) => {
      const allStudents = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStudents(allStudents);
      setTotalStudents(allStudents.length);
    });
    return () => unsubscribe();
  }, []);

  // Fetch messages for selected student
  useEffect(() => {
    if (!selectedStudent) return;

    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, snap => {
      const msgs = snap.docs
        .map(doc => doc.data())
        .filter(
          m =>
            (m.senderId === "admin" && m.receiverId === selectedStudent.id) ||
            (m.senderId === selectedStudent.id && m.receiverId === "admin")
        );
      setMessages(msgs);

      setTimeout(() => chatRef.current?.scrollTo(0, chatRef.current.scrollHeight), 100);
    });
    return () => unsubscribe();
  }, [selectedStudent]);

  // Send message to selected student
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedStudent) return;

    try {
      await addDoc(collection(db, "messages"), {
        senderId: "admin",
        receiverId: selectedStudent.id,
        text: inputValue,
        timestamp: new Date(),
        read: false,
      });

      const studentRef = doc(db, "students", selectedStudent.id);
      await updateDoc(studentRef, {
        notifications: arrayUnion({
          text: `Admin: ${inputValue}`,
          timestamp: new Date(),
        }),
      });

      setInputValue("");
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Message not sent.");
    }
  };

  // Delete student
  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student? This cannot be undone.")) return;

    try {
      await deleteDoc(doc(db, "students", studentId));
      if (selectedStudent?.id === studentId) setSelectedStudent(null);
      alert("Student deleted successfully.");
    } catch (err) {
      console.error("Failed to delete student:", err);
      alert("Failed to delete student.");
    }
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

      {/* Total Students */}
      <div className="total-students">
        <strong>Total Students:</strong> {totalStudents}
      </div>

      {/* Students List */}
      <div className="students-section">
        <input
          type="text"
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <div className="students-list">
          {filteredStudents.map(s => (
            <div
              key={s.id}
              className={`student-item ${selectedStudent?.id === s.id ? "selected" : ""}`}
              onClick={() => setSelectedStudent(s)}
            >
              <p><strong>{s.firstName} {s.lastName}</strong></p>
              <p>{s.email}</p>
              <button
                onClick={(e) => { e.stopPropagation(); handleDeleteStudent(s.id); }}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat panel */}
      {selectedStudent && (
        <div className="chat-panel">
          <h4>Chat with {selectedStudent.firstName} {selectedStudent.lastName}</h4>
          <div className="chat-box" ref={chatRef}>
            {messages.length === 0 ? (
              <p>No messages yet.</p>
            ) : (
              messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`message ${m.senderId === "admin" ? "from-admin" : "from-student"}`}
                >
                  {m.text}
                </div>
              ))
            )}
          </div>
          <div className="chat-form">
            <input
              placeholder="Type message..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") { handleSendMessage(); e.preventDefault(); } }}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
