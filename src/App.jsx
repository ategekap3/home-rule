// src/App.jsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Counter from './components/Counter';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Admin from './pages/Admin';
import Gallery from './pages/Gallery';
import WhatsAppButton from './components/WhatsAppButton';
import Footer from './components/Footer';

import Enroll from './pages/enroll-now';
import BookSession from './components/BookSession';

function App() {
  const [admissions, setAdmissions] = useState([]);

  const addAdmission = (formData) => {
    const newEntry = {
      ...formData,
      id: admissions.length + 1,
      submittedAt: new Date()
    };
    setAdmissions(prev => [...prev, newEntry]);
  };

  return (
    <Router>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Gallery" element={<Gallery />} />

        {/* Pass addAdmission to Courses and Enroll */}
        <Route path="/courses" element={<Courses addAdmission={addAdmission} />} />
        <Route path="/enroll-now" element={<Enroll addAdmission={addAdmission} />} />

        {/* Admin receives admissions */}
        <Route path="/admin" element={<Admin admissions={admissions} />} />
      </Routes>
      <BookSession/>
      <WhatsAppButton />
      <Footer />
    </Router>
  );
}

export default App;
