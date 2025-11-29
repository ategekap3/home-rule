import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { db } from "../components/firebase";
import { collection, addDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import papImage from "../assets/papius.png";
import "./BirthdayWidget.css";

const BirthdayWidget = () => {
  const [timeLeft, setTimeLeft] = useState({});
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [attendees, setAttendees] = useState([]);
  const [success, setSuccess] = useState("");

  const birthdayDate = new Date("2025-12-07T00:00:00");

  // Countdown logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = birthdayDate - now;
      if (diff <= 0) {
        setTimeLeft(null);
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Fetch attendees in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "birthdayAttendees"), (snap) => {
      setAttendees(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    try {
      await addDoc(collection(db, "birthdayAttendees"), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      setFormData({ name: "", phone: "" });
      setSuccess("Registered successfully! 🎉");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="birthday-widget-container">
      <Confetti numberOfPieces={timeLeft ? 200 : 0} />
      <div className="birthday-header">
        <img src={papImage} alt="Birthday" className="birthday-image" />
        <h2>Countdown to Papius' Birthday!</h2>
        {timeLeft ? (
          <div className="countdown">
            <span>{timeLeft.days}d</span> :
            <span>{timeLeft.hours}h</span> :
            <span>{timeLeft.minutes}m</span> :
            <span>{timeLeft.seconds}s</span>
          </div>
        ) : (
          <h3>🎉 Happy Birthday! 🎉</h3>
        )}
      </div>

      <div className="birthday-registration">
        <h3>Register to Attend</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />
          <button type="submit">Register</button>
        </form>
        {success && <p className="success">{success}</p>}
      </div>

      <div className="attendees-list">
        <h3>Attendees List</h3>
        <ul>
          {attendees.map((a) => (
            <li key={a.id}>{a.name} - {a.phone}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BirthdayWidget;
