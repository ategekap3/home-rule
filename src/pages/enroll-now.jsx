// src/pages/enroll-now.jsx
import React from 'react';
import EnrollmentForm from '../components/EnrollmentForm';

function Enroll({ addAdmission }) {
  return (
    <div>
      <EnrollmentForm addAdmission={addAdmission} />
    </div>
  );
}

export default Enroll;
