import Layout from "../../components/Layout";
import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/AuthStyles.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL;

      const res = await axios.post(`${apiUrl}/api/v1/auth/register`, {
        name: username,
        email,
        password,
        phone: phoneNo,
        address,
      });
      console.log("res.data",res.data);
      if (res.data.status) {
        toast.success("Registered successfully! Verify your email.");
        navigate("/verify-email-info");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Register">
      <div className="auth-container">
        <div className="auth-card">
          <h2>Create Account</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              className="form-control mb-3"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              className="form-control mb-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="form-control mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Phone"
              className="form-control mb-3"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Address"
              className="form-control mb-3"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Creating Account..." : "Register"}
            </button>

            <div className="mt-3 text-center">
              <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
