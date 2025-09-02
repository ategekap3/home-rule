// src/pages/Home.jsx

import React from "react";
import EnrollmentForm from "../components/EnrollmentForm";
import ServicesNav from "../components/ServicesNav";
import ServiceSection from "../components/ServicesSection";
import Gallery from "./Gallery";
import Courses from "./Courses";
import WhatsAppButton from "../components/WhatsAppButton";

const Home = () => {
  const onFormSubmit = (formData) => {
    alert('Form submitted! The admin will be notified.');
    console.log('Enrollment Form Data:', formData);
  };

  return (
    <div style={{ padding: '1rem', textAlign: 'center' }}>
      <h1>Welcome to Our School</h1>
      <h3>We are the leading computer tutors and IT service providers to the low-budget market</h3>
      <p>Enroll in your desired course below.</p>

      {/* Sliding service buttons */}
      <ServicesNav />

      {/* Service sections with multiple images */}
      <ServiceSection
        id="computer-repair"
        title="Computer Repair"
        images={[
          '/images/repair1.jpg',
          '/images/repair2.jpg',
          '/images/repair3.jpg'
        ]}
      />

      <ServiceSection
        id="software-installation"
        title="Software Installation"
        images={[
          '/images/software1.jpg',
          '/images/software2.jpg'
        ]}
      />

      <ServiceSection
        id="hardware"
        title="Hardware Support"
        images={[
          '/images/hardware1.jpg',
          '/images/hardware2.jpg'
        ]}
      />

      <ServiceSection
        id="editing"
        title="Video Editing"
        images={[
          '/images/editing1.jpg',
          '/images/editing2.jpg'
        ]}
      />

      {/* Additional content */}
      <Gallery />
      <Courses />
      <EnrollmentForm onFormSubmit={onFormSubmit} />
      <WhatsAppButton />
    </div>
  );
};

export default Home;
