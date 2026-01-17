import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/Auth.jsx";
import Layout from "../Layout.jsx";

const Private = () => {
  const { auth, setAuth, initialized } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!initialized) return; // wait until auth is restored from localStorage

    if (!auth?.user || !auth?.token) {
      navigate("/login", { replace: true });
      return;
    }

    const checkAuth = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        await axios.get(`${apiUrl}/api/v1/auth/user-auth`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setLoading(false);
      } catch (err) {
        // clear on failure and redirect
        setAuth({ user: null, token: null, expiresAt: null });
        localStorage.removeItem("auth");
        navigate("/login", { replace: true });
      }
    };

    checkAuth();
  }, [initialized, auth, navigate, setAuth]);

  if (!initialized || loading) {
    return (
      <Layout>
        <div className="container text-center" style={{ minHeight: "60vh" }}>
          <h3>Loading...</h3>
        </div>
      </Layout>
    );
  }

  // Render nested routes (Dashboard, UserProfile, Orders, etc.)
  return <Outlet />;
};

export default Private;