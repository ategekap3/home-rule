// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import './NavBar.css';

const sections = [
  { id: 'courses', label: 'Courses' },
  { id: 'services', label: 'Services' },
];

const Navbar = ({ user }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    if (location.pathname !== '/') return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      let current = '';
      sections.forEach((section) => {
        const el = document.getElementById(section.id);
        if (el && el.offsetTop <= scrollPos) current = section.id;
      });
      setActiveSection(current);
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate('/', { replace: false });
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    closeMobileMenu();
  };

  return (
    <nav className={`navbar sticky-navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className={`nav-container ${isScrolled ? 'small' : ''}`}>
        <div className="logo-info">
          <img src="/school-logo.jpeg" alt="School Logo" className="school-logo" />
          <div className="school-text">
            <h1>MODERN COMPUTER WORLD UG</h1>
            <p className="school-motto"><strong>Motto:</strong> "Digitalise yourself & future"</p>
          </div>
        </div>

        {/* Desktop Menu */}
        <ul className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          <li><NavLink to="/home" className="nav-link" onClick={closeMobileMenu}>Home</NavLink></li>
          {sections.map(sec => (
            <li key={sec.id}>
              <span
                className={`nav-link ${activeSection === sec.id ? 'active' : ''}`}
                onClick={() => scrollToSection(sec.id)}
              >
                {sec.label}
              </span>
            </li>
          ))}
          <li>
            <NavLink to="/shop" className="nav-link" onClick={closeMobileMenu}>
              Laptop Shop
            </NavLink>
          </li>
          {!user && (
            <>
              <li><NavLink to="/student-login" className="nav-link" onClick={closeMobileMenu}>Student Login</NavLink></li>
              <li><NavLink to="/student-register" className="nav-link" onClick={closeMobileMenu}>Register</NavLink></li>
            </>
          )}
          {user && (
            <li><NavLink to="/student-dashboard" className="nav-link" onClick={closeMobileMenu}>Dashboard</NavLink></li>
          )}
          <li><NavLink to="/admin" className="nav-link" onClick={closeMobileMenu}>Admin</NavLink></li>
        </ul>

        {/* Hamburger Icon */}
        <div className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`} onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? (
            <span className="close-icon">&times;</span>
          ) : (
            <>
              <span></span>
              <span></span>
              <span></span>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Slide-in */}
      <div className={`mobile-overlay ${isMobileMenuOpen ? 'show' : ''}`} onClick={closeMobileMenu}></div>
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul>
          <li><NavLink to="/" className="nav-link" onClick={closeMobileMenu}>Home</NavLink></li>
          {sections.map(sec => (
            <li key={sec.id}>
              <span className="nav-link" onClick={() => scrollToSection(sec.id)}>{sec.label}</span>
            </li>
          ))}
          <li><NavLink to="/shop" className="nav-link" onClick={closeMobileMenu}>Laptop Shop</NavLink></li>
          {!user && (
            <>
              <li><NavLink to="/student-login" className="nav-link" onClick={closeMobileMenu}>Student Login</NavLink></li>
              <li><NavLink to="/student-register" className="nav-link" onClick={closeMobileMenu}>Register</NavLink></li>
            </>
          )}
          {user && (
            <li><NavLink to="/student-dashboard" className="nav-link" onClick={closeMobileMenu}>Dashboard</NavLink></li>
          )}
          <li><NavLink to="/admin" className="nav-link" onClick={closeMobileMenu}>Admin</NavLink></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
