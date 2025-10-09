// src/components/CustomerOrderModal.jsx
import React, { useState } from "react";
import { db } from "../components/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import './CustomerOrderModal.css';

const CustomerOrderModal = ({ laptop, onClose }) => {
  const [customer, setCustomer] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: ""
  });

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "laptopOrders"), { // match Admin
        laptop: { name: laptop.name, price: laptop.price },
        ...customer,
        status: "Pending", // default status
        createdAt: serverTimestamp()
      });
      alert(`Order placed successfully for ${laptop.name}!`);
      onClose();
    } catch (error) {
      console.error("Error adding order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  if (!laptop) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Order: {laptop.name}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="customerName"
            placeholder="Your Name"
            value={customer.customerName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={customer.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={customer.phone}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={customer.address}
            onChange={handleChange}
            required
          />
          <button type="submit">Submit Order</button>
        </form>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default CustomerOrderModal;
