// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import Courses from "./Courses";
import ServicesSection from "../components/ServicesSection";
import Gallery from "./Gallery";
import ShopSection from "../components/ShopSection";
import WhatsAppButton from "../components/WhatsAppButton";
import BirthdayWidget from "../components/BirthdayWidget";
import Counter from "../components/Counter";

import repair1 from '../assets/repair1.jpeg';
import repair2 from '../assets/repair2.jpeg';
import repair3 from '../assets/repair3.jpeg';
import software1 from '../assets/software1.jpeg';
import software2 from '../assets/software2.jpeg';
import hardware1 from '../assets/hardware1.jpeg';
import hardware2 from '../assets/hardware2.jpeg';
import editing1 from '../assets/editing1.jpeg';
import editing2 from '../assets/editing2.jpeg';
import heroBg from '../assets/hero-gb.jpeg';

import { auth } from "../components/firebase";

import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [memberLoggedIn, setMemberLoggedIn] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    // Check Firebase auth state for savings member
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) setMemberLoggedIn(true);
      else setMemberLoggedIn(false);
    });

    return () => unsubscribe();
  }, []);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  const handleSavingsCTA = () => {
    if (memberLoggedIn) {
      navigate("/savings-member-dashboard"); // go to member dashboard
    } else {
      navigate("/savings-login"); // go to login
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section
        className="hero-section"
        data-aos="fade-down"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Modern Computer World UG</h1>
            <p>Empowering you with the latest IT skills and affordable technology solutions.</p>

            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => scrollToSection("courses")}>Explore Courses</button>
              <Link to="/student-login" className="btn-secondary">Student Login</Link>
              <Link to="/student-register" className="btn-secondary">Register</Link>
              <button className="btn-primary" onClick={() => scrollToSection("shop")}>Buy Laptops</button>
              <button className="btn-primary" onClick={() => scrollToSection("birthday")}>Birthday Countdown</button>
              <button className="btn-primary" onClick={handleSavingsCTA}>Access Savings</button>
            </div>
          </div>
        </div>
      </section>

 { /*   {/* Birthday Section 
      <section id="birthday" data-aos="fade-up" style={{ backgroundColor: "#fff3e0", padding: "40px 0" }}>
       
      </section>* */}

      {/* Courses Section */}
      <section id="courses" className="courses-section" data-aos="fade-up" style={{ backgroundColor: "#f9fafb", padding: "40px 0" }}>
        <h2>Our Courses</h2>
        <Courses />
      </section>

      {/* Laptop Shop Section */}
      <section id="shop" className="shop-section" data-aos="fade-up" style={{ backgroundColor: "#eef2ff", padding: "40px 0" }}>
        <h2>Shop Laptops</h2>
        <ShopSection />
      </section>

      {/* Services Section */}
      <section id="services" className="services-section" data-aos="fade-up" style={{ backgroundColor: "#fff7ed", padding: "40px 0" }}>
        <h2>Our Services</h2>
        <div className="services-grid">
          <ServicesSection id="computer-repair" title="Computer Repair" images={[repair1, repair2, repair3]} bgColor="#fff7ed" />
          <ServicesSection id="software-installation" title="Software Installation" images={[software1, software2]} bgColor="#fffbe6" />
          <ServicesSection id="hardware" title="Hardware Support" images={[hardware1, hardware2]} bgColor="#ecfdf5" />
          <ServicesSection id="editing" title="Video Editing" images={[editing1, editing2]} bgColor="#fff1f2" />
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="gallery-section" data-aos="fade-up" style={{ backgroundColor: "#f0f9ff", padding: "40px 0" }}>
        <h2>Gallery</h2>
        <Gallery />
      </section>

      {/* Counter Section */}
      <Counter />

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
};

export default Home;
