import React from "react";
import CourseCard from "./CourseCard";

const CoursesSection = ({ courses }) => (
  <div className="courses-section">
    <h2>My Courses</h2>
    <div className="courses-grid">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  </div>
);

export default CoursesSection;
