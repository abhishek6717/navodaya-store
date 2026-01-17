import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth.jsx";
import "../../styles/CreateCategory.css";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);

  const { auth, initialized } = useAuth();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  /* 🔐 Auth Guard */
  useEffect(() => {
    if (initialized && (!auth?.user || !auth?.token)) {
      navigate("/login");
    }
  }, [initialized, auth, navigate]);

  /* 📦 Load Categories */
  useEffect(() => {
    if (!auth?.token) return;

    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${apiUrl}/api/v1/category/get-categories`,
          {
            headers: { Authorization: `Bearer ${auth.token}` },
          }
        );
        const data = await res.json();
        if (data?.status) setCategories(data.categories || []);
        else toast.error("Failed to load categories");
      } catch (err) {
        toast.error("Unable to load categories");
      }
    };

    fetchCategories();
  }, [auth?.token, apiUrl]);

  /* ➕ Create */
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Category name is required");

    try {
      const res = await fetch(
        `${apiUrl}/api/v1/category/create-category`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify({ name }),
        }
      );
      const data = await res.json();
      if (data?.status) {
        toast.success("Category created");
        setName("");
        refresh();
      } else {
        toast.error(data?.message || "Create failed");
      }
    } catch {
      toast.error("Create request failed");
    }
  };

  /* ✏️ Update */
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editing) return;

    try {
      const res = await fetch(
        `${apiUrl}/api/v1/category/update-category/${editing._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify({ name }),
        }
      );
      const data = await res.json();
      if (data?.status) {
        toast.success("Category updated");
        setEditing(null);
        setName("");
        refresh();
      } else {
        toast.error(data?.message || "Update failed");
      }
    } catch {
      toast.error("Update request failed");
    }
  };

  /* ❌ Delete */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      const res = await fetch(
        `${apiUrl}/api/v1/category/delete-category/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      const data = await res.json();
      if (data?.status) {
        toast.success("Category deleted");
        refresh();
      } else {
        toast.error("Delete failed");
      }
    } catch {
      toast.error("Delete request failed");
    }
  };

  const refresh = async () => {
    const res = await fetch(`${apiUrl}/api/v1/category/get-categories`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    const data = await res.json();
    if (data?.status) setCategories(data.categories || []);
  };

  const startEdit = (cat) => {
    setEditing(cat);
    setName(cat.name);
  };

  if (!initialized) return <div className="loading">Loading...</div>;

  return (
    <div className="page-wrapper">
      <div className="card">
        <h2 className="title">Manage Categories</h2>
        <p className="subtitle">Create, update and delete product categories</p>

        {/* FORM */}
        <form
          onSubmit={editing ? handleUpdate : handleCreate}
          className="form-row"
        >
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button type="submit" className="btn primary">
            {editing ? "Update" : "Create"}
          </button>

          {editing && (
            <button
              type="button"
              className="btn secondary"
              onClick={() => {
                setEditing(null);
                setName("");
              }}
            >
              Cancel
            </button>
          )}
        </form>

        {/* LIST */}
        <div className="list">
          {categories.length === 0 ? (
            <p className="empty">No categories found</p>
          ) : (
            categories.map((cat) => (
              <div key={cat._id} className="list-item">
                <span className="cat-name">{cat.name}</span>
                <div className="actions">
                  <button
                    className="btn small"
                    onClick={() => startEdit(cat)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn small danger"
                    onClick={() => handleDelete(cat._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCategory;
