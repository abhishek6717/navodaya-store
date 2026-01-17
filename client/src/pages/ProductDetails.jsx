import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/Auth.jsx";
import "../styles/ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { addToCart } = useCart();
  const { auth } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/v1/product/get-product/${id}`);
        const data = await res.json();
        if (data?.status) setProduct(data.product);
        else toast.error(data?.message || "Product not found");
      } catch {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [apiUrl, id]);

  // fetch related products once product is loaded
  useEffect(() => {
    if (!product) return;
    const loadRelated = async () => {
      setRelatedLoading(true);
      try {
        const categoryId = product.category?._id || product.category;
        const res = await fetch(`${apiUrl}/api/v1/product/related-products/${product._id}/${categoryId}`);
        const data = await res.json();
        if (data?.status) setRelated(data.relatedProducts || data.relatedProducts || data.relatedProducts === undefined ? data.relatedProducts : data.relatedProducts);
        // Some controllers return `relatedProducts`, others may use different key; fallbacks handled below
        if (data?.relatedProducts) setRelated(data.relatedProducts);
        else if (data?.products) setRelated(data.products);
        else if (data?.related) setRelated(data.related);
      } catch (err) {
        // silent
      } finally {
        setRelatedLoading(false);
      }
    };
    loadRelated();
  }, [apiUrl, product]);

  if (loading) return <Layout title="Product"><div className="pd-loading">Loading...</div></Layout>;
  if (!product) return <Layout title="Product"><div className="pd-not-found">Product not found</div></Layout>;

  const handleAddToCart = () => {
    // Check if user is logged in
    if (!auth?.user) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`${quantity} item${quantity > 1 ? 's' : ''} added to cart`);
    setQuantity(1);
  };

  const handleWishlist = () => {
    if (!auth?.user) {
      toast.error("Please login to add to wishlist");
      navigate("/login");
      return;
    }
    setWishlisted(!wishlisted);
    toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleRating = (stars) => {
    if (!auth?.user) {
      toast.error("Please login to rate products");
      navigate("/login");
      return;
    }
    setUserRating(stars);
    toast.success(`You rated this product ${stars} stars`);
  };

  return (
    <Layout title={product.name} description={product.description}>
      <div className="product-wrapper">
        <div className="product-container-layout">
          
          {/* MAIN CONTENT - PRODUCT DETAILS SECTION */}
          <div className="product-details-main">
            
            {/* LEFT - IMAGE */}
            <div className="product-image-section">
              <div className="product-image-wrapper">
                <img
                  src={`${apiUrl}/api/v1/product/product-photo/${product._id}`}
                  alt={product.name}
                  className="product-main-image"
                />
              </div>
            </div>

            {/* RIGHT - PRODUCT INFO */}
            <div className="product-info-section">
              
              {/* Title & Rating */}
              <div className="product-header-info">
                <h1 className="product-title">{product.name}</h1>
                <div className="product-rating">
                  <div className="rating-display">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star-icon ${userRating >= star ? 'active' : ''}`}
                        onClick={() => handleRating(star)}
                        style={{ cursor: 'pointer', fontSize: '1.2rem' }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="review-count">({userRating > 0 ? userRating + ' stars - Your rating' : '325 reviews'})</span>
                </div>
              </div>

              {/* Price Section */}
              <div className="price-box">
                <div className="price-display">
                  <span className="price-current">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="price-original">₹{product.originalPrice}</span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="product-description">
                <p>{product.description}</p>
              </div>

              {/* Stock Status */}
              <div className="stock-info">
                <label>Stock Status:</label>
                <span className={`stock-status ${product.quantity > 0 ? 'in-stock' : 'out-stock'}`}>
                  {product.quantity > 0 ? `✓ In Stock (${product.quantity} available)` : "✗ Out of Stock"}
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="quantity-box">
                <label htmlFor="qty">Quantity:</label>
                <div className="qty-selector">
                  <button 
                    className="qty-decrease"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >−</button>
                  <input
                    id="qty"
                    type="number"
                    min="1"
                    max={product.quantity}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(product.quantity, Math.max(1, parseInt(e.target.value) || 1)))}
                  />
                  <button 
                    className="qty-increase"
                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                  >+</button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="product-actions">
                <button
                  className="btn-add-cart"
                  onClick={handleAddToCart}
                  disabled={product.quantity <= 0}
                >
                  🛒 Add to Cart
                </button>
                <button 
                  className={`btn-wishlist ${wishlisted ? 'active' : ''}`}
                  onClick={handleWishlist}
                >
                  {wishlisted ? '♥ Wishlisted' : '♡ Wishlist'}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="trust-section">
                <div className="trust-badge">
                  <span className="badge-icon">✓</span>
                  <span>Free Shipping</span>
                </div>
                <div className="trust-badge">
                  <span className="badge-icon">↩</span>
                  <span>Easy Returns</span>
                </div>
                <div className="trust-badge">
                  <span className="badge-icon">🔒</span>
                  <span>Secure Payment</span>
                </div>
              </div>

              {/* Meta Info */}
              <div className="meta-info">
                <div className="meta-item">
                  <span className="meta-label">Category:</span>
                  <span>{product.category?.name}</span>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT SIDEBAR - SIMILAR PRODUCTS */}
          <div className="similar-sidebar">
            <h3>Related Products</h3>
            {relatedLoading ? (
              <p style={{textAlign: 'center', padding: '2rem', color: '#666'}}>Loading...</p>
            ) : related?.length ? (
              <div className="sidebar-products-grid">
                {related.map((r) => (
                  <div className="sidebar-product-card" key={r._id}>
                    <div className="sidebar-img-wrapper">
                      <img
                        src={`${apiUrl}/api/v1/product/product-photo/${r._id}`}
                        alt={r.name}
                      />
                    </div>
                    <div className="sidebar-info">
                      <h5>{r.name}</h5>
                      <p className="sidebar-price">₹{r.price}</p>
                      <button 
                        className="sidebar-btn"
                        onClick={() => navigate(`/product/${r._id}`)}
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{textAlign: 'center', padding: '1rem', color: '#666'}}>No related products</p>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
