import React, { useState, useEffect } from "react";
import './TopNav.css';

const sections = [
  { id: "courses", label: "Courses" },
  { id: "laptop-shop", label: "Laptop Shop" },
  { id: "services", label: "Services" }
];

const TopNav = () => {
  const [activeSection, setActiveSection] = useState("courses");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const handleScroll = () => {
    const scrollPos = window.scrollY + 100;
    let current = "courses";
    sections.forEach(section => {
      const elem = document.getElementById(section.id);
      if (elem && elem.offsetTop <= scrollPos) {
        current = section.id;
      }
    });
    setActiveSection(current);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="top-nav">
      <div className="nav-container">
        <div className="logo">MySchool</div>
        <ul className={`nav-links ${isMobileMenuOpen ? "open" : ""}`}>
          {sections.map(sec => (
            <li
              key={sec.id}
              className={activeSection === sec.id ? "active" : ""}
              onClick={() => scrollToSection(sec.id)}
            >
              {sec.label}
            </li>
          ))}
        </ul>
        <div className={`hamburger ${isMobileMenuOpen ? "open" : ""}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      {/* Full screen mobile menu overlay */}
      <div className={`mobile-overlay ${isMobileMenuOpen ? "show" : ""}`}>
        <ul>
          {sections.map(sec => (
            <li key={sec.id} onClick={() => scrollToSection(sec.id)}>
              {sec.label}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default TopNav;
