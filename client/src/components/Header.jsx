import React, { useEffect, useState, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import { useAuth } from "../context/Auth.jsx";
import { useCart } from "../context/CartContext";

const Header = () => {
  const { auth, setAuth } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/v1/category/get-categories`);
        const data = await res.json();
        if (data?.status) setCategories(data.categories || []);
      } catch (err) {
        // ignore
      }
    };
    load();
  }, [apiUrl]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = (query || "").trim();
    navigate(q ? `/?q=${encodeURIComponent(q)}` : `/`);
    // keep query so suggestions remain visible if desired
    setShowSuggestions(false);
  };

  // debounce and fetch suggestions
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const id = setTimeout(async () => {
      setSuggestLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/v1/product/search?keyword=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data?.status) setSuggestions(data.products || data.products || []);
        else setSuggestions([]);
      } catch (err) {
        setSuggestions([]);
      } finally {
        setSuggestLoading(false);
        setShowSuggestions(true);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [apiUrl, query]);

  // hide suggestions when clicking outside
  useEffect(() => {
    const handleOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [searchRef]);

  const handleSuggestionClick = (p) => {
    navigate(`/product/${p._id}`);
    setShowSuggestions(false);
  };

  const handleLogout = () => {
    setAuth({ user: null, token: null, expiresAt: null });
    localStorage.removeItem("auth");
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <FaCartShopping /> Navodaya Store
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            
            <li ref={searchRef} className="nav-item" style={{ position: 'relative' }}>
              <div style={{ minWidth: 560 }}>
                <form className="d-flex" role="search" onSubmit={handleSearch}>
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search products..."
                    aria-label="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => { if (suggestions.length) setShowSuggestions(true); }}
                  />
                  {/* <button className="btn btn-outline-success" type="submit">Search</button> */}
                </form>

                {showSuggestions && (
                  <div style={{ position: 'absolute', top: '42px', left: 0, right: 0, zIndex: 2000 }}>
                    <div className="card" style={{ maxHeight: 320, overflow: 'auto' }}>
                      {suggestLoading ? (
                        <div className="card-body">Loading...</div>
                      ) : suggestions.length === 0 ? (
                        <div className="card-body">No suggestions</div>
                      ) : (
                        <ul className="list-group list-group-flush">
                          {suggestions.map((p) => (
                            <li key={p._id} className="list-group-item" style={{ cursor: 'pointer' }} onClick={() => handleSuggestionClick(p)}>
                              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <img src={`${apiUrl}/api/v1/product/product-photo/${p._id}`} alt={p.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                                <div>
                                  <div style={{ fontSize: 12, lineHeight: '1.1' }}>{p.name}</div>
                                  <div style={{ fontSize: 11, color: '#666' }}>₹{p.price}</div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </li>
            <li className="nav-item">
              <NavLink to="/" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} end>
                Home
              </NavLink>
            </li>


            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#!"
                id="categoryDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Category
              </a>
              <ul className="dropdown-menu" aria-labelledby="categoryDropdown">
                <li>
                  <NavLink className="dropdown-item" to="/category">All Categories</NavLink>
                </li>
                <li><hr className="dropdown-divider" /></li>
                {categories.map((c) => (
                  <li key={c._id}>
                    <NavLink className="dropdown-item" to={`/category/${c._id}`}>{c.name}</NavLink>
                  </li>
                ))}
              </ul>
            </li>

            {!auth.user?.name ? (
              <>
                <li className="nav-item">
                  <NavLink to="/register" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                    Register
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/login" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                    Login
                  </NavLink>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#!"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {auth.user?.name || "User"}
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    <NavLink className="dropdown-item" to={auth.user?.admin ? "/dashboard/admin" : "/dashboard"}>
                      Dashboard
                    </NavLink>
                  </li>

                  <li><hr className="dropdown-divider" /></li>

                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            )}

            <li className="nav-item">
              <NavLink to="/cart" className={({ isActive }) => "nav-link" + (isActive ? " active" : "") }>
                Cart({cart?.length || 0})
              </NavLink>
            </li>
          </ul>

          
        </div>
      </div>
    </nav>
  );
};

export default Header;