import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/Auth";
import "../../styles/Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { auth } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  // Standard status options
  const statusOptions = ["Not Processed", "Processing", "Shipped", "Delivered", "Cancelled"];

  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/v1/order/all-orders`, {
        headers: { Authorization: `Bearer ${auth?.token}` }
      });
      setOrders(data?.orders || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const handleStatusChange = async (orderId, value) => {
    try {
      const { data } = await axios.put(`${apiUrl}/api/v1/order/update-order-status/${orderId}`, 
        { status: value },
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      getOrders();
      toast.success("Order status updated");
    } catch (error) {
      console.log(error);
      toast.error("Update failed");
    }
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  return (
    <div className="orders-page">
      <h2 style={{ marginBottom: "1.5rem", color: "#2c3e50", fontWeight: "700" }}>Manage Orders</h2>
      
      {orders.length === 0 ? (
        <div className="order-card" style={{ padding: "2rem", textAlign: "center" }}>
          <p>No orders found.</p>
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
                  <select
                    className="order-status-select"
                    onChange={(e) => handleStatusChange(o._id, e.target.value)}
                    value={o?.status}
                  >
                    {statusOptions.map((s, idx) => (
                      <option key={idx} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="info-item">
                  <strong>Buyer</strong>
                  {o?.buyer?.name}
                </div>
                <div className="info-item">
                  <strong>Date</strong>
                  {new Date(o?.createdAt).toLocaleDateString()}
                </div>
                <div className="info-item">
                  <strong>Payment</strong>
                  <span className={`payment-status ${o?.payment?.status === 'success' ? "success" : "pending"}`}>
                    {o?.payment?.status === 'success' ? "Paid" : "Pending"}
                  </span>
                  <div style={{ fontSize: "0.75rem", color: "#888", marginTop: "2px" }}>
                    {o?.payment?.transactionId}
                  </div>
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
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`pagination-btn ${currentPage === i + 1 ? "active" : ""}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
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
  );
};

export default Orders;