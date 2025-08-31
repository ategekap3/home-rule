import { useState } from 'react';
import PDFButton from './PDFButton';

const EnrollmentForm = ({ selectedCourse, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: selectedCourse || ''
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if(!formData.name || !formData.email || !formData.course){
      alert('Please fill in all fields');
      return;
    }
    onFormSubmit(formData);
  };

  return (
    <PDFButton filename={`Enrollment-${formData.name || 'form'}.pdf`}>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Enrollment Form</h2>
        <label>
          Name:<br />
          <input name="name" value={formData.name} onChange={handleChange} required />
        </label><br /><br />
        <label>
          Email:<br />
          <input name="email" type="email" value={formData.email} onChange={handleChange} required />
        </label><br /><br />
        <label>
          Course:<br />
          <select name="course" value={formData.course} onChange={handleChange} required>
            <option value="">Select Course</option>
            <option value="ICT">Fundamentals of IT</option>
             <option value="ICT">Ms Office suite</option>
            <option value="Math">Programming</option>
            <option value="Science">Graphics Design</option>
          </select>
        </label><br /><br />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>Submit</button>
      </form>
    </PDFButton>
  );
};

export default EnrollmentForm;
