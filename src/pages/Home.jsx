import EnrollmentForm from "../components/EnrollmentForm";
import Gallery from "./Gallery";
import Courses from "./Courses";
import CourseCard from "../components/CourseCard";
import WhatsAppButton from "../components/WhatsAppButton";


const Home = () => {
  const onFormSubmit = (formData) => {
    alert('Form submitted! The admin will be notified.');
    console.log('Enrollment Form Data:', formData);
    // Here you can send formData to backend or API to email PDF etc.
  };

  return (
    <div style={{ padding: '1rem', textAlign: 'center' }}>
      <h1>Welcome to Our School</h1>
      <h3>W are the leading computer tutors and IT service providers to less budget market</h3>
      <p>Enroll in your desired course below.</p>
     

       <Gallery/>
       <Courses/>
        <EnrollmentForm onFormSubmit={onFormSubmit} />
      
        <WhatsAppButton/>

    </div>

    
   
 
  );
  
};

export default Home;
