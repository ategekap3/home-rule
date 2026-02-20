<div
  key={course.id}
  className="course-card"
  onMouseEnter={() => setHoveredCourse(course.id)}
  onMouseLeave={() => setHoveredCourse(null)}
>
  <img src={course.image} alt={course.name} className="course-image" />
  <div className="course-info">
    <h3>{course.name}</h3>
    <p className="course-fees">{course.fees}</p>

    {isEnrolled ? (
      <span className="enrolled-badge">Enrolled</span>
    ) : (
      <button
        className="btn-primary"
        onClick={(e) => {
          e.stopPropagation();
          handleEnroll(course.id);
        }}
      >
        Enroll
      </button>
    )}
  </div>

  {hoveredCourse === course.id && (
    <div className="hover-description">
      {course.name === "MS.OFFICE"
        ? "Includes Word, Excel, Access, PowerPoint, Publisher & Outlook. Free installations included."
        : "Course description goes here."}
    </div>
  )}
</div>