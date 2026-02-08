import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { useAuth } from "../../context/Auth";
import "../../styles/Orders.css";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { auth } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/v1/order/user-orders`, {
        headers: { Authorization: `Bearer ${auth?.token}` }
      });
      setOrders(data?.orders || data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  return (
    <Layout title="Your Orders">
      <div className="orders-page">
        <h2 style={{ marginBottom: "1.5rem", color: "#2c3e50", fontWeight: "700" }}>Your Orders</h2>
        
        {orders?.length === 0 ? (
          <div className="order-card" style={{ padding: "2rem", textAlign: "center" }}>
            <p>You haven't placed any orders yet.</p>
          </div>
        ) : (
          <>
          {currentOrders.map((o, i) => (
            <div className="order-card" key={o._id}>
              <div className="order-header">
                <div className="order-info-grid">
                  <div className="info-item">
                    <strong>Order ID</strong>
                    <span style={{ fontFamily: "monospace", color: "#666" }}>{o._id}</span>
                  </div>
                  <div className="info-item">
                    <strong>Status</strong>
                    <span className={`status-badge ${o?.status?.toLowerCase().replace(/\s/g, '-')}`}>
                      {o?.status}
                    </span>
                  </div>
                  <div className="info-item">
                    <strong>Date</strong>
                    {new Date(o?.createdAt).toLocaleDateString()}
                  </div>
                  <div className="info-item">
                    <strong>Payment</strong>
                    <span className={`payment-status ${o?.payment?.success ? "success" : "pending"}`}>
                      {o?.payment?.success ? "Paid" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="order-products">
                {o?.products?.map((p) => (
                  <div className="product-item" key={p._id}>
                    <img
                      src={`${apiUrl}/api/v1/product/product-photo/${p.product}`}
                      alt={p.name}
                      className="product-img"
                      onError={(e) => { e.target.onerror = null; e.target.src = "/images/placeholder.png"; }}
                    />
                    <div className="product-details">
                      <h4 style={{ margin: "0 0 5px", color: "#333" }}>{p.name}</h4>
                      <p style={{ margin: 0, color: "#666" }}>
                        Price: ₹{p.price} | Qty: {p.qty}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <button 
                className="pagination-btn" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span style={{ display: "flex", alignItems: "center", padding: "0 10px", color: "#555" }}>
                Page {currentPage} of {totalPages}
              </span>
              <button 
                className="pagination-btn" 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default UserOrders;