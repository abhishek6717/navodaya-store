import React, { useState } from "react";
import "./ImageGallery.css";

const ImageGallery = ({ productId, productName, apiUrl }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const imageUrl = `${apiUrl}/api/v1/product/product-photo/${productId}`;

  return (
    <div className="image-gallery">
      <div
        className={`gallery-main-wrapper ${isZoomed ? "zoomed" : ""}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        <div
          className="gallery-main-image"
          style={
            isZoomed
              ? {
                  backgroundImage: `url(${imageUrl})`,
                  backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  backgroundSize: "200%",
                }
              : {}
          }
        >
          <img src={imageUrl} alt={productName} />
        </div>

        {isZoomed && (
          <div className="zoom-indicator">
            <span>🔍</span>
          </div>
        )}
      </div>

      <div className="gallery-badge">
        <span>High Quality Image</span>
      </div>
    </div>
  );
};

export default ImageGallery;
