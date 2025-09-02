// src/components/ServicesSection.jsx
import React, { useState } from 'react';
import './ServicesSection.css';

const ServiceSection = ({ id, title, images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(null);

  const openModal = (index) => setCurrentImageIndex(index);
  const closeModal = () => setCurrentImageIndex(null);

  const goNext = () => {
    if (currentImageIndex !== null) {
      setCurrentImageIndex((currentImageIndex + 1) % images.length);
    }
  };

  const goPrev = () => {
    if (currentImageIndex !== null) {
      setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length);
    }
  };

  return (
    <section id={id} className="service-section">
      <h2>{title}</h2>
      <div className="service-gallery">
        {images.map((img, index) => (
          <img
            key={index}
            src={img.src}
            alt={img.caption || `${title} ${index + 1}`}
            onClick={() => openModal(index)}
          />
        ))}
      </div>

      {currentImageIndex !== null && (
        <div className="lightbox" onClick={closeModal}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <span className="lightbox-close" onClick={closeModal}>&times;</span>

            <img
              src={images[currentImageIndex].src}
              alt={images[currentImageIndex].caption || `Image ${currentImageIndex + 1}`}
            />

            {/* ✅ Custom Caption */}
            <p className="lightbox-caption">
              {images[currentImageIndex].caption || `${title} - Image ${currentImageIndex + 1}`}
            </p>

            <button className="lightbox-nav left" onClick={goPrev}>&#10094;</button>
            <button className="lightbox-nav right" onClick={goNext}>&#10095;</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ServiceSection;
