import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/Auth.jsx";
import "../../styles/Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { auth, initialized } = useAuth();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  /* 🔐 Auth Guard */
  useEffect(() => {
    if (initialized && (!auth?.user || !auth?.token)) {
      navigate("/login");
    }
  }, [initialized, auth, navigate]);

  /* 📦 Fetch Products */
  useEffect(() => {
    if (!auth?.token) return;

    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${apiUrl}/api/v1/product/get-products`,
          {
            headers: { Authorization: `Bearer ${auth.token}` },
          }
        );
        const data = await res.json();

        if (data?.status) {
          setProducts(data.products || []);
        } else {
          toast.error("Failed to load products");
        }
      } catch (err) {
        toast.error("Unable to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [auth?.token, apiUrl]);

  /* ❌ Delete */
  const handleDelete = async (id) => {
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
        setProducts(products.filter((p) => p._id !== id));
      } else {
        toast.error("Delete failed");
      }
    } catch {
      toast.error("Delete request failed");
    }
  };

  if (!initialized || loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="page-wrapper">
      <div className="card">
        <div className="header">
          <h2 className="title">Manage Products</h2>
          <button
            className="btn primary"
            onClick={() => navigate("/dashboard/admin/create-product")}
          >
            + Add Product
          </button>
        </div>

        {products.length === 0 ? (
          <p className="empty">No products found</p>
        ) : (
          <div className="table">
            <div className="table-head">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Category</span>
              <span>Actions</span>
            </div>

            {products.map((p) => (
              <div key={p._id} className="table-row">
                <div className="product-info">
                  <img
                    src={`${apiUrl}/api/v1/product/product-photo/${p._id}`}
                    alt={p.name}
                    onError={(e) => { e.target.onerror = null; e.target.src = "/images/placeholder.png"; }}
                  />
                  <span>{p.name}</span>
                </div>

                <span>₹{p.price}</span>
                <span>{p.quantity}</span>
                <span>{p.category?.name || "-"}</span>

                <div className="actions">
                  <button
                    className="btn small"
                    onClick={() => navigate(`/dashboard/admin/update-product/${p._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn small danger"
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
