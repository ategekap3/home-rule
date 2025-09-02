// src/pages/Courses.jsx
import { useState } from 'react';
import CourseCard from '../components/CourseCard';
import EnrollmentForm from '../components/EnrollmentForm';

const courses = [
  { name: 'Fundamentals of IT', fees: '$200', image: '.assets/HH.webp' },
  { name: 'Graphics Design', fees: '$150', image: '..//DESIGN.jpg' },
  { name: 'Science', fees: '$180', image: '/science.jpg' }
];

const Courses = ({ addAdmission }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Courses We Offer</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {courses.map(course => (
          <CourseCard key={course.name} course={course} onClick={setSelectedCourse} />
        ))}
      </div>

      {selectedCourse && (
        <>
          <h3>Enroll in {selectedCourse.name}</h3>
          <EnrollmentForm
            selectedCourse={selectedCourse.name}
            addAdmission={(data) => {
              addAdmission(data);
              alert(`Form submitted for ${data.course}`);
              console.log('Enrollment Data:', data);
              setSelectedCourse(null); // close form after submission
            }}
          />
        </>
      )}
    </div>
  );
};

export default Courses;
