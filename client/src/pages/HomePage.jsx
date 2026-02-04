import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Layout from "../components/Layout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/HomePage.css";
import "../styles/FilterPanel.css";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/Auth.jsx";
import HeroBanner from "../components/HeroBanner";
import CountdownTimer from "../components/CountdownTimer";
import FeaturedProducts from "../components/FeaturedProducts";
import PromoBanner from "../components/PromoBanner";

const HomePage = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { addToCart } = useCart();
  const { auth } = useAuth();

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedRanges, setSelectedRanges] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  /* 🔢 Pagination state */
  const [page, setPage] = useState(1);
  const perPage = 10;

  const priceRanges = [
    { id: 1, name: "Under ₹500", min: 0, max: 499 },
    { id: 2, name: "₹500 - ₹999", min: 500, max: 999 },
    { id: 3, name: "₹1000 - ₹4999", min: 1000, max: 4999 },
    { id: 4, name: "₹5000 & above", min: 5000, max: Infinity },
  ];

  /* 📦 Load products */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/v1/product/get-products`);
        const data = await res.json();
        if (data?.status) {
          const sortedProducts = (data.products || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setProducts(sortedProducts);
          // setFiltered(sortedProducts.slice(16)); // Skip first 16 (featured) for "All Products"
        }
      } catch {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [apiUrl]);

  /* 📂 Load categories */
  useEffect(() => {
    const loadCategories = async () => {
      const res = await fetch(`${apiUrl}/api/v1/category/get-categories`);
      const data = await res.json();
      if (data?.status) setCategories(data.categories);
    };
    loadCategories();
  }, [apiUrl]);

  /* 🔍 Read search param */
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearch(q);
  }, [searchParams]);

  /* 🔍 Apply filters */
  useEffect(() => {
    let list = [...products];

    if (search) {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      list = list.filter((p) =>
        selectedCategories.includes(p.category?._id)
      );
    }

    if (selectedRanges.length > 0) {
      list = list.filter((p) =>
        selectedRanges.some((rid) => {
          const r = priceRanges.find((x) => x.id === rid);
          return p.price >= r.min && p.price <= r.max;
        })
      );
    }

    if (sort === "low") list.sort((a, b) => a.price - b.price);
    if (sort === "high") list.sort((a, b) => b.price - a.price);

    setFiltered(list);
    setPage(1); // 🔁 reset page when filters change
  }, [search, sort, selectedCategories, selectedRanges, products]);

  /* 🔢 Pagination calculation */
  const totalPages = Math.ceil(filtered.length / perPage);
  const startIndex = (page - 1) * perPage;
  const paginatedProducts = filtered.slice(
    startIndex,
    startIndex + perPage
  );

  const handleLocalSearch = (e) => {
    e?.preventDefault?.();
    const q = (search || "").trim();
    navigate(q ? `/?q=${encodeURIComponent(q)}` : `/`);
  };

  return (
    <Layout title="Home" description="Ecommerce Home">
      <div className="home-container" style={{ minHeight: "100vh", height: "auto", paddingBottom: "120px" }}>
        
        {/* Promo Banner */}
        <PromoBanner position="top" />

        {/* Hero Banner */}
        <HeroBanner />

        {/* Flash Sale Countdown */}
        <CountdownTimer />

        {/* Featured Products Carousel */}
        {/* <FeaturedProducts products={products} /> */}

        {/* Promo Banner 2 */}
        {/* <PromoBanner position="middle" /> */}

        <div className="content-grid">

          {/* LEFT FILTERS */}
          <aside className="sidebar hide-on-mobile">
            <h3>Filters</h3>

            <div className="filter-group">
              <strong>Categories</strong>
              {categories.map((c) => (
                <label key={c._id} className="filter-item" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(c._id)}
                    onChange={() =>
                      setSelectedCategories((prev) =>
                        prev.includes(c._id)
                          ? prev.filter((id) => id !== c._id)
                          : [...prev, c._id]
                      )
                    }
                  />
                  {c.name}
                </label>
              ))}
            </div>

            <div className="filter-group">
              <strong>Price</strong>
              {priceRanges.map((r) => (
                <label key={r.id} className="filter-item" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    type="checkbox"
                    checked={selectedRanges.includes(r.id)}
                    onChange={() =>
                      setSelectedRanges((prev) =>
                        prev.includes(r.id)
                          ? prev.filter((id) => id !== r.id)
                          : [...prev, r.id]
                      )
                    }
                  />
                  {r.name}
                </label>
              ))}
            </div>

            <div className="filter-group">
              <strong>Sort</strong>
              <div style={{ marginTop: 8 }}>
                <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6 }}>
                  <option value="">Sort by Price</option>
                  <option value="low">Low → High</option>
                  <option value="high">High → Low</option>
                </select>
              </div>
            </div>
          </aside>

          {showFilterPanel && (
            <div className="filter-panel">
              <aside className="sidebar">
                <button className="close-btn" onClick={() => setShowFilterPanel(false)}>
                  &times;
                </button>
                <h3>Filters</h3>

                <div className="filter-group">
                  <strong>Categories</strong>
                  {categories.map((c) => (
                    <label key={c._id} className="filter-item" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(c._id)}
                        onChange={() =>
                          setSelectedCategories((prev) =>
                            prev.includes(c._id)
                              ? prev.filter((id) => id !== c._id)
                              : [...prev, c._id]
                          )
                        }
                      />
                      {c.name}
                    </label>
                  ))}
                </div>

                <div className="filter-group">
                  <strong>Price</strong>
                  {priceRanges.map((r) => (
                    <label key={r.id} className="filter-item" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <input
                        type="checkbox"
                        checked={selectedRanges.includes(r.id)}
                        onChange={() =>
                          setSelectedRanges((prev) =>
                            prev.includes(r.id)
                              ? prev.filter((id) => id !== r.id)
                              : [...prev, r.id]
                          )
                        }
                      />
                      {r.name}
                    </label>
                  ))}
                </div>

                <div className="filter-group">
                  <strong>Sort</strong>
                  <div style={{ marginTop: 8 }}>
                    <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6 }}>
                      <option value="">Sort by Price</option>
                      <option value="low">Low → High</option>
                      <option value="high">High → Low</option>
                    </select>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* RIGHT PRODUCTS */}
          <section className="products-area">

            <button className="filter-btn" onClick={() => setShowFilterPanel(true)}>
              Filters
            </button>

            {/* PRODUCTS */}
            {loading ? (
              <div className="skeleton-grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="skeleton-card" />
                ))}
              </div>
            ) : paginatedProducts.length === 0 ? (
              <p className="empty">No products found</p>
            ) : (
              <>
                <div className="products-section-header">
                  <h2>All Products</h2>
                  <p>Browse our complete collection</p>
                </div>
                <div className="product-grid">
                  {paginatedProducts.map((p) => (
                    <div key={p._id} className="product-card">
                      {(new Date() - new Date(p.createdAt)) < 86400000 && (
                        <span className="badge">New</span>
                      )}

                      <img
                        src={`${apiUrl}/api/v1/product/product-photo/${p._id}`}
                        alt={p.name}
                        style={{ height: "200px", width: "100%", objectFit: "contain" }}
                      />

                      <h4>{p.name}</h4>
                      <p className="price">₹{p.price}</p>

                      <div className="card-actions">
                        <button
                          className="btn primary"
                          onClick={() => navigate(`/product/${p._id}`)}
                        >
                          View Product
                        </button>

                        <button
                          className="btn"
                          onClick={() => {
                            if (!auth?.user) {
                              toast.error("Please login to add items to cart");
                              navigate("/login");
                              return;
                            }
                            addToCart(p);
                            toast.success("Added to cart");
                          }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
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
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
