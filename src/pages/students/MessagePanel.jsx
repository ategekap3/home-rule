import React, { useState, useRef, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../components/firebase";
import "./MessagePanel.css";

const MessagePanel = ({ messages, user }) => {
  const [inputValue, setInputValue] = useState("");
  const chatRef = useRef();

  useEffect(() => {
    // Scroll to bottom when messages change
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    try {
      await addDoc(collection(db, "messages"), {
        senderId: user.uid,
        receiverId: "admin",
        text: inputValue,
        timestamp: new Date(),
      });
      setInputValue("");
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Message not sent.");
    }
  };

  return (
    <div className="messages-container">
      <h3>Messages with Admin</h3>
      <div className="chat-box" ref={chatRef}>
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages.map((m, idx) => (
            <div
              key={idx}
              className={`message ${m.senderId === user.uid ? "from-student" : "from-admin"}`}
            >
              {m.text}
            </div>
          ))
        )}
      </div>
      <div className="chat-form">
        <input
          type="text"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSendMessage(); }}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default MessagePanel;
