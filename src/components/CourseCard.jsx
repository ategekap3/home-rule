// src/components/CourseCard.jsx
import React from 'react';
import './CourseCard.css';

const CourseCard = ({ course, onClick }) => {
  if (!course) return null; // prevents undefined errors

  return (
    <div className="course-card" onClick={onClick}>
      <img
        src={course.image}
        alt={course.name}
        className="course-image"
      />

      {/* Overlay */}
      <div className="course-overlay">
        <h3>{course.name}</h3>
        <p>{course.description}</p>
        <p className="fees">{course.fees}</p>
      </div>
    </div>
  );
};

export default CourseCard;