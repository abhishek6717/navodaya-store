import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./Auth.jsx";

const CartContext = createContext();
const apiUrl = import.meta.env.VITE_API_URL;

export const CartProvider = ({ children }) => {
  const { auth } = useAuth();
  const token = auth?.token;

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =======================
     Fetch Cart (on login)
  ======================= */
  const fetchCart = async () => {
    if (!token) {
      setCart([]);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        `${apiUrl}/api/v1/cart/get-cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.success) {
        // normalize backend cart → frontend cart
        const items = res.data.cart.products.map((p) => ({
          ...p.productId,
          qty: p.quantity,
        }));
        setCart(items);
      }
    } catch (err) {
      console.error("Fetch cart error", err);
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     Add to Cart
  ======================= */
  const addToCart = async (product, quantity = 1) => {
    if (!token) return;

    try {
      await axios.post(
        `${apiUrl}/api/v1/cart/add-to-cart`,
        { productId: product._id, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCart(); // re-sync cart
    } catch (err) {
      console.error("Add to cart error", err);
    }
  };

  /* =======================
     Remove from Cart
  ======================= */
  const removeFromCart = async (productId) => {
    if (!token) return;

    try {
      await axios.delete(
        `${apiUrl}/api/v1/cart/remove-from-cart/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCart();
    } catch (err) {
      console.error("Remove from cart error", err);
    }
  };

  /* =======================
     Clear Cart
  ======================= */
  const clearCart = async () => {
    if (!token) return;

    try {
      await axios.delete(
        `${apiUrl}/api/v1/cart/clear-cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCart([]);
    } catch (err) {
      console.error("Clear cart error", err);
    }
  };

  /* =======================
     Update Quantity
  ======================= */
  const updateQty = async (productId, quantity) => {
    if (!token) return;

    try {
      await axios.put(
        `${apiUrl}/api/v1/cart/update-cart-item-qty`,
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCart();
    } catch (err) {
      console.error("Update qty error", err);
    }
  };

  /* =======================
     Sync cart on login/logout
  ======================= */
  useEffect(() => {
    fetchCart();
  }, [token]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        clearCart,
        updateQty,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
