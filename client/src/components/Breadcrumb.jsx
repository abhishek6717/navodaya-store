import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Breadcrumb.css";

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Map for friendly names
  const breadcrumbNames = {
    product: "Product",
    category: "Category",
    cart: "Cart",
    checkout: "Checkout",
    dashboard: "Dashboard",
    login: "Login",
    register: "Register",
  };

  // Only show breadcrumb if not on home page
  if (pathnames.length === 0) return null;

  return (
    <nav className="breadcrumb" aria-label="breadcrumb">
      <div className="breadcrumb-container">
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const displayName = breadcrumbNames[name] || name.charAt(0).toUpperCase() + name.slice(1);

          return (
            <div key={index} className="breadcrumb-item">
              {index > 0 && <span className="separator">/</span>}
              {isLast ? (
                <span className="breadcrumb-current">{displayName}</span>
              ) : (
                <Link to={routeTo} className="breadcrumb-link">
                  {displayName}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default Breadcrumb;
