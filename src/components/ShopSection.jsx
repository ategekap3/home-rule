// src/components/ShopSection.jsx
import React, { useState } from "react";
import { laptops } from "./LaptopData"; // ensure this points to your data
import CustomerOrderModal from "../pages/CustomerOrderModal";
import './ShopSection.css';

export default function LaptopShop() {
  const [selectedLaptop, setSelectedLaptop] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const conversionRate = 3700; // 1 USD = 3700 UGX

  const handleOrder = (laptop) => {
    setSelectedLaptop(laptop);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedLaptop(null);
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {laptops.map((laptop, index) => (
        // Use a combination of id + index to guarantee uniqueness
        <div key={`${laptop.id}-${index}`} className="border rounded-2xl shadow-lg p-4 text-center">
          <img src={laptop.image} alt={laptop.name} className="mx-auto w-40 h-40 object-cover mb-4" />
          <h2 className="text-xl font-bold">{laptop.name}</h2>
          <p className="text-gray-600">{laptop.description}</p>
          <p className="text-lg font-semibold mt-2">
            UGX {(laptop.price * conversionRate).toLocaleString()}
          </p>
          <button
            onClick={() => handleOrder(laptop)}
            className="mt-3 bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded-lg"
          >
            Order Now
          </button>
        </div>
      ))}

      {showModal && selectedLaptop && (
        <CustomerOrderModal laptop={selectedLaptop} onClose={closeModal} />
      )}
    </div>
  );
}
