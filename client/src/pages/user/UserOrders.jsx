import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout.jsx";
import UserMenu from "../../components/UserMenu.jsx";
import { useAuth } from "../../context/Auth.jsx";

const UserOrders = () => {
  const { auth } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = auth?.token;
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${apiUrl}/api/v1/order/user-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data?.status) setOrders(data.orders || []);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    };
    if (auth?.token) load();
  }, [auth]);

  return (
    <Layout title="My Orders" description="Your orders">
      <div className="container-fluid m-0 p-0" style={{ minHeight: "100vh" }}>
        <div className="row g-0" style={{ minHeight: "100vh" }}>
          <div className="col-12 col-md-3 bg-light border-end" style={{ minHeight: "100vh" }}>
            <div className="p-3" style={{ overflowY: "auto" }}>
              <UserMenu />
            </div>
          </div>
          <div className="col-12 col-md-9" style={{ minHeight: "100vh" }}>
            <div className="p-4">
              <h2>My Orders</h2>
              <p>Orders for <strong>{auth?.user?.name || "User"}</strong></p>

              <div className="card p-3">
                {loading ? (
                  <p>Loading orders...</p>
                ) : orders.length === 0 ? (
                  <p>No orders yet.</p>
                ) : (
                  orders.map((o) => (
                    <div key={o._id} style={{ borderBottom: '1px solid #eee', padding: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <strong>Order ID:</strong> {o._id}
                          <div><small>{new Date(o.createdAt).toLocaleString()}</small></div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div><strong>Total:</strong> ₹{o.payment?.amount || 0}</div>
                          <div><small>Txn: {o.payment?.transactionId || '—'}</small></div>
                          <div><small>Status: {o.payment?.status || o.status}</small></div>
                        </div>
                      </div>

                      <div style={{ marginTop: 8 }}>
                        {o.products && o.products.map((p) => (
                          <div key={p.product} style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8 }}>
                            <div style={{ flex: 1 }}>
                              <div>{p.name}</div>
                              <div style={{ color: '#666' }}>Qty: {p.qty} × ₹{p.price}</div>
                            </div>
                            <div style={{ minWidth: 120, textAlign: 'right' }}>₹{p.price * p.qty}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserOrders;