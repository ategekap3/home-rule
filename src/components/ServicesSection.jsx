import React from 'react';
import './ServicesSection.css';

const ServiceSection = ({ id, title, description, image }) => {
  return (
    <section id={id} className="service-section">
      <div className="service-content">
        <img src={image} alt={title} />
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
