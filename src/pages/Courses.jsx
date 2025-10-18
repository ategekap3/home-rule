// src/pages/Courses.jsx
import { useState } from 'react';
import CourseCard from '../components/CourseCard';
import StudentRegister from './students/StudentRegister';

// Import images correctly
import img1 from '../assets/img1.jpg';
import img2 from '../assets/img2.jpg';
import img3 from '../assets/img3.jpg';
import img4 from '../assets/img4.jpeg';

const courses = [
  { name: 'FUNDAMENTALS OF IT', fees: 'UGX. 450,000', image: img1 },
  { name: 'GRAPHICS DESIGN', fees: 'UGX. 800,000', image: img2 },
  { name: 'PROGRAMMING', fees: 'UGX. 1000,000', image: img3 },
  { name: 'MS.OFFICE', fees: 'UGX. 500,000', image: img4 },
];

const Courses = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleCloseForm = () => setSelectedCourse(null);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Courses We Offer</h2>
      {!selectedCourse && (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {courses.map(course => (
            <CourseCard key={course.name} course={course} onClick={() => setSelectedCourse(course.name)} />
          ))}
        </div>
      )}

      {selectedCourse && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Enroll in {selectedCourse}</h3>
          <button
            onClick={handleCloseForm}
            style={{
              marginBottom: '1rem',
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#dc3545',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>

          <StudentRegister selectedCourse={selectedCourse} />
        </div>
      )}
    </div>
  );
};

export default Courses;
