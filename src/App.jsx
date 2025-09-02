import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Header from './components/Header';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Admin from './pages/Admin';
import Gallery from './pages/Gallery';
import WhatsAppButton from './components/WhatsAppButton';
import Footer from './components/Footer';

import Enroll from './pages/enroll-now';  // This is your enrollment page (container/component)

function App() {
  // Store all admissions globally here
  const [admissions, setAdmissions] = useState([]);

  // Function to add a new admission
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
      <Header />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Gallery" element={<Gallery />} />
        <Route path="/courses" element={<Courses />} />

        {/* Pass addAdmission function as prop to Enroll */}
        <Route path="/enroll-now" element={<Enroll addAdmission={addAdmission} />} />

        {/* Pass admissions list as prop to Admin */}
        <Route path="/admin" element={<Admin admissions={admissions} />} />
      </Routes>
      <WhatsAppButton />
      <Footer />
    </Router>
  );
}

export default App;
