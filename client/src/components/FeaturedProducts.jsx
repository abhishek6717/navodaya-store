import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/Auth";
import "./FeaturedProducts.css";

const FeaturedProducts = ({ products = [] }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { auth } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  const featuredItems = products.slice(0, 16);
  const totalPages = Math.ceil(featuredItems.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = featuredItems.slice(startIndex, endIndex);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (featuredItems.length === 0) return null;

  return (
    <div className="featured-products">
      <div className="featured-header">
        <div>
          <h2 className="featured-title">✨ Featured Products</h2>
          <p className="featured-subtitle">
            Trending items our customers love
          </p>
        </div>
        <a href="/" className="view-all">
          View All →
        </a>
      </div>

      <div className="pagination-container">
        <button
          className="pagination-nav prev"
          onClick={prevPage}
          disabled={currentPage === 0}
        >
          ❮ Previous
        </button>

        <div className="products-grid">
          {currentItems.map((product) => (
            <div key={product._id} className="featured-card">
              <div className="featured-image-wrapper">
                <img
                  src={`${apiUrl}/api/v1/product/product-photo/${product._id}`}
                  alt={product.name}
                  className="featured-image"
                />
                {(new Date() - new Date(product.createdAt)) <
                  86400000 && (
                  <span className="featured-badge">New</span>
                )}
              </div>

              <div className="featured-info">
                <h4 className="featured-name">{product.name}</h4>
                <p className="featured-category">
                  {product.category?.name}
                </p>
                <p className="featured-price">₹{product.price}</p>

                <div className="featured-actions">
                  <button
                    className="featured-btn primary"
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    View
                  </button>
                  <button
                    className="featured-btn secondary"
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
          ))}
        </div>

        <button
          className="pagination-nav next"
          onClick={nextPage}
          disabled={currentPage >= totalPages - 1}
        >
          Next ❯
        </button>
      </div>

      <div className="pagination-indicator">
        Page {currentPage + 1} of {totalPages}
      </div>
    </div>
  );
};

export default FeaturedProducts;
