import React, { useState, useEffect } from 'react';
import './Admin.css';
import { collection, onSnapshot, doc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../components/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const statuses = ['pending', 'processing', 'completed', 'cancelled'];

const Admin = () => {
  const [user, setUser] = useState(null);
  const [admissions, setAdmissions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('admissions');
  const [searchAdmission, setSearchAdmission] = useState('');
  const [searchOrder, setSearchOrder] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // Admissions listener
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'admissions'), orderBy('submittedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        submittedAt: doc.data().submittedAt?.toDate() || new Date()
      }));
      setAdmissions(data);
    });
    return () => unsubscribe();
  }, [user]);

  // Orders listener
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        status: doc.data().status || 'pending'
      }));
      setOrders(data);
    });
    return () => unsubscribe();
  }, [user]);

  // Admin login/logout
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setAuthError('');
      toast.success('Login successful!');
    } catch {
      setAuthError('Invalid email or password');
      toast.error('Login failed');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    toast.info('Logged out');
  };

  // Delete helpers
  const handleDeleteAdmission = async (id) => {
    if (window.confirm('Delete this admission?')) {
      await deleteDoc(doc(db, 'admissions', id));
      toast.success('Deleted successfully!');
    }
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm('Delete this order?')) {
      await deleteDoc(doc(db, 'orders', id));
      toast.success('Deleted successfully!');
    }
  };

  // Update order status
  const handleStatusChange = async (id, newStatus) => {
    await updateDoc(doc(db, 'orders', id), { status: newStatus });
    toast.info(`Status updated to ${newStatus}`);
  };

  // Filtered lists
  const filteredAdmissions = admissions.filter(entry =>
    `${entry.firstName} ${entry.secondName} ${entry.course}`.toLowerCase().includes(searchAdmission.toLowerCase())
  );

  const filteredOrders = orders.filter(order => {
    const matchesSearch = `${order.customerName} ${order.laptop} ${order.email}`.toLowerCase().includes(searchOrder.toLowerCase());
    const matchesStatus = orderStatusFilter === 'all' ? true : order.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!user) {
    return (
      <div className="admin-login-container">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin} className="admin-login-form">
          <input type="email" placeholder="Admin Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Admin Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
          {authError && <p className="error-msg">{authError}</p>}
        </form>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={activeTab === 'admissions' ? 'active' : ''} onClick={() => setActiveTab('admissions')}>Admissions</button>
        <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>Laptop Orders</button>
      </div>

      {/* Admissions Table */}
      <div className={`tab-content ${activeTab === 'admissions' ? 'fade-in' : 'fade-out'}`}>
        {activeTab === 'admissions' && (
          <>
            <input
              type="text"
              placeholder="Search by name or course"
              value={searchAdmission}
              onChange={e => setSearchAdmission(e.target.value)}
              className="admin-search-input"
            />
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
                  {filteredAdmissions.map((entry, idx) => (
                    <tr key={entry.id}>
                      <td>{idx + 1}</td>
                      <td>{entry.firstName} {entry.secondName}</td>
                      <td>{entry.course}</td>
                      <td>{entry.phone}</td>
                      <td>{entry.nationality}</td>
                      <td>{entry.submittedAt.toLocaleString()}</td>
                      <td>
                        <button className="delete" onClick={() => handleDeleteAdmission(entry.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Orders Table */}
      <div className={`tab-content ${activeTab === 'orders' ? 'fade-in' : 'fade-out'}`}>
        {activeTab === 'orders' && (
          <>
            <div className="filters">
              <input
                type="text"
                placeholder="Search by customer or laptop"
                value={searchOrder}
                onChange={e => setSearchOrder(e.target.value)}
                className="admin-search-input"
              />
              <select value={orderStatusFilter} onChange={e => setOrderStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="table-wrapper">
              <table className="admissions-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Customer Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Laptop</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Ordered At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, idx) => (
                    <tr key={order.id} className={`row-${order.status}`}>
                      <td>{idx + 1}</td>
                      <td>{order.customerName}</td>
                      <td>{order.email}</td>
                      <td>{order.phone}</td>
                      <td>{order.address}</td>
                      <td>{order.laptop}</td>
                      <td>${order.price}</td>
                      <td>
                        <select
                          className={`status-${order.status}`}
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        >
                          {statuses.map(status => (
                            <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                          ))}
                        </select>
                      </td>
                      <td>{order.createdAt.toLocaleString()}</td>
                      <td>
                        <button className="delete" onClick={() => handleDeleteOrder(order.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Admin;
