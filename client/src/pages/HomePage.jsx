import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Layout from "../components/Layout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/HomePage.css";
import "../styles/FilterDropdown.css";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/Auth.jsx";
import HeroBanner from "../components/HeroBanner";
import CountdownTimer from "../components/CountdownTimer";
import PromoBanner from "../components/PromoBanner";

const HomePage = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { cart, addToCart } = useCart();
  const { auth } = useAuth();

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedRanges, setSelectedRanges] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [tempSelectedCategories, setTempSelectedCategories] = useState([]);
  const [tempSelectedRanges, setTempSelectedRanges] = useState([]);

  /* 🔢 Pagination state */
  const [page, setPage] = useState(1);
  const perPage = 12;

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



  return (
    <Layout title="Home" description="Ecommerce Home">
      <div className="home-container" style={{ minHeight: "100vh", height: "auto", paddingBottom: "120px" }}>
        
        {/* Promo Banner */}
        <PromoBanner position="top" />

        {/* Hero Banner */}
        <HeroBanner />

        {/* Flash Sale Countdown */}
        <CountdownTimer />

        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="filter-dropdown">
            <button onClick={() => {
              setOpenDropdown(openDropdown === 'category' ? null : 'category');
              setTempSelectedCategories(selectedCategories);
            }}>
              Category
            </button>
            {openDropdown === 'category' && (
              <div className="dropdown-content">
                {categories.map((c) => (
                  <label key={c._id}>
                    {c.name}
                    <input
                      type="checkbox"
                      checked={tempSelectedCategories.includes(c._id)}
                      onChange={() => {
                        setTempSelectedCategories((prev) =>
                          prev.includes(c._id)
                            ? prev.filter((id) => id !== c._id)
                            : [...prev, c._id]
                        );
                      }}
                    />
                  </label>
                ))}
                <div className="dropdown-actions">
                  <button onClick={() => {
                    setSelectedCategories(tempSelectedCategories);
                    setOpenDropdown(null);
                  }}>Apply</button>
                  <button onClick={() => {
                    setOpenDropdown(null);
                  }}>Cancel</button>
                </div>
              </div>
            )}
          </div>

          <div className="filter-dropdown">
            <button onClick={() => {
              setOpenDropdown(openDropdown === 'price' ? null : 'price');
              setTempSelectedRanges(selectedRanges);
            }}>
              Price
            </button>
            {openDropdown === 'price' && (
              <div className="dropdown-content">
                {priceRanges.map((r) => (
                  <label key={r.id}>
                    {r.name}
                    <input
                      type="checkbox"
                      checked={tempSelectedRanges.includes(r.id)}
                      onChange={() => {
                        setTempSelectedRanges((prev) =>
                          prev.includes(r.id)
                            ? prev.filter((id) => id !== r.id)
                            : [...prev, r.id]
                        );
                      }}
                    />
                  </label>
                ))}
                <div className="dropdown-actions">
                  <button onClick={() => {
                    setSelectedRanges(tempSelectedRanges);
                    setOpenDropdown(null);
                  }}>Apply</button>
                  <button onClick={() => {
                    setOpenDropdown(null);
                  }}>Cancel</button>
                </div>
              </div>
            )}
          </div>

          <div className="filter-dropdown">
            <button onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}>
              Sort
            </button>
            {openDropdown === 'sort' && (
              <div className="dropdown-content">
                <select value={sort} onChange={(e) => {
                  setSort(e.target.value);
                  setOpenDropdown(null);
                }}>
                  <option value="">Sort by Price</option>
                  <option value="low">Low → High</option>
                  <option value="high">High → Low</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Products Area */}
        <section className="products-area">
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
                      {cart.some((item) => item._id === p._id) ? (
                        <button
                          className="btn buy"
                          onClick={() => navigate("/checkout")}
                        >
                          Buy
                        </button>
                      ) : (
                        <button
                          className="btn add-cart"
                          onClick={async () => {
                            if (!auth?.user) {
                              toast.error("Please login to add items to cart");
                              navigate("/login");
                              return;
                            }
                            await addToCart(p);
                            toast.success("Added to cart");
                          }}
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
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
    </Layout>
  );
};

export default HomePage;
