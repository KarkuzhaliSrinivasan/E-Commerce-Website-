import React from "react";
import "./ProductCard.scss";

export default function ProductCard() {
  return (
    <div className="product-wrapper">
      {/* Product Image */}
      <div className="product-image-section">
        <img
          src="/earpod.png"
          alt="Earpod"
          className="product-image"
        />
      </div>

      {/* White Background Section */}
      <div className="product-info">
        <h2 className="product-title">Bluetooth EarPods</h2>

        <p className="product-description">
          High-quality bass | Fast Charging | 48 hrs Battery Backup
        </p>

        <div className="price-box">
          <span className="price">₹999</span>
          <span className="old-price">₹1999</span>
        </div>

        <button className="buy-btn">Buy Now</button>
      </div>
    </div>
  );
}
