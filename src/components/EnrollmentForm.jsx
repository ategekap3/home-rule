// src/components/EnrollmentForm.jsx
import React, { useState } from 'react';
import './EnrollmentForm.css'; // CSS for styling

const Admit = ({ formData, onReset }) => {
  return (
    <div className="admit-container">
      <h2>🎉 Admission Successful!</h2>
      <p>Welcome, <strong>{formData.firstName} {formData.secondName}</strong>!</p>
      <p>You've enrolled in: <strong>{formData.course}</strong></p>
      <p>We’ll contact you at: <strong>{formData.phone}</strong></p>
      <p>Nationality: <strong>{formData.nationality}</strong></p>
      <button className="reset-btn" onClick={onReset}>Enroll Another</button>
    </div>
  );
};

function EnrollmentForm({ addAdmission }) {
  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    phone: '',
    course: '',
    nationality: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

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
    addAdmission(formData);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      secondName: '',
      phone: '',
      course: '',
      nationality: ''
    });
    setIsSubmitted(false);
  };

  return (
    <div className="container">
      {!isSubmitted ? (
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

          <button type="submit" className="submit-btn">Submit</button>
        </form>
      ) : (
        <Admit formData={formData} onReset={handleReset} />
      )}
    </div>
  );
}

export default EnrollmentForm;
