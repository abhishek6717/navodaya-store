import React, { useState } from "react";
import { toast } from "react-toastify";
import "./Newsletter.css";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("✅ Thank you for subscribing!");
      setEmail("");
    }, 1000);
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-container">
        <div className="newsletter-content">
          <h2 className="newsletter-title">📧 Subscribe to Our Newsletter</h2>
          <p className="newsletter-subtitle">
            Get exclusive deals, new arrivals, and special offers delivered to your inbox!
          </p>
        </div>

        <form className="newsletter-form" onSubmit={handleSubscribe}>
          <div className="newsletter-input-group">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="newsletter-input"
            />
            <button
              type="submit"
              className="newsletter-btn"
              disabled={loading}
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </div>
          <p className="newsletter-privacy">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
