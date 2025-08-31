const CourseCard = ({ course, onClick }) => (
  <div
    onClick={() => onClick(course)}
    style={{
      cursor: 'pointer',
      border: '1px solid #aaa',
      borderRadius: '8px',
      padding: '1rem',
      margin: '1rem',
      width: '250px',
      boxShadow: '1px 1px 5px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s',
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
  >
    <img src={course.image} alt={course.name} style={{ width: '100%', borderRadius: '4px' }} />
    <h3>{course.name}</h3>
    <p><strong>Fees:</strong> {course.fees}</p>
  </div>
);

export default CourseCard;
