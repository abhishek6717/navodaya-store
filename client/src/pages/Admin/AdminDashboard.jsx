import React from "react";
import Layout from "../../components/Layout.jsx";
import AdminMenu from "../../components/AdminMenu.jsx";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/Auth.jsx";

const AdminDashboard = () => {
  const { auth } = useAuth();

  return (
    <Layout title="Admin Dashboard" description="Admin area">
      <div className="container-fluid p-0" style={{ minHeight: "100vh" }}>
        <div className="row g-0" style={{ minHeight: "100vh" }}>
          <div className="col-12 col-md-3 bg-light border-end" style={{ minHeight: "100vh" }}>
            <div className="p-3" style={{ overflowY: "auto" }}>
              <AdminMenu />
            </div>
          </div>

          <div className="col-12 col-md-9" style={{ minHeight: "100vh" }}>
            <div className="p-4" style={{ height: "100%", overflowY: "auto" }}>
              {/* Nested admin pages render here */}
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
