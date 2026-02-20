import React from "react";

// ================== Session Data ==================
export const StudySessionsData = [
  // Online Zoom classes every weekday
  {
    id: 1,
    title: "Programming & Graphics",
    type: "online",
    days: "Monday - Friday",
    time: "8:30 PM UAE Time",
    location: "Zoom Link: https://zoom.us/j/123456789",
    instructor: "Pius",
  },
  {
    id: 2,
    title: "MS Office Suite",
    type: "online",
    days: "Monday - Friday",
    time: "8:30 PM UAE Time",
    location: "Zoom Link: https://zoom.us/j/987654321",
    instructor: "William",
  },

  // Physical classes only on weekends
  {
    id: 3,
    title: "Programming & Graphics",
    type: "physical",
    days: "Saturday & Sunday",
    time: "2:00 PM - 4:00 PM",
    location: "Dubai Mall Exit 2",
    instructor: "Pius",
  },
  {
    id: 4,
    title: "MS Office Suite",
    type: "physical",
    days: "Saturday & Sunday",
    time: "2:00 PM - 4:00 PM",
    location: "Dubai Mall Exit 2",
    instructor: "William",
  },

  // One-on-one / home study sessions, flexible days/time
  {
    id: 5,
    title: "Programming & Graphics (Home Study)",
    type: "home",
    days: "Monday - Friday",
    time: "Flexible, student can choose",
    location: "Student's Preferred Location",
    instructor: "Pius",
  },
  {
    id: 6,
    title: "MS Office Suite (Home Study)",
    type: "home",
    days: "Monday - Friday",
    time: "Flexible, student can choose",
    location: "Student's Preferred Location",
    instructor: "William",
  },
];

// ================== StudySessions Component ==================
const StudySessions = () => {
  return (
    <div style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Study Sessions</h2>

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
                transition: "transform 0.2s",
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
              <a
                href="#"
                style={{
                  display: "inline-block",
                  marginTop: "12px",
                  backgroundColor: "#1e40af",
                  color: "#fff",
                  padding: "10px 18px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Register
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudySessions;
