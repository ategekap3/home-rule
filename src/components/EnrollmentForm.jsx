import React, { useState, useEffect } from 'react';
import './EnrollmentForm.css';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../components/firebase';

const Admit = ({ formData, onReset }) => {
  return (
    <div className="admit-container">
      <h2>🎉 Admission Successful!</h2>
      <p>Welcome, <strong>{formData.firstName} {formData.secondName}</strong>!</p>
      <p>You've enrolled in: <strong>{formData.course}</strong></p>
      <p>We’ll contact you at: <strong>{formData.phone}</strong></p>
      <p>Nationality: <strong>{formData.nationality}</strong></p>
      <button className="reset-btn" onClick={onReset}>Close</button>
    </div>
  );
};

function EnrollmentForm({ selectedCourse = '' }) {
  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    phone: '',
    course: selectedCourse || '',
    nationality: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const courses = [
    'Ms. Office suite',
    'Web Development',
    'Graphic Design',
    'Fundamentals of IT',
    'Web Design & Development'
  ];

  useEffect(() => {
    if (selectedCourse) {
      setFormData(prev => ({ ...prev, course: selectedCourse }));
    }
  }, [selectedCourse]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await addDoc(collection(db, 'admissions'), {
        ...formData,
        submittedAt: serverTimestamp(),
      });
      setIsSubmitted(true);
      setIsSubmitting(false);

      // Auto-close the success message after 3 seconds
      setTimeout(() => {
        handleReset();
      }, 3000);
    } catch (err) {
      console.error("Error submitting admission:", err);
      setError('Failed to submit. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      secondName: '',
      phone: '',
      course: selectedCourse || '',
      nationality: ''
    });
    setIsSubmitted(false);
    setError('');
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

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
          {error && <p className="error-msg">{error}</p>}
        </form>
      ) : (
        <Admit formData={formData} onReset={handleReset} />
      )}
    </div>
  );
}

export default EnrollmentForm;
