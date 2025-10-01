import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import Courses from "./Courses";
import ServicesSection from "../components/ServicesSection";
import Gallery from "./Gallery";
import LaptopShop from "../components/ShopSection";
import WhatsAppButton from "../components/WhatsAppButton";

import repair1 from '../assets/repair1.jpeg';
import repair2 from '../assets/repair2.jpeg';
import repair3 from '../assets/repair3.jpeg';
import software1 from '../assets/software1.jpeg';
import software2 from '../assets/software2.jpeg';
import hardware1 from '../assets/hardware1.jpeg';
import hardware2 from '../assets/hardware2.jpeg';
import editing1 from '../assets/editing1.jpeg';
import editing2 from '../assets/editing2.jpeg';

import './Home.css';

const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="home-container">

      {/* Hero Section */}
      <section className="hero-section" data-aos="fade-down" style={{ backgroundImage: "url('../assets/hero-bg.jpeg')" }}>
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Modern Computer World UG</h1>
            <p>Empowering you with the latest IT skills and affordable technology solutions.</p>
            <a href="#courses" className="btn-primary">Explore Courses</a>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="courses-section" data-aos="fade-up" style={{ backgroundColor: "#f9fafb" }}>
        <h2>Our Courses</h2>
        <Courses />
      </section>

      {/* Laptop Shop Section */}
      <section id="shop" className="shop-section" data-aos="fade-up" style={{ backgroundColor: "#eef2ff" }}>
        <h2>Shop Laptops</h2>
        <LaptopShop />
      </section>

      {/* Services Section */}
      <section id="services" className="services-section" data-aos="fade-up" style={{ backgroundColor: "#fff7ed" }}>
        <h2>Our Services</h2>
        <div className="services-grid">
          <ServicesSection id="computer-repair" title="Computer Repair" images={[repair1, repair2, repair3]} bgColor="#fff7ed" />
          <ServicesSection id="software-installation" title="Software Installation" images={[software1, software2]} bgColor="#fffbe6" />
          <ServicesSection id="hardware" title="Hardware Support" images={[hardware1, hardware2]} bgColor="#ecfdf5" />
          <ServicesSection id="editing" title="Video Editing" images={[editing1, editing2]} bgColor="#fff1f2" />
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="gallery-section" data-aos="fade-up" style={{ backgroundColor: "#f0f9ff" }}>
        <h2>Gallery</h2>
        <Gallery />
      </section>

      <WhatsAppButton />
    </div>
  );
};

export default Home;
