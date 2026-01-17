import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth.jsx";
import "../../styles/CreateProduct.css";

const CreateProduct = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [shipping, setShipping] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

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

    const getCategories = async () => {
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
        toast.error("Error loading categories");
      }
    };

    getCategories();
  }, [auth?.token, apiUrl]);

  /* 🖼 Image Preview */
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file || null);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  /* 🚀 Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !price || !quantity || !category) {
      return toast.error("Please fill all required fields");
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("quantity", quantity);
      formData.append("category", category);
      formData.append("shipping", shipping);
      if (photo) formData.append("photo", photo);

      const res = await fetch(
        `${apiUrl}/api/v1/product/create-product`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      if (data?.status) {
        toast.success("Product created successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message || "Create product failed");
      }
    } catch (err) {
      toast.error("Product creation failed");
    }
  };

  if (!initialized) return <div className="loading">Loading...</div>;

  return (
    <div className="page-wrapper">
      <div className="card">
        <h2 className="title">Create Product</h2>
        <p className="subtitle">Add a new product to your store</p>

        <form onSubmit={handleSubmit} className="form">
          <div className="grid-2">
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                placeholder="Product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              rows="4"
              placeholder="Product description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label>Price (₹) *</label>
              <input
                type="number"
                min="0"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Quantity *</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Shipping</label>
              <select
                value={shipping ? "true" : "false"}
                onChange={(e) => setShipping(e.target.value === "true")}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Product Image</label>
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
            {preview && (
              <div className="image-preview">
                <img src={preview} alt="preview" />
              </div>
            )}
          </div>

          <div className="actions">
            <button type="submit" className="btn primary">
              Create Product
            </button>
            <button
              type="button"
              className="btn secondary"
              onClick={() => navigate("/dashboard/admin/products")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
