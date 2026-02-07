import Layout from "../components/Layout";
import { useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';

import StarRating from "../components/StarRating";
import "../styles/Feedback.css";

const Feedback = () => {
  const [rating, setRating] = useState(5);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comments: "",
  });
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${apiUrl}/api/v1/feedback/submit`, {
        ...formData,
        rating,
      });

      if (data.success) {
        toast.success("Thanks for your feedback 🙌");
        setFormData({ name: "", email: "", comments: "" });
        setRating(5);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title="Feedback">
      <div className="feedback-page">
        <div className="feedback-card">
          <h2>Website Feedback</h2>
          <p className="subtitle">
            Help us improve by sharing your experience
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Rate your experience</label>
            <StarRating rating={rating} setRating={setRating} />

            <textarea
              name="comments"
              placeholder="Write your feedback..."
              value={formData.comments}
              onChange={handleChange}
              required
            />

            <button type="submit">Submit Feedback</button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Feedback;
