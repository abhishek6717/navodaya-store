import React from "react";
import { useAuth } from "../../context/Auth.jsx";

const AdminHome = () => {
  const { auth } = useAuth();

  return (
    <div>
      <h2>Admin Dashboard Home</h2>
      <p>Welcome back, <strong>{auth?.user?.name || "Admin"}</strong>!</p>
    </div>
  );
};

export default AdminHome;