import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/Auth.jsx';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../styles/Checkout.css';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const total = cart.reduce((s, p) => s + (p.price || 0) * (p.qty || 1), 0);

  const handlePay = async () => {
    try {
      setProcessing(true);
      const apiUrl = import.meta.env.VITE_API_URL;

      let nonce = null;
      // If dropin instance available, request payment method
      if (dropinRef.current && dropinRef.current.instance) {
        const { instance } = dropinRef.current;
        const payload = await instance.requestPaymentMethod();
        nonce = payload.nonce;
      }

      // fallback (demo) if no dropin
      if (!nonce) nonce = 'fake-valid-nonce';

      const token = auth?.token;
      const res = await fetch(`${apiUrl}/api/v1/payment/process-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentMethodNonce: nonce, amount: total, products: cart }),
      });
      const data = await res.json();
      if (data?.status) {
        toast.success('Payment successful');
        clearCart();
        // teardown dropin
        if (dropinRef.current && dropinRef.current.instance) {
          try { await dropinRef.current.instance.teardown(); } catch (e) {}
        }
        navigate('/dashboard/user/orders');
      } else {
        console.error(data);
        toast.error(data?.message || 'Payment failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Payment error');
    } finally {
      setProcessing(false);
    }
  };

  // Braintree drop-in
  const dropinRef = useRef({ instance: null });
  const [tokenLoading, setTokenLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadDropin = async () => {
      try {
        setTokenLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL;
        const token = auth?.token;
        const res = await fetch(`${apiUrl}/api/v1/payment/get-token`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!mounted) return;
        const clientToken = data?.clientToken;
        if (!clientToken) return;

        // load dropin script if not present
        if (!window.braintree) {
          await new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = 'https://js.braintreegateway.com/web/dropin/1.33.7/js/dropin.min.js';
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
          });
        }

        const dropin = window.braintree.dropin;
        if (!dropin) return;

        dropin.create({
          authorization: clientToken,
          container: '#bt-dropin',
          card: { cardholderName: { required: false } },
        }, (err, instance) => {
          if (err) {
            console.error('Drop-in create error', err);
            return;
          }
          dropinRef.current.instance = instance;
        });
      } catch (err) {
        console.error('Drop-in load error', err);
      } finally {
        setTokenLoading(false);
      }
    };

    loadDropin();

    return () => {
      mounted = false;
      // teardown instance on unmount
      if (dropinRef.current && dropinRef.current.instance) {
        try { dropinRef.current.instance.teardown(); } catch (e) { }
        dropinRef.current.instance = null;
      }
    };
  }, [auth]);

  return (
    <Layout title="Checkout">
      <div className="checkout-container">
        <div className="checkout-grid">
          <section className="payment-card">
            <div className="payment-header">
              <h3>Secure Payment</h3>
              <p className="muted">Pay securely using our sandbox gateway (test mode)</p>
            </div>

            

            <div className="payment-actions">
                {tokenLoading ? (
                <div className="muted small">Loading payment UI...</div>
                ) : (
                    <div id="bt-dropin"></div>
                )}
              <p className="muted small">This is a demo checkout. Use sandbox credentials or a test nonce.</p>
              <button
                className="btn primary large"
                onClick={handlePay}
                disabled={processing || cart.length === 0}
              >
                {processing ? 'Processing...' : `Pay ₹${total.toLocaleString()}`}
              </button>
            </div>
          </section>

          <aside className="order-summary">
            <h4>Order Summary</h4>
            <div className="summary-list">
              {cart.length === 0 && <div className="empty">Your cart is empty</div>}
              {cart.map((p, idx) => (
                <div className="summary-item" key={idx}>
                  <div className="thumb">
                    <img src={`${apiUrl}/api/v1/product/product-photo/${p._id}`} alt={p.name} />
                  </div>
                  <div className="item-info">
                    <div className="item-name">{p.name}</div>
                    <div className="item-meta muted">Qty: {p.qty || 1}</div>
                  </div>
                  <div className="item-price">₹{((p.price || 0) * (p.qty || 1)).toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="summary-total">
              <div className="line"><span>Subtotal</span><span>₹{total.toLocaleString()}</span></div>
              <div className="line muted small"><span>Taxes & fees</span><span>Included</span></div>
              <div className="line total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
