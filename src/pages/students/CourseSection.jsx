import React from "react";
import CourseCard from "./CourseCard";

const CoursesSection = ({ courses, student }) => (
  <div className="courses-section">
    <h2>My Courses</h2>
    {courses.length === 0 ? <p>No courses enrolled</p> :
      <div className="courses-grid">
        {courses.map((course) => {
          const completed = student.progress.includes(course.id);
          const certificate = student.certificates?.includes(course.id);
          return <CourseCard key={course.id} course={course} completed={completed} certificate={certificate} />;
        })}
      </div>
    }
  </div>
);

export default CoursesSection;
