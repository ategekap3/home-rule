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

// Import study sessions
import StudySessionsHome from "../components/StudySessionsHome";

import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [memberLoggedIn, setMemberLoggedIn] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

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
      navigate("/savings-member-dashboard");
    } else {
      navigate("/savings-login");
    }
  };

  return (
    <div className="home-container font-sans text-gray-800">
      {/* Navbar */}
      <nav className="fixed w-full bg-white shadow-md z-50">
        <div className="container mx-auto px-4 flex justify-between items-center h-16">
          <div className="text-blue-900 font-bold text-xl cursor-pointer" onClick={() => scrollToSection("hero")}>
            Modern Computer World UG
          </div>
          <div className="space-x-6 hidden md:flex">
            <button onClick={() => scrollToSection("about")} className="hover:text-yellow-500 transition">About</button>
            <button onClick={() => scrollToSection("vision")} className="hover:text-yellow-500 transition">Vision</button>
            <button onClick={() => scrollToSection("programs")} className="hover:text-yellow-500 transition">Programs</button>
            <button onClick={() => scrollToSection("shop")} className="hover:text-yellow-500 transition">Shop</button>
            <button onClick={() => scrollToSection("services")} className="hover:text-yellow-500 transition">Services</button>
            <button onClick={() => scrollToSection("gallery")} className="hover:text-yellow-500 transition">Gallery</button>
            <button onClick={() => scrollToSection("enroll")} className="hover:text-yellow-500 transition">Enroll</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="hero-section relative text-white py-40 text-center"
        style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        data-aos="fade-down"
      >
        <div className="hero-overlay bg-black bg-opacity-50 py-40">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Empowering Communities Through Affordable Digital Skills</h1>
            <p className="text-lg md:text-xl mb-8">Technology is shaping the future. We ensure no one is left behind.</p>
            <div className="space-x-4">
              <button onClick={() => scrollToSection("programs")} className="btn-primary py-3 px-6 rounded bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition">Explore Programs</button>
              <Link to="/student-register" className="btn-secondary py-3 px-6 rounded bg-blue-900 text-white font-bold hover:bg-blue-800 transition">Enroll Now</Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 text-center" data-aos="fade-up">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">About Us</h2>
          <p className="max-w-3xl mx-auto text-lg">
            Modern Computer World UG was founded to make computer education accessible to everyone, especially low-income communities. We provide high-quality, practical computing sessions at a budget-friendly cost — helping individuals learn, grow, and thrive in today’s technology-driven world.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section id="vision" className="py-20 bg-gray-100" data-aos="fade-up">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-12">Our Vision & Mission</h2>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm text-center">
              <h3 className="text-2xl font-semibold text-blue-900 mb-4">Vision</h3>
              <p>To create a digitally empowered society where everyone has access to modern computer skills.</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm text-center">
              <h3 className="text-2xl font-semibold text-blue-900 mb-4">Mission</h3>
              <p>To provide affordable, practical, and accessible computer training that equips individuals with the skills needed to thrive in the digital world.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 text-center" data-aos="fade-up">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-12">Our Programs</h2>
          <StudySessionsHome />
          <Courses />
        </div>
      </section>

      {/* Laptop Shop Section */}
      <section id="shop" className="shop-section py-20 bg-gray-200" data-aos="fade-up">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8">Shop Laptops</h2>
          <ShopSection />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section py-20 bg-gray-50" data-aos="fade-up">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-12">Our Services</h2>
          <div className="services-grid flex flex-wrap justify-center gap-8">
            <ServicesSection id="computer-repair" title="Computer Repair" images={[repair1, repair2, repair3]} bgColor="#fff7ed" />
            <ServicesSection id="software-installation" title="Software Installation" images={[software1, software2]} bgColor="#fffbe6" />
            <ServicesSection id="hardware" title="Hardware Support" images={[hardware1, hardware2]} bgColor="#ecfdf5" />
            <ServicesSection id="editing" title="Video Editing" images={[editing1, editing2]} bgColor="#fff1f2" />
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="gallery-section py-20 bg-blue-50" data-aos="fade-up">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8">Gallery</h2>
          <Gallery />
        </div>
      </section>

      {/* Counter Section */}
      <Counter />

      {/* CTA Section */}
      <section id="enroll" className="py-20 bg-yellow-400 text-black text-center" data-aos="fade-up">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Secure Your Digital Future Today</h2>
          <p className="max-w-2xl mx-auto mb-8">Don’t let high costs limit your potential. Join Modern Computer World UG and start learning the skills that will shape your tomorrow.</p>
          <Link to="/student-register" className="bg-blue-900 text-white font-bold py-3 px-8 rounded hover:bg-blue-800 transition">Enroll Now</Link>
        </div>
      </section>

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
};

export default Home;