import React from 'react';
import './ServicesNav.css';

const ServicesNav = () => {
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="services-nav">
      <button onClick={() => scrollToSection('web-design')}>Web Design</button>
      <button onClick={() => scrollToSection('seo')}>SEO Optimization</button>
      <button onClick={() => scrollToSection('branding')}>Branding</button>
    </div>
  );
};

export default ServicesNav;
