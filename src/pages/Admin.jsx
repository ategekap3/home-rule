import React, { useState, useEffect } from 'react';
import '../pages/Admin.css';
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, auth } from '../components/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

const Admin = () => {
  // Auth state
  const [user, setUser] = useState(null);
  // Admissions list from Firestore
  const [admissions, setAdmissions] = useState([]);
  // Currently editing admission entry
  const [editingEntry, setEditingEntry] = useState(null);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [editError, setEditError] = useState('');

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthError('');
    });
    return () => unsubscribe();
  }, []);

  // Fetch admissions real-time when authenticated
  useEffect(() => {
    if (!user) {
      setAdmissions([]); // clear on logout
      return;
    }

    const q = query(collection(db, 'admissions'), orderBy('submittedAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        submittedAt: doc.data().submittedAt?.toDate() || new Date(),
      }));
      setAdmissions(data);
    }, (error) => {
      console.error("Firestore admissions fetch error:", error);
    });

    return () => unsubscribe();
  }, [user]);

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
    } catch (error) {
      setAuthError('Invalid email or password');
    }
  };

  // Logout handler
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setEditingEntry(null);
  };

  // Delete admission
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this admission?')) {
      try {
        await deleteDoc(doc(db, 'admissions', id));
        // onSnapshot will update admissions automatically
      } catch (error) {
        alert('Failed to delete. Please try again.');
        console.error("Delete admission error:", error);
      }
    }
  };

  // Start editing admission
  const handleEdit = (entry) => {
    setEditError('');
    setEditingEntry({ ...entry });
  };

  // Handle form input changes while editing
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingEntry(prev => ({ ...prev, [name]: value }));
  };

  // Submit edited admission to Firestore
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editingEntry.firstName || !editingEntry.secondName || !editingEntry.phone || !editingEntry.course || !editingEntry.nationality) {
      setEditError('All fields are required.');
      return;
    }

    const entryRef = doc(db, 'admissions', editingEntry.id);
    try {
      await updateDoc(entryRef, {
        firstName: editingEntry.firstName,
        secondName: editingEntry.secondName,
        phone: editingEntry.phone,
        course: editingEntry.course,
        nationality: editingEntry.nationality,
      });
      setEditingEntry(null);
      setEditError('');
    } catch (error) {
      setEditError('Failed to save changes. Please try again.');
      console.error("Update admission error:", error);
    }
  };

  // If user is not authenticated, show login form
  if (!user) {
    return (
      <div className="admin-login-container">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin} className="admin-login-form">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <button type="submit">Login</button>
          {authError && <p className="error-msg">{authError}</p>}
        </form>
      </div>
    );
  }

  // Main admin panel
  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>All Admitted Students</h2>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      {admissions.length === 0 ? (
        <p>No admissions yet.</p>
      ) : (
        <ul className="admissions-list">
          {admissions.map((entry, idx) => (
            <li key={entry.id} className="admission-card">
              <div className="admission-header">
                <span className="admission-number">#{idx + 1}</span>
                <span className="admission-date">{entry.submittedAt.toLocaleString()}</span>
              </div>
              <div className="admission-info">
                <p><strong>Name:</strong> {entry.firstName} {entry.secondName}</p>
                <p><strong>Course:</strong> {entry.course}</p>
                <p><strong>Phone:</strong> {entry.phone}</p>
                <p><strong>Nationality:</strong> {entry.nationality}</p>
              </div>
              <div className="admission-actions">
                <button onClick={() => handleEdit(entry)}>Edit</button>
                <button onClick={() => handleDelete(entry.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editingEntry && (
        <form className="edit-form" onSubmit={handleEditSubmit}>
          <h3>Edit Admission</h3>
          <input
            type="text"
            name="firstName"
            value={editingEntry.firstName}
            onChange={handleEditChange}
            required
            placeholder="First Name"
          />
          <input
            type="text"
            name="secondName"
            value={editingEntry.secondName}
            onChange={handleEditChange}
            required
            placeholder="Second Name"
          />
          <input
            type="tel"
            name="phone"
            value={editingEntry.phone}
            onChange={handleEditChange}
            required
            placeholder="Phone"
          />
          <input
            type="text"
            name="course"
            value={editingEntry.course}
            onChange={handleEditChange}
            required
            placeholder="Course"
          />
          <input
            type="text"
            name="nationality"
            value={editingEntry.nationality}
            onChange={handleEditChange}
            required
            placeholder="Nationality"
          />
          {editError && <p className="error-msg">{editError}</p>}
          <div className="edit-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditingEntry(null)}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Admin;
