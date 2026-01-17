import React, { useState } from 'react';
import Layout from '../../components/Layout.jsx';
import axios from "axios";

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');       
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Replace with your API URL if needed
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await axios.post(`${apiUrl}/api/v1/auth/forget-password`, {
            email,
            newPassword
        });
        if (response.data.status) {
            alert('Password reset successful. Please log in with your new password.');
            setEmail('');
            setNewPassword('');
            // Optionally, redirect to login page
            window.location.href = '/login';
        }
        else {
            alert(response.data.message || 'Password reset failed');
        }   

    } catch (error) {
      console.error(error);
      alert('Error sending password reset link');
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="container" style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="card shadow p-4" style={{ maxWidth: "450px", width: "100%", borderRadius: "12px", background: "#fff" }}>
          <h2 className="text-center mb-3" style={{ fontWeight: 700, letterSpacing: 1 }}>Forget Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Enter new password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
            </div>  
            <button className="btn btn-primary w-100" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ForgetPassword;
