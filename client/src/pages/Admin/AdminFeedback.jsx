import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/Auth";
import "../../styles/AdminFeedback.css";
import { FaTrash } from "react-icons/fa";

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { auth } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch Feedback
  const getAllFeedback = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/v1/feedback/all`, {
        headers: { Authorization: `Bearer ${auth?.token}` }
      });

      if (data?.success) {
        setFeedbacks(data.feedbacks || []);
      }
    } catch (error) {
      toast.error("Error fetching feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) getAllFeedback();
  }, [auth?.token]);

  // Delete Feedback
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;
    try {
      const { data } = await axios.delete(`${apiUrl}/api/v1/feedback/${id}`, {
        headers: { Authorization: `Bearer ${auth?.token}` }
      });

      if (data?.success) {
        toast.success("Feedback deleted");
        getAllFeedback();
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFeedbacks = feedbacks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(feedbacks.length / itemsPerPage);

  return (
    <div className="users-page">
      <div className="user-card">
        <h2 style={{ marginBottom: "0.5rem", color: "#2c3e50", fontWeight: "700" }}>
          Manage Feedback
        </h2>
        <p style={{ color: "#7f8c8d", marginBottom: "2rem" }}>
          View and manage user feedback
        </p>

        {loading ? (
          <p>Loading feedback...</p>
        ) : feedbacks.length === 0 ? (
          <p>No feedback found.</p>
        ) : (
          <>
            <div className="user-table-wrapper">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Rating</th>
                    <th>Comments</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentFeedbacks.map((f) => (
                    <tr key={f._id}>
                      <td>{f.name}</td>
                      <td>{f.email}</td>
                      <td>
                        <span className="role-badge">
                          {f.rating} ★
                        </span>
                      </td>
                      <td>{f.comments}</td>
                      <td>{new Date(f.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDelete(f._id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="pagination-container">
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`pagination-btn ${currentPage === i + 1 ? "active" : ""}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminFeedback;
