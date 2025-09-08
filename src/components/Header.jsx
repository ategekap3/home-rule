import React, { useState } from 'react';
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="header">
      <div className="header-top">
        <img src="/school-logo.jpeg" alt="School Logo" width="120" />
        <h1>MODERN COMPUTER WORLD UG</h1>
      </div>

      <div className="header-info">
        <p><strong>Motto:</strong> "Digitalise yourself & future"</p>
        <p><strong>Mission:</strong> Focused on training the world move and meet with the trending technology by enabling them use a computer</p>
        <p><strong>Vision:</strong> To have a fully digital world.</p>
      </div>

     

      <div className="menu-icon" onClick={toggleMenu}>
        <div className={`bar1 ${menuOpen ? 'change' : ''}`}></div>
        <div className={`bar2 ${menuOpen ? 'change' : ''}`}></div>
        <div className={`bar3 ${menuOpen ? 'change' : ''}`}></div>
      </div>
    </header>
  );
};

export default Header;
