import React from "react";
import EnrollmentForm from "../components/EnrollmentForm";
import ServicesNav from "../components/ServicesNav";
import ServiceSection from "../components/ServicesSection";
import Gallery from "./Gallery";
import Courses from "./Courses";
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
  const onFormSubmit = (formData) => {
    alert('Form submitted! The admin will be notified.');
    console.log('Enrollment Form Data:', formData);
  };

  return (
    <div className="home-container">
      <div className="tech-background"></div>

      <h1>Welcome to Our School</h1>
      <h3>We are the leading computer tutors and IT service providers to the low-budget market</h3>
      <p>Enroll in your desired course below.</p>

      <ServicesNav />

      <ServiceSection
        id="computer-repair"
        title="Computer Repair"
        images={[repair1, repair2, repair3]}
      />

      <ServiceSection
        id="software-installation"
        title="Software Installation"
        images={[software1, software2]}
      />

      <ServiceSection
        id="hardware"
        title="Hardware Support"
        images={[hardware1, hardware2]}
      />

      <ServiceSection
        id="editing"
        title="Video Editing"
        images={[editing1, editing2]}
      />

      <Gallery />
      <Courses />
      <EnrollmentForm onFormSubmit={onFormSubmit} />
      <WhatsAppButton />
    </div>
  );
};

export default Home;
