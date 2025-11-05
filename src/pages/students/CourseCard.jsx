import React from "react";

const CourseCard = ({ course, completed, certificate }) => {
  const progressPercent = completed ? 100 : 50;

  return (
    <div className="course-card">
      <h3>{course.title}</h3>
      <p>Last Accessed: {course.lastAccessed ? new Date(course.lastAccessed.seconds*1000).toLocaleDateString() : "Not Started"}</p>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progressPercent}%` }}></div>
      </div>
      {completed ? (
        <p>Certificate: Available</p>
      ) : (
        <p>Your certificate will appear after course completion</p>
      )}
      <button className="btn-primary">Continue</button>
    </div>
  );
};

export default CourseCard;
