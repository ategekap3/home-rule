// src/pages/students/StudentDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { auth, db } from "../../components/firebase";
import { collection, query, where, onSnapshot, addDoc, orderBy, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./StudentPortal.css";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [student, setStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const chatRef = useRef();

  // Fetch student data
  useEffect(() => {
    if (!user) {
      navigate("/student-login");
      return;
    }

    const docRef = doc(db, "students", user.uid);
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) setStudent({ id: snap.id, ...snap.data() });
      else setStudent(null);
    });

    return () => unsubscribe();
  }, [user, navigate]);

  // Fetch messages between student and admin
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      const msgs = snap.docs
        .map(doc => doc.data())
        .filter(m => m.senderId === user.uid || m.receiverId === user.uid);
      setMessages(msgs);

      // scroll to bottom
      setTimeout(() => {
        chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
      }, 100);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    await addDoc(collection(db, "messages"), {
      senderId: user.uid,
      receiverId: "admin",
      text: inputValue,
      timestamp: new Date(),
    });
    setInputValue("");
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      try {
        await deleteDoc(doc(db, "students", user.uid));
        await auth.currentUser.delete();
        navigate("/student-login");
      } catch (err) {
        alert("Failed to delete account: " + err.message);
      }
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate("/student-login");
  };

  if (!student) return <p>Loading student data...</p>;

  return (
    <div className="student-portal-container">
      <h2>Student Dashboard</h2>
      <button className="logout-btn" onClick={handleLogout} style={{ marginBottom: "20px" }}>
        Logout
      </button>

      <div className="student-info">
        <p><strong>Name:</strong> {student.firstName} {student.lastName}</p>
        <p><strong>Email:</strong> {student.email}</p>
        <p><strong>Course:</strong> {student.course}</p>
        <p><strong>Progress:</strong> {student.progress.join(", ") || "Not started"}</p>
        <button className="btn-secondary" onClick={handleDeleteAccount}>Delete Account</button>
      </div>

      <div className="messages-container">
        <h3>Messages with Admin</h3>
        <div className="chat-box" ref={chatRef}>
          {messages.map((m, idx) => (
            <div key={idx} className={`message ${m.senderId === user.uid ? "from-student" : "from-admin"}`}>
              {m.text}
            </div>
          ))}
        </div>
        <div className="chat-form">
          <input
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if(e.key==="Enter"){ handleSendMessage(); } }}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
