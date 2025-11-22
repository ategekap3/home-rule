import React, { useState } from 'react';
import img1 from '../assets/img1.jpg';
import img2 from '../assets/img2.jpg';
import img3 from '../assets/img3.jpg';
import './Gallery.css';

const imageData = [
  {
    id: 1,
    image: img1,
    name: 'GRAPHICS DESIGN',
    description: 'We offer current graphics design tools with Adobe master collection, CoreDraw and wondershare filmora. Graphics being one of the most world wanted iconic stuff we mak sure the students get the best in it from our school',
    
    
    

  },
  {
    id: 2,
    image: img2,
    name: 'FUNDAMENTAL OF iT',
    description: 'This gives you a great exisitence in IT WORLD.',
  },
  {
    id: 3,
    image: img3,
    name: 'Programming ',
    description: 'Unkock your coding potential, learn to code, break the mode from zero to hero. Code your dreams into reality.',
  },
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <>
      <div className="gallery-container">
        {imageData.map(({ id, image, name, description }) => (
          <div key={id} className="gallery-card" onClick={() => setSelectedImage({ image, name, description })}>
            <img src={image} alt={name} className="gallery-image" />
            <h3>{name}</h3>
            <p>{description}</p>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="modal" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage.image} alt={selectedImage.name} />
            <h2>{selectedImage.name}</h2>
            <p>{selectedImage.description}</p>
            <button className="close-button" onClick={() => setSelectedImage(null)}>Close</button>
          </div>
        </div>
      
      )}
    </>
  );
};

export default Gallery;
