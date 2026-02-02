import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HeroBanner.css";

const HeroBanner = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Summer Collection 2026",
      subtitle: "Discover the latest trends",
      cta: "Shop Now",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      icon: "🌞",
    },
    {
      id: 2,
      title: "Exclusive Deals",
      subtitle: "Up to 70% off selected items",
      cta: "Explore Deals",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      icon: "🎁",
    },
    {
      id: 3,
      title: "New Arrivals",
      subtitle: "Fresh products added daily",
      cta: "View Latest",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      icon: "⭐",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <div className="hero-banner">
      <div
        className="hero-slide active"
        style={{ background: slide.gradient }}
      >
        <div className="hero-content">
          <div className="hero-icon">{slide.icon}</div>
          <h1 className="hero-title">{slide.title}</h1>
          <p className="hero-subtitle">{slide.subtitle}</p>
          <button
            className="hero-cta"
            onClick={() => navigate("/")}
          >
            {slide.cta} →
          </button>
        </div>

        {/* Animated shapes */}
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      {/* Slide indicators */}
      <div className="hero-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? "active" : ""}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      <button className="hero-nav prev" onClick={prevSlide}>
        ❮
      </button>
      <button className="hero-nav next" onClick={nextSlide}>
        ❯
      </button>
    </div>
  );
};

export default HeroBanner;
