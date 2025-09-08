const CourseCard = ({ course, onClick }) => {
  return (
    <div className="course-card" onClick={() => onClick(course)} style={{ cursor: 'pointer', margin: '1rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', width: '220px', textAlign: 'center' }}>
      <img src={course.image} alt={course.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} />
      <h3>{course.name}</h3>
      <p>{course.fees}</p>
    </div>
  );
};

export default CourseCard;
