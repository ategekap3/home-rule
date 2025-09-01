import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/header';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Admin from './pages/Admin';
import CourseCard from './components/CourseCard';
import EnrollmentForm from './components/EnrollmentForm';
import Footer from './components/Footer';
import Gallery from './pages/Gallery';
import WhatsAppButton from './components/WhatsAppButton';


function App() {
  return (
    <Router>
      <Header />
      <Navbar />
      <Routes>
         <Route path="/" element={<Home />} />
        <Route path="/Gallery" element={<Gallery />} />
       
        <Route path="/courses" element={<Courses />} />
        <Route path="/admin" element={<Admin />} />
        
      </Routes>
      <WhatsAppButton/>
      <Footer/>
  
    </Router>
  );
}

export default App;
