import React from "react";
import "./Notifications.css";

const NotificationsPanel = ({ notifications }) => {
  return (
    <div className="notifications-container">
      <h3>Notifications</h3>
      {(!notifications || notifications.length === 0) ? (
        <p>No notifications yet.</p>
      ) : (
        <ul>
          {notifications.map((note, idx) => (
            <li key={idx} className="notification-item">
              {note.text} <span className="notification-date">{new Date(note.timestamp).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPanel;
