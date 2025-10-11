// src/pages/Shop.jsx
import React from "react";
import LaptopShop from "./ShopSection";

const Shop = () => {
  return (
    <div className="shop-page" style={{ padding: "2rem" }}>
      <h2 className="text-3xl font-bold mb-6">Laptop Shop</h2>
      <LaptopShop />
    </div>
  );
};

export default Shop;
