import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/Auth";
import "./RelatedProductsCarousel.css";

const RelatedProductsCarousel = ({ products = [], apiUrl }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { auth } = useAuth();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) setItemsPerView(1);
      else if (window.innerWidth < 768) setItemsPerView(2);
      else if (window.innerWidth < 1024) setItemsPerView(3);
      else setItemsPerView(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + 1, Math.max(0, products.length - itemsPerView))
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  if (products.length === 0) return null;

  return (
    <div className="related-products-carousel">
      <h2 className="carousel-title">🔗 Related Products</h2>

      <div className="carousel-wrapper">
        <button
          className="carousel-control prev"
          onClick={prevSlide}
          disabled={currentIndex === 0}
          aria-label="Previous products"
        >
          ❮
        </button>

        <div className="carousel-viewport">
          <div
            className="carousel-list"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {products.map((product) => (
              <div key={product._id} className="carousel-product-item">
                <div className="related-product-card">
                  <div className="related-img-container">
                    <img
                      src={`${apiUrl}/api/v1/product/product-photo/${product._id}`}
                      alt={product.name}
                      className="related-product-img"
                    />
                    {(new Date() - new Date(product.createdAt)) < 86400000 && (
                      <span className="new-badge">New</span>
                    )}
                  </div>

                  <div className="related-product-info">
                    <h3 className="related-product-name">{product.name}</h3>
                    <p className="related-product-category">
                      {product.category?.name}
                    </p>
                    <p className="related-product-price">₹{product.price}</p>

                    <div className="related-product-buttons">
                      <button
                        className="btn-view-details"
                        onClick={() => navigate(`/product/${product._id}`)}
                      >
                        View
                      </button>
                      <button
                        className="btn-add-related"
                        onClick={() => {
                          if (!auth?.user) {
                            toast.error("Please login to buy items");
                            navigate("/login");
                            return;
                          }
                          addToCart(product);
                          navigate("/checkout");
                        }}
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="carousel-control next"
          onClick={nextSlide}
          disabled={
            currentIndex >= Math.max(0, products.length - itemsPerView)
          }
          aria-label="Next products"
        >
          ❯
        </button>
      </div>
    </div>
  );
};

export default RelatedProductsCarousel;
