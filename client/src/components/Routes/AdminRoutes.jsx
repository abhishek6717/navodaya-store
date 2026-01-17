import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/Auth.jsx";
import Layout from "../Layout.jsx";
import AdminDashboard from "../../pages/Admin/AdminDashboard.jsx";

const AdminRoutes = () => {
  const { auth, setAuth, initialized } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!initialized) return; // wait until auth is restored

    if (!auth?.user || !auth?.token) {
      navigate("/login", { replace: true });
      return;
    }

    const checkAdmin = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        await axios.get(`${apiUrl}/api/v1/auth/admin-auth`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setLoading(false);
      } catch (error) {
        console.error("Admin auth failed:", error);
        // clear auth on 401/403
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          setAuth({ user: null, token: null, expiresAt: null });
          localStorage.removeItem("auth");
        }
        navigate("/login", { replace: true });
      }
    };

    checkAdmin();
  }, [initialized, auth, navigate, setAuth]);

  if (!initialized || loading) {
    return (
      <Layout>
        <div className="container text-center">
          <h1>Loading...</h1>
        </div>
      </Layout>
    );
  }

  return <AdminDashboard />;
};

export default AdminRoutes;