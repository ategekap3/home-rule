import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { StudySessionsData } from "./StudySessions";

const StudySessionsHome = () => {
  const navigate = useNavigate();
  const todayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = weekdays[todayIndex];

  const getNextAvailableSession = (session) => {
    // Online & Home sessions → Mon-Fri
    if (session.type === "online" || session.type === "home") {
      if (["Monday","Tuesday","Wednesday","Thursday","Friday"].includes(today)) {
        return session.id;
      }
    }
    // Physical sessions → Sat-Sun
    if (session.type === "physical") {
      if (["Saturday","Sunday"].includes(today)) {
        return session.id;
      }
    }
    return null;
  };

  const handleRegisterClick = (session) => {
    const nextId = getNextAvailableSession(session);
    if (nextId) {
      navigate(`/book-session?id=${nextId}`);
    } else {
      alert("This session is not available today. Please choose another day.");
    }
  };

  // Filter next 3 sessions for today
  const upcomingSessions = StudySessionsData.filter(s => getNextAvailableSession(s) !== null).slice(0, 3);

  return (
    <section id="study-sessions-home" style={{ padding: "40px 20px", backgroundColor: "#f9f9f9", borderRadius: "8px", margin: "40px 0" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Upcoming Study Sessions</h2>

      {upcomingSessions.length === 0 ? (
        <p style={{ textAlign: "center", color: "#555" }}>No sessions scheduled for today. Please check back later.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          {upcomingSessions.map(session => {
            let bgColor = "#e0f2ff";
            if (session.type === "physical") bgColor = "#e6ffed";
            if (session.type === "home") bgColor = "#fff0f6";
            const badgeColor = session.type === "online" ? "#0ea5e9" : session.type === "physical" ? "#16a34a" : "#db2777";

            return (
              <div key={session.id} style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "12px", backgroundColor: bgColor }}>
                <h3>{session.title}</h3>
                <p><strong>Type:</strong> <span style={{ color: badgeColor, fontWeight: "bold" }}>{session.type.charAt(0).toUpperCase() + session.type.slice(1)}</span></p>
                <p><strong>Days:</strong> {session.days}</p>
                <p><strong>Time:</strong> {session.time}</p>
                <p><strong>Location:</strong> {session.location}</p>
                <p><strong>Instructor:</strong> {session.instructor}</p>
                <button
                  onClick={() => handleRegisterClick(session)}
                  style={{
                    display: "inline-block",
                    marginTop: "12px",
                    backgroundColor: "#1e40af",
                    color: "#fff",
                    padding: "10px 18px",
                    borderRadius: "6px",
                    border: "none",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  Register
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <Link
          to="/study-sessions"
          style={{ display: "inline-block", backgroundColor: "#1e40af", color: "#fff", padding: "12px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: "bold" }}
        >
          View All Sessions
        </Link>
      </div>
    </section>
  );
};

export default StudySessionsHome;
