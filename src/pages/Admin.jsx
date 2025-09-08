import React, { useState, useEffect } from 'react';
import './Admin.css';
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
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [admissions, setAdmissions] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'admissions'), orderBy('submittedAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        submittedAt: doc.data().submittedAt?.toDate() || new Date(),
      }));
      setAdmissions(data);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setAuthError('');
    } catch (error) {
      setAuthError('Invalid email or password');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this admission?')) {
      await deleteDoc(doc(db, 'admissions', id));
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry({ ...entry });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingEntry((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const entryRef = doc(db, 'admissions', editingEntry.id);
    await updateDoc(entryRef, {
      firstName: editingEntry.firstName,
      secondName: editingEntry.secondName,
      phone: editingEntry.phone,
      course: editingEntry.course,
      nationality: editingEntry.nationality,
    });
    setEditingEntry(null);
  };

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
          />
          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          {authError && <p className="error-msg">{authError}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>All Admitted Students</h2>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      {admissions.length === 0 ? (
        <p>No admissions yet.</p>
      ) : (
        <div className="table-wrapper">
          <table className="admissions-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Course</th>
                <th>Phone</th>
                <th>Nationality</th>
                <th>Submitted At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admissions.map((entry, idx) => (
                <tr key={entry.id}>
                  <td>{idx + 1}</td>
                  <td>{entry.firstName} {entry.secondName}</td>
                  <td>{entry.course}</td>
                  <td>{entry.phone}</td>
                  <td>{entry.nationality}</td>
                  <td>{entry.submittedAt.toLocaleString()}</td>
                  <td>
                    <button onClick={() => handleEdit(entry)}>Edit</button>
                    <button onClick={() => handleDelete(entry.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
          />
          <input
            type="text"
            name="secondName"
            value={editingEntry.secondName}
            onChange={handleEditChange}
            required
          />
          <input
            type="tel"
            name="phone"
            value={editingEntry.phone}
            onChange={handleEditChange}
            required
          />
          <input
            type="text"
            name="course"
            value={editingEntry.course}
            onChange={handleEditChange}
            required
          />
          <input
            type="text"
            name="nationality"
            value={editingEntry.nationality}
            onChange={handleEditChange}
            required
          />
          <div className="edit-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditingEntry(null)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Admin;
