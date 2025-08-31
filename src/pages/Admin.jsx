import { useState } from 'react';

const Admin = () => {
  // In a real app, you would fetch submissions from a backend
  // For demo, let's store submissions here
  const [submissions, setSubmissions] = useState([]);

  // Placeholder: To extend, add a form submission handler that pushes into this state

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Admin Section</h2>
      <p>This section will display enrollment submissions.</p>
      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <ul>
          {submissions.map((sub, idx) => (
            <li key={idx}>
              {sub.name} enrolled for {sub.course} ({sub.email})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Admin;
