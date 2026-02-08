import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/Auth.jsx";
import "../../styles/CreateCategory.css";
import { FaEdit, FaTrash } from "react-icons/fa";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  
  const { auth } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch all categories
  const getAllCategories = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/v1/category/get-categories`);
      const data = await res.json();
      if (data?.success || data?.status) {
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting categories");
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  // Create Category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Category name is required");

    try {
      const res = await fetch(`${apiUrl}/api/v1/category/create-category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth?.token}`,
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data?.success || data?.status) {
        toast.success(`${name} is created`);
        setName("");
        getAllCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in input form");
    }
  };

  // Update Category
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${apiUrl}/api/v1/category/update-category/${selected._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth?.token}`,
          },
          body: JSON.stringify({ name: updatedName }),
        }
      );
      const data = await res.json();
      if (data?.success || data?.status) {
        toast.success(`${updatedName} is updated`);
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // Delete Category
  const handleDelete = async (pId) => {
    if(!window.confirm("Are you sure you want to delete this category?")) return;
    
    try {
      const res = await fetch(
        `${apiUrl}/api/v1/category/delete-category/${pId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );
      const data = await res.json();
      if (data?.success || data?.status) {
        toast.success(`Category is deleted`);
        getAllCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // Filter and Pagination Logic
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const displayedCategories = filteredCategories.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="page-wrapper">
      <div className="category-card">
        <h2>Manage Categories</h2>
        <p className="subtitle">Create, update, or remove product categories</p>

        {/* Create Form */}
        <h4 style={{ marginBottom: "1rem", color: "#555" }}>Add New Category</h4>
        <form onSubmit={handleSubmit} className="category-form">
          <input
            type="text"
            placeholder="Enter new category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <button type="submit" className="btn primary">
            Add Category
          </button>
        </form>

        {/* Search Box */}
        <div style={{ marginBottom: "1.5rem" }}>
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            style={{ width: "100%", padding: "12px 15px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
          />
        </div>

        {/* Categories Table */}
        <div className="category-table-wrapper">
          <table className="category-table">
            <thead>
              <tr>
                <th>Name</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedCategories?.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="action-btn edit"
                      onClick={() => {
                        setVisible(true);
                        setUpdatedName(c.name);
                        setSelected(c);
                      }}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDelete(c._id)}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {displayedCategories.length === 0 && (
                <tr>
                  <td colSpan="2" style={{ textAlign: "center", color: "#888" }}>
                    {searchTerm ? "No matching categories found." : "No categories found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => setPage(page - 1)} 
              disabled={page === 1}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={page === i + 1 ? "active" : ""}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button 
              onClick={() => setPage(page + 1)} 
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {visible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Category</h3>
            <form onSubmit={handleUpdate}>
              <div className="mb-3" style={{ marginTop: "1rem" }}>
                <input
                  type="text"
                  className="form-control"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }}
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setVisible(false);
                    setSelected(null);
                  }}
                  style={{ background: "#95a5a6", border: "none", marginRight: "10px" }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCategory;
