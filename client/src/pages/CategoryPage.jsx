import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/CategoryPage.css";

const CategoryPage = () => {
  const { id } = useParams();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/v1/category/get-categories`);
        const data = await res.json();
        if (data?.status) setCategories(data.categories || []);
      } catch {
        // ignore
      }
    };
    loadCategories();
  }, [apiUrl]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const url = id
          ? `${apiUrl}/api/v1/product/category-products/${id}`
          : `${apiUrl}/api/v1/product/get-products`;

        const res = await fetch(url);
        const data = await res.json();

        if (data?.status) setProducts(data.products || []);
        else toast.error(data?.message || "Failed to load products");
      } catch {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [apiUrl, id]);

  return (
    <Layout title="Categories">
      <div className="category-page">

        {/* LEFT SIDEBAR */}
        <aside className="category-sidebar">
          <h3>Categories</h3>
          <ul>
            <li className={!id ? "active" : ""}>
              <Link to="/category">All Products</Link>
            </li>

            {categories.map((c) => (
              <li key={c._id} className={id === c._id ? "active" : ""}>
                <Link to={`/category/${c._id}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* RIGHT PRODUCTS */}
        <section className="category-products">
          <h2>{id ? "Products" : "All Products"}</h2>

          {loading ? (
            <p>Loading...</p>
          ) : products.length === 0 ? (
            <p>No products found</p>
          ) : (
            <div className="product-grid">
              {products.map((p) => (
                <div className="product-card" key={p._id}>
                  <Link to={`/product/${p._id}`}>
                    <img
                      src={`${apiUrl}/api/v1/product/product-photo/${p._id}`}
                      alt={p.name}
                      style={{ height: "200px", width: "100%", objectFit: "contain" }}
                    />
                    <h4>{p.name}</h4>
                    <p className="price">₹{p.price}</p>
                  </Link>

                  <Link to={`/product/${p._id}`} className="view-btn">
                    View Product
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </Layout>
  );
};

export default CategoryPage;
