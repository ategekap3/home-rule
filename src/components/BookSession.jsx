import React, { useState } from 'react';
import './BookSession.css';

function BookSession() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
  });

  const openModal = () => {
    setModalOpen(true);
    setSubmitted(false);
    setLoading(false);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormData({ name: '', email: '', date: '', time: '' });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://formspree.io/f/myzdogpe', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: new FormData(e.target),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', date: '', time: '' });
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      alert('Submission failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Floating Button */}
      <button className="floating-button" onClick={openModal}>
        📅 Book a Session
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate">
            <button className="close-button" onClick={closeModal}>×</button>

            {loading ? (
              <div className="loading-spinner"></div>
            ) : !submitted ? (
              <>
                <h2>Book a Session</h2>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                    required
                  />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />

                  {/* Optional honeypot for spam protection */}
                  <input
                    type="text"
                    name="_gotcha"
                    style={{ display: 'none' }}
                  />

                  <button type="submit">Submit</button>
                </form>
              </>
            ) : (
              <div className="thank-you">
                <h3>✅ Thank you!</h3>
                <p>Your session request has been sent.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BookSession;
