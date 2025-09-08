import { useState } from 'react';
import CourseCard from '../components/CourseCard';
import EnrollmentForm from '../components/EnrollmentForm';

// Import images correctly
import img1 from '../assets/img1.jpg';
import img2 from '../assets/img2.jpg';
import img3 from '../assets/img3.jpg';
import img4 from '../assets/img4.jpeg';

const courses = [
  { name: 'Fundamentals of IT', fees: 'UGX 450', image: img1 },
  { name: 'Graphics Design', fees: 'UGX 800', image: img2 },
  { name: 'PROGRAMMING', fees: 'UGX. 1000', image: img3 },
  { name: 'MS.OFFICE', fees: 'UGX. 500', image: img4 },
];

const Courses = () => {
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
            onFormSubmit={(data) => {
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
