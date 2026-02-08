import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import UserMenu from "../../components/UserMenu";
import { useAuth } from "../../context/Auth.jsx";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../styles/Dashboard.css";

const Dashboard = () => {
  const { auth } = useAuth();
  const { cart } = useCart();
  const [ordersCount, setOrdersCount] = useState(0);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch real order count
  useEffect(() => {
    if (auth?.token) {
      const fetchOrders = async () => {
        try {
          const { data } = await axios.get(`${apiUrl}/api/v1/order/user-orders`, {
             headers: { Authorization: `Bearer ${auth?.token}` }
          });
          const orders = data?.orders || data || [];
          setOrdersCount(orders.length);
        } catch (error) {
          console.log(error);
        }
      };
      fetchOrders();
    }
  }, [auth?.token, apiUrl]);

  return (
    <Layout title="User Dashboard" description="Manage your account">
      <div className="dashboard-wrapper">
        <div className="dashboard-content">
          
          {/* Sidebar */}
          <div className="dashboard-sidebar">
            <UserMenu />
          </div>

          {/* Main Content */}
          <div className="dashboard-main">
            
            {/* Welcome Section */}
            <div className="welcome-card">
              <h2 style={{ color: "#2c3e50", fontWeight: "700" }}>
                Welcome back, {auth?.user?.name || "User"}! 👋
              </h2>
              <p style={{ color: "#666", marginTop: "0.5rem", marginBottom: 0 }}>
                Manage your profile, check orders, and view your account activity.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Total Orders</div>
                <div className="stat-number" style={{ color: "#4a90e2" }}>{ordersCount}</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-label">Cart Items</div>
                <div className="stat-number" style={{ color: "#f39c12" }}>{cart?.length || 0}</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Account Status</div>
                <div className="stat-number" style={{ color: "#27ae60", fontSize: "1.5rem", marginTop: "1rem" }}>Active</div>
              </div>
            </div>

            {/* Account Details */}
            <div className="info-card">
              <h3 style={{ marginBottom: "1.5rem", color: "#2c3e50" }}>Account Details</h3>
              
              <div className="info-row">
                <span className="info-label">Full Name</span>
                <span className="info-value">{auth?.user?.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email</span>
                <span className="info-value">{auth?.user?.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Phone</span>
                <span className="info-value">{auth?.user?.phone || "Not provided"}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Address</span>
                <span className="info-value">{auth?.user?.address || "Not provided"}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
