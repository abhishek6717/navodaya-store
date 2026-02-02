import React, { useState } from "react";
import "./ReviewsSection.css";

const ReviewsSection = ({ userRating, onRating, isLoggedIn, onLoginClick }) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState("");

  const reviews = [
    {
      id: 1,
      author: "Priya M.",
      rating: 5,
      date: "2 weeks ago",
      text: "Excellent product quality! Arrived on time and packaging was perfect.",
      verified: true,
    },
    {
      id: 2,
      author: "Rajesh K.",
      rating: 4,
      date: "1 month ago",
      text: "Good product, but expected faster delivery. Overall satisfied.",
      verified: true,
    },
    {
      id: 3,
      author: "Anita S.",
      rating: 5,
      date: "1 month ago",
      text: "Best purchase! Highly recommend to everyone. Amazing value for money.",
      verified: true,
    },
  ];

  const handleRate = (rating) => {
    if (!isLoggedIn) {
      onLoginClick();
      return;
    }
    onRating(rating);
  };

  const handleSubmitReview = () => {
    if (reviewText.trim()) {
      // API call would go here
      setReviewText("");
      setShowReviewForm(false);
      alert("Review submitted successfully!");
    }
  };

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h2>Customer Reviews & Ratings</h2>
      </div>

      <div className="reviews-content">
        {/* Rating Summary */}
        <div className="rating-summary">
          <div className="rating-score">
            <div className="score-number">4.5</div>
            <div className="score-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="star-display">
                  ★
                </span>
              ))}
            </div>
            <p className="score-text">Based on 325 reviews</p>
          </div>

          <div className="rating-bars">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="rating-bar-item">
                <span className="bar-label">{stars} ★</span>
                <div className="bar-container">
                  <div
                    className="bar-fill"
                    style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : 5}%` }}
                  ></div>
                </div>
                <span className="bar-count">{stars === 5 ? 228 : stars === 4 ? 65 : 32}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Your Rating */}
        <div className="your-rating">
          <h3>Rate This Product</h3>
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`star-btn ${
                  userRating >= star || hoveredRating >= star ? "active" : ""
                }`}
                onClick={() => handleRate(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              >
                ★
              </button>
            ))}
          </div>
          {userRating > 0 && (
            <p className="rating-feedback">
              You rated this product {userRating} star{userRating > 1 ? "s" : ""}
            </p>
          )}
          {!isLoggedIn && (
            <p className="login-prompt" onClick={onLoginClick}>
              <span>👤</span> Please login to rate this product
            </p>
          )}
        </div>

        {/* Review Form */}
        <div className="review-form-section">
          {!showReviewForm ? (
            <button className="btn-write-review" onClick={() => setShowReviewForm(true)}>
              ✍️ Write a Review
            </button>
          ) : (
            <div className="review-form">
              <h3>Share Your Experience</h3>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Tell us about your experience with this product..."
                rows="4"
                className="review-textarea"
              />
              <div className="form-actions">
                <button className="btn-submit" onClick={handleSubmitReview}>
                  Submit Review
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => {
                    setShowReviewForm(false);
                    setReviewText("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="reviews-list">
          <h3>Recent Reviews</h3>
          {reviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="reviewer-name">
                      {review.author}
                      {review.verified && (
                        <span className="verified-badge">✓ Verified</span>
                      )}
                    </h4>
                    <p className="review-date">{review.date}</p>
                  </div>
                </div>
                <div className="review-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${review.rating >= star ? "filled" : ""}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="review-text">{review.text}</p>
              <div className="review-actions">
                <button className="btn-helpful">👍 Helpful (5)</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;
