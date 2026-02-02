import React, { useEffect, useState } from "react";
import "./PromoBanner.css";

const PromoBanner = ({ position = "top" }) => {
  const [isVisible, setIsVisible] = useState(true);

  const banners = [
    {
      id: 1,
      text: "🚚 Free Shipping on Orders Above ₹500",
      bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      id: 2,
      text: "💳 Easy EMI Options Available - 0% Interest",
      bgGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      id: 3,
      text: "🎯 Hassle-Free Returns Within 30 Days",
      bgGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
  ];

  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`promo-banner ${position}`}
      style={{ background: banners[currentBanner].bgGradient }}
    >
      <p className="promo-text">{banners[currentBanner].text}</p>
      <button 
        className="promo-close" 
        onClick={() => setIsVisible(false)}
      >
        ✕
      </button>
    </div>
  );
};

export default PromoBanner;
