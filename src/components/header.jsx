import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

const sections = [
  { id: 'courses', label: 'Courses' },
  { id: 'laptop-shop', label: 'Laptop Shop' },
  { id: 'services', label: 'Services' }
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

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
    closeMenu();
  };

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
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo + School Info */}
        <div className="logo-info">
          <img src="/school-logo.jpeg" alt="School Logo" className="school-logo" />
          <div className="school-text">
            <h1>MODERN COMPUTER WORLD UG</h1>
            <p><strong>Motto:</strong> "Digitalise yourself & future"</p>
            <p><strong>Mission:</strong> Focused on training the world move and meet with the trending technology by enabling them use a computer</p>
            <p><strong>Vision:</strong> To have a fully digital world.</p>
          </div>
        </div>

        {/* Navigation Links */}
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive && !activeSection ? 'nav-link active' : 'nav-link')} onClick={closeMenu}>
              Home
            </NavLink>
          </li>
          {sections.map(sec => (
            <li key={sec.id}>
              <span className={`nav-link ${activeSection === sec.id ? 'active' : ''}`} onClick={() => scrollToSection(sec.id)}>
                {sec.label}
              </span>
            </li>
          ))}
          <li>
            <NavLink to="/enroll-now" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu}>
              Enroll-now
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu}>
              Admin
            </NavLink>
          </li>
        </ul>

        {/* Hamburger */}
        <div className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {/* Mobile overlay */}
      <div className={`mobile-overlay ${menuOpen ? 'show' : ''}`}>
        <ul>
          <li>
            <NavLink to="/" className="nav-link" onClick={closeMenu}>Home</NavLink>
          </li>
          {sections.map(sec => (
            <li key={sec.id}>
              <span className="nav-link" onClick={() => scrollToSection(sec.id)}>
                {sec.label}
              </span>
            </li>
          ))}
          <li>
            <NavLink to="/enroll-now" className="nav-link" onClick={closeMenu}>Enroll-now</NavLink>
          </li>
          <li>
            <NavLink to="/admin" className="nav-link" onClick={closeMenu}>Admin</NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
