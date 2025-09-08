import React, { useState } from "react";
import './ServicesSection.css';

const ServiceSection = ({ id, title, images = [] }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

  const openLightbox = (imgSrc) => {
    setActiveImage(imgSrc);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setActiveImage(null);
  };

  return (
    <section id={id} className="service-section">
      <h2>{title}</h2>
      <div className="image-grid">
        {images.map((img, index) => (
          <div
            key={index}
            className="image-wrapper"
            onClick={() => openLightbox(img)}
          >
            <img src={img} alt={`${title} ${index + 1}`} />
            <div className="caption">{`${title} ${index + 1}`}</div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={activeImage} alt="Enlarged view" />
            <button className="close-button" onClick={closeLightbox}>×</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ServiceSection;
