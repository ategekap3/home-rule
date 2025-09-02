import React, { useState } from 'react';
import './Admin.css';

const Admin = ({ admissions }) => {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const ADMIN_PASSWORD = 'admin123';  // Change to your desired password

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  if (!authenticated) {
    return (
      <div className="admin-login-container">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin} className="admin-login-form">
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          {error && <p className="error-msg">{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h2>All Admitted Students</h2>
      {admissions.length === 0 ? (
        <p>No admissions yet.</p>
      ) : (
        <ul className="admissions-list">
          {admissions.map((entry, idx) => (
            <li key={entry.id} className="admission-card">
              <div className="admission-header">
                <span className="admission-number">#{idx + 1}</span>
                <span className="admission-date">
                  {entry.submittedAt.toLocaleString()}
                </span>
              </div>
              <div className="admission-info">
                <p><strong>Name:</strong> {entry.firstName} {entry.secondName}</p>
                <p><strong>Course:</strong> {entry.course}</p>
                <p><strong>Phone:</strong> {entry.phone}</p>
                <p><strong>Nationality:</strong> {entry.nationality}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Admin;
