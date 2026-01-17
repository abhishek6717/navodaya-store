import React from "react";
import Layout from "../components/Layout";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth.jsx";
import { useEffect } from "react";
import "../styles/CartPage.css";

const CartPage = () => {
  const { cart, removeFromCart, clearCart, addToCart, updateQty } = useCart();
  const navigate = useNavigate();
  const { auth, initialized } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  const total = cart.reduce(
    (sum, p) => sum + (p.price || 0) * (p.qty || 1),
    0
  );

  useEffect(() => {
    if (!initialized) return; // wait for auth init
    if (!auth?.user) {
      navigate('/login', { replace: true });
    }
  }, [auth, initialized, navigate]);

  return (
    <Layout title="Your Cart">
      <div className="cart-container">
        <h2 className="cart-title">Shopping Cart</h2>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty 🛒</p>
            <button className="btn primary" onClick={() => navigate("/")}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-grid">

            {/* LEFT - CART ITEMS */}
            <div className="cart-items">
              {cart.map((p) => (
                <div className="cart-card" key={p._id}>
                  <img
                    src={`${apiUrl}/api/v1/product/product-photo/${p._id}`}
                    alt={p.name}
                  />

                  <div className="cart-info">
                    <h4>{p.name}</h4>
                    <p className="price">₹{p.price}</p>

                    <div className="qty-controls">
                      <button
                        onClick={() =>
                          (p.qty || 1) <= 1
                            ? removeFromCart(p._id)
                            : updateQty(p._id, (p.qty || 1) - 1)
                        }
                      >
                        −
                      </button>

                      <input
                        type="number"
                        value={p.qty || 1}
                        onChange={(e) =>
                          updateQty(p._id, Number(e.target.value))
                        }
                      />

                      <button onClick={() => addToCart(p)}>+</button>

                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(p._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="cart-subtotal">
                    <span>Subtotal</span>
                    <strong>₹{(p.price || 0) * (p.qty || 1)}</strong>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT - SUMMARY */}
            <aside className="cart-summary">
              <h3>Order Summary</h3>

              <div className="summary-row">
                <span>Total Items</span>
                <span>{cart.length}</span>
              </div>

              <div className="summary-row total">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <button
                className="btn primary"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>

              <button className="btn outline" onClick={() => clearCart()}>
                Clear Cart
              </button>

              <button
                className="btn link"
                onClick={() => navigate("/")}
              >
                ← Continue Shopping
              </button>
            </aside>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
