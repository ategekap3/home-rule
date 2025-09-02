// src/components/ServicesNav.jsx
import React from 'react';
import './ServicesNav.css';

const services = [
  { name: 'Computer Repair', targetId: 'computer-repair' },
  { name: 'Software Installation', targetId: 'software-installation' },
  { name: 'Hardware Support', targetId: 'hardware' },
  { name: 'Video Editing', targetId: 'editing' },
];

const ServicesNav = () => {
  return (
    <div className="services-nav">
      <div className="services-scroll">
        {services.map((service) => (
          <a key={service.name} href={`#${service.targetId}`} className="service-button">
            {service.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default ServicesNav;
