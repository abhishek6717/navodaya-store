import React from "react";
import Layout from "../../components/Layout";
import UserMenu from "../../components/UserMenu";
import { useAuth } from "../../context/Auth.jsx";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { auth } = useAuth();

  return (
    <Layout title="User Dashboard" description="Manage your account">
      <div className="container-fluid py-4" style={{ minHeight: "100vh", background: "#f8fafc" }}>
        <div className="row g-4">

          {/* LEFT SIDEBAR */}
          <div className="col-12 col-md-3">
            <div
              className="bg-white rounded shadow-sm p-3"
              style={{ minHeight: "100%" }}
            >
              <UserMenu />
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="col-12 col-md-9">
            {/* Welcome Card */}
            <div className="bg-white rounded shadow-sm p-4 mb-4">
              <h2 className="mb-1">
                Welcome back, <span className="text-primary">{auth?.user?.name || "User"}</span> 👋
              </h2>
              <p className="text-muted mb-0">
                Here’s a quick overview of your account
              </p>
            </div>

            {/* QUICK STATS */}
            <div className="row g-3 mb-4">
              <div className="col-sm-6 col-lg-4">
                <div className="bg-white p-3 rounded shadow-sm text-center">
                  <h6 className="text-muted">Orders</h6>
                  <h3 className="fw-bold text-primary">12</h3>
                </div>
              </div>
              <div className="col-sm-6 col-lg-4">
                <div className="bg-white p-3 rounded shadow-sm text-center">
                  <h6 className="text-muted">Wishlist</h6>
                  <h3 className="fw-bold text-success">5</h3>
                </div>
              </div>
              <div className="col-sm-12 col-lg-4">
                <div className="bg-white p-3 rounded shadow-sm text-center">
                  <h6 className="text-muted">Cart Items</h6>
                  <h3 className="fw-bold text-warning">3</h3>
                </div>
              </div>
            </div>

            {/* PROFILE INFO */}
            <div className="bg-white rounded shadow-sm p-4">
              <h5 className="mb-3">Account Information</h5>

              <div className="row mb-2">
                <div className="col-sm-4 text-muted">Email</div>
                <div className="col-sm-8 fw-semibold">
                  {auth?.user?.email || "—"}
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-sm-4 text-muted">Phone</div>
                <div className="col-sm-8 fw-semibold">
                  {auth?.user?.phone || "—"}
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-sm-4 text-muted">Address</div>
                <div className="col-sm-8 fw-semibold">
                  {auth?.user?.address || "—"}
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2">
                <Link
                  to="/dashboard/user/profile"
                  className="btn btn-primary"
                >
                  Edit Profile
                </Link>
                <Link
                  to="/dashboard/user/orders"
                  className="btn btn-outline-secondary"
                >
                  View Orders
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
