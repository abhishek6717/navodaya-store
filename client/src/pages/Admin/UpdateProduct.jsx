import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/Auth.jsx";
import "../../styles/UpdateProduct.css";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth, initialized } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [shipping, setShipping] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [oldImage, setOldImage] = useState(null);
  const [loading, setLoading] = useState(true);

  /* 🔐 Auth Guard */
  useEffect(() => {
    if (initialized && (!auth?.user || !auth?.token)) {
      navigate("/login");
    }
  }, [initialized, auth, navigate]);

  /* 📦 Load Product */
  useEffect(() => {
    if (!auth?.token) return;

    const loadProduct = async () => {
      try {
        const res = await fetch(
          `${apiUrl}/api/v1/product/get-product/${id}`,
          {
            headers: { Authorization: `Bearer ${auth.token}` },
          }
        );
        const data = await res.json();

        if (data?.status) {
          const p = data.product;
          setName(p.name);
          setDescription(p.description);
          setPrice(p.price);
          setQuantity(p.quantity);
          setCategory(p.category?._id);
          setShipping(p.shipping);
          setOldImage(`${apiUrl}/api/v1/product/product-photo/${p._id}`);
        } else {
          toast.error("Product not found");
          navigate("/dashboard/admin/products");
        }
      } catch {
        toast.error("Failed to load product");
      }
    };

    loadProduct();
  }, [id, auth?.token, apiUrl, navigate]);

  /* 📂 Load Categories */
  useEffect(() => {
    if (!auth?.token) return;

    const loadCategories = async () => {
      const res = await fetch(
        `${apiUrl}/api/v1/category/get-categories`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      const data = await res.json();
      if (data?.status) setCategories(data.categories || []);
    };

    loadCategories();
    setLoading(false);
  }, [auth?.token, apiUrl]);

  /* 🖼 Image */
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file || null);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  /* 🔄 Update */
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!name || !price || !quantity || !category) {
      return toast.error("Please fill required fields");
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
        `${apiUrl}/api/v1/product/update-product/${id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${auth.token}` },
          body: formData,
        }
      );

      const data = await res.json();
      if (data?.status) {
        toast.success("Product updated successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error("Update failed");
      }
    } catch {
      toast.error("Update request failed");
    }
  };

  /* ❌ Delete */
  const handleDelete = async () => {
    if (!window.confirm("Delete this product?")) return;

    try {
      const res = await fetch(
        `${apiUrl}/api/v1/product/delete-product/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      const data = await res.json();
      if (data?.status) {
        toast.success("Product deleted");
        navigate("/dashboard/admin/products");
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  if (!initialized || loading) {
    return <div className="loading">Loading product...</div>;
  }

  return (
    <div className="page-wrapper">
      <div className="card">
        <h2 className="title">Update Product</h2>
        <p className="subtitle">Modify product details</p>

        <form onSubmit={handleUpdate} className="form">
          <div className="grid-2">
            <div className="form-group">
              <label>Name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
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
            <label>Description</label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label>Price *</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Quantity *</label>
              <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
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

            <div className="image-row">
              {preview && <img src={preview} alt="new" />}
              {!preview && oldImage && <img src={oldImage} alt="old" />}
            </div>
          </div>

          <div className="actions">
            <button className="btn primary" type="submit">
              Update Product
            </button>
            <button
              type="button"
              className="btn danger"
              onClick={handleDelete}
            >
              Delete Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
