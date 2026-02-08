import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/Auth";
import "../../styles/Users.css";
import { FaTrash } from "react-icons/fa";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { auth } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch users
  const getAllUsers = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/v1/auth/all-users`, {
        headers: { Authorization: `Bearer ${auth?.token}` }
      });
      console.log("Users fetched:", data);
      if (data?.success || data?.status) {
        setUsers(data.users || []);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) getAllUsers();
  }, [auth?.token]);

  // Delete User
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const { data } = await axios.delete(`${apiUrl}/api/v1/auth/delete-user/${id}`, {
        headers: { Authorization: `Bearer ${auth?.token}` }
      });
      if (data?.success) {
        toast.success("User deleted successfully");
        getAllUsers();
      } else {
        toast.error(data?.message || "Failed to delete user");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  return (
    <div className="users-page">
      <div className="user-card">
        <h2 style={{ marginBottom: "0.5rem", color: "#2c3e50", fontWeight: "700" }}>Manage Users</h2>
        <p style={{ color: "#7f8c8d", marginBottom: "2rem" }}>View and manage registered users</p>

        {loading ? (
          <p>Loading users...</p>
        ) : users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <>
            <div className="user-table-wrapper">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Admin</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>
                        <span className={`role-badge ${user.role === 1 || user.admin ? "admin" : "user"}`}>
                          {user.role === 1 || user.isAdmin ? "Yes" : "No"}
                        </span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDelete(user._id)}
                          title="Delete User"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
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

export default Users;