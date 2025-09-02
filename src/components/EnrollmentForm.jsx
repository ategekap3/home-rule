import React, { useState } from 'react';
import './EnrollmentForm.css'; // Optional if you want to style it

function EnrollmentForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    phone: '',
    course: '',
    nationality: ''
  });

  const courses = [
    'Web Development',
    'Graphic Design',
    'Data Science',
    'Digital Marketing',
    'Cybersecurity'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    alert('Form submitted successfully!');
    // You can also send the data to a server or email service here
  };

  return (
    <form className="enrollment-form" onSubmit={handleSubmit}>
      <h2>Enrollment Form</h2>

      <label>First Name</label>
      <input
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        required
      />

      <label>Second Name</label>
      <input
        type="text"
        name="secondName"
        value={formData.secondName}
        onChange={handleChange}
        required
      />

      <label>Phone Number</label>
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        required
      />

      <label>Choose Course</label>
      <select
        name="course"
        value={formData.course}
        onChange={handleChange}
        required
      >
        <option value="">-- Select a course --</option>
        {courses.map((course, idx) => (
          <option key={idx} value={course}>{course}</option>
        ))}
      </select>

      <label>Nationality</label>
      <input
        type="text"
        name="nationality"
        value={formData.nationality}
        onChange={handleChange}
        required
      />

      <button type="submit">Submit</button>
    </form>
  );
}

export default EnrollmentForm;
