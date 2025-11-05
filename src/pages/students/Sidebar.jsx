import React from "react";
import { FaTachometerAlt, FaBook, FaUser, FaEnvelope, FaBell, FaSignOutAlt } from "react-icons/fa";

const Sidebar = ({ active, setActive, handleLogout }) => {
  const menu = [
    { name: "Dashboard", icon: <FaTachometerAlt /> },
    { name: "Courses", icon: <FaBook /> },
    { name: "Profile", icon: <FaUser /> },
    { name: "Messages", icon: <FaEnvelope /> },
    { name: "Notifications", icon: <FaBell /> },
    { name: "Logout", icon: <FaSignOutAlt /> },
  ];

  return (
    <aside className="sidebar">
      <h2>MCW UG</h2>
      <ul>
        {menu.map((item) => (
          <li
            key={item.name}
            className={active === item.name ? "active" : ""}
            onClick={() => item.name === "Logout" ? handleLogout() : setActive(item.name)}
          >
            <span className="icon">{item.icon}</span>
            {item.name}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
