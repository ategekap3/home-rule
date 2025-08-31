import React from 'react';
import '../Footer.css';
  import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">MODERN COMPUTER WORLD UG</div>

        <nav className="footer-nav">
          <a href="#">Home</a>
          <a href="#about">About</a>
          <a href="#gallery">Gallery</a>
          <a href="#contact">Contact</a>
        </nav>

      

<div className="footer-socials">
  <a href="https://github.com/yourhandle" target="_blank"><FaGithub /></a>
  <a href="https://linkedin.com/in/yourhandle" target="_blank"><FaLinkedin /></a>
  <a href="https://twitter.com/yourhandle" target="_blank"><FaTwitter /></a>
</div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} MyPortfolio. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
