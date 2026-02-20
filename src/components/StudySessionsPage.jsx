import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { StudySessionsData } from "../components/StudySessions";

const StudySessionsPage = () => {
  const navigate = useNavigate();
  const todayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const today = weekdays[todayIndex];

  // Function to check if session is available today
  const isSessionAvailableToday = (session) => {
    if (session.type === "online" || session.type === "home") {
      return ["Monday","Tuesday","Wednesday","Thursday","Friday"].includes(today);
    }
    if (session.type === "physical") {
      return ["Saturday","Sunday"].includes(today);
    }
    return false;
  };

  const handleRegisterClick = (session) => {
    if (isSessionAvailableToday(session)) {
      navigate(`/book-session?id=${session.id}`);
    } else {
      alert("This session is not available today. Please check another day.");
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "50px auto", padding: "0 20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "40px" }}>All Study Sessions</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {StudySessionsData.map((session) => {
          let bgColor = "#e0f2ff"; // online default
          if (session.type === "physical") bgColor = "#e6ffed";
          if (session.type === "home") bgColor = "#fff0f6";
          const badgeColor =
            session.type === "online"
              ? "#0ea5e9"
              : session.type === "physical"
              ? "#16a34a"
              : "#db2777";

          return (
            <div
              key={session.id}
              style={{
                border: "1px solid #ccc",
                padding: "20px",
                borderRadius: "12px",
                backgroundColor: bgColor,
                boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
              }}
            >
              <h3>{session.title}</h3>
              <p>
                <strong>Type:</strong>{" "}
                <span style={{ color: badgeColor, fontWeight: "bold" }}>
                  {session.type.charAt(0).toUpperCase() + session.type.slice(1)}
                </span>
              </p>
              <p>
                <strong>Days:</strong> {session.days}
              </p>
              <p>
                <strong>Time:</strong> {session.time}
              </p>
              <p>
                <strong>Location:</strong> {session.location}
              </p>
              <p>
                <strong>Instructor:</strong> {session.instructor}
              </p>

              <button
                onClick={() => handleRegisterClick(session)}
                disabled={!isSessionAvailableToday(session)}
                style={{
                  display: "inline-block",
                  marginTop: "12px",
                  backgroundColor: isSessionAvailableToday(session) ? "#1e40af" : "#94a3b8",
                  color: "#fff",
                  padding: "10px 18px",
                  borderRadius: "6px",
                  border: "none",
                  fontWeight: "bold",
                  cursor: isSessionAvailableToday(session) ? "pointer" : "not-allowed",
                }}
              >
                {isSessionAvailableToday(session) ? "Register" : "Not Available Today"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudySessionsPage;
