// src/pages/Courses.jsx
import { useState } from 'react';
import img1 from '../assets/img1.jpg';
import img2 from '../assets/img2.jpg';
import img3 from '../assets/img3.jpg';
import img4 from '../assets/img4.jpeg';

const courses = [
  { name: 'FUNDAMENTALS OF IT', fees: 'UGX. 450,000', image: img1, description: 'Learn computer basics, internet, email, and file management.'},
  { name: 'GRAPHICS DESIGN', fees: 'UGX. 800,000', image: img2, description: 'Master Photoshop, Illustrator, Canva and digital design.' },
  { name: 'PROGRAMMING', fees: 'UGX. 1,000,000', image: img3, description: 'Learn Python, JavaScript, HTML, CSS and more.' },
  { name: 'MS.OFFICE', fees: 'UGX. 500,000', image: img4, description: 'Includes Word, Excel, Access, PowerPoint, Publisher & Outlook. Free installations included.' },
];

const Courses = () => {
  const [hoveredCourse, setHoveredCourse] = useState(null);

  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Courses We Offer</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
        {courses.map(course => (
          <div
            key={course.name}
            className="course-card"
            onMouseEnter={() => setHoveredCourse(course.name)}
            onMouseLeave={() => setHoveredCourse(null)}
          >
            <img src={course.image} alt={course.name} className="course-image" />
            <div className="course-info">
              <h3>{course.name}</h3>
              <p className="course-fees">{course.fees}</p>
            </div>
            {hoveredCourse === course.name && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'rgba(0,0,0,0.8)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '1rem',
                  borderRadius: '12px',
                }}
              >
                <p>{course.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;