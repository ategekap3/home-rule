// src/pages/Courses.jsx
import { useState } from 'react';
import CourseCard from '../components/CourseCard';
import EnrollmentForm from '../components/EnrollmentForm';
import img1 from '../assets/img1.jpg';
import img2 from '../assets/img2.jpg';
import img3 from '../assets/img3.jpg';

const courses = [
  { name: 'Fundamentals of IT', fees: 'UGX.450K', image: '.assets/HH.webp' },
  { name: 'Graphics Design', fees: 'UGX.800K', image: '/assests/img1.jpg' },
  { name: 'Ms. Office Suite', fees: 'UGX.500K', image: '/science.jpg' },
  { name: 'Programming', fees: 'UGX.1000K', image: '.assests/img2.jpg' }
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
