import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout.jsx";
import UserMenu from "../../components/UserMenu.jsx";
import { useAuth } from "../../context/Auth.jsx";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_API_URL;

const UserProfile = () => {
  const { auth } = useAuth();
  const { auth: authState, setAuth } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const u = auth?.user || authState?.user;
    if (u) {
      setName(u.name || "");
      setEmail(u.email || "");
      setPhone(u.phone || "");
      setAddress(u.address || "");
    }
  }, [auth, authState]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = (auth && auth.token) || (authState && authState.token);
      const res = await fetch(`${apiUrl}/api/v1/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, phone, address, password: password || undefined }),
      });
      const data = await res.json();
      if (data?.status) {
        toast.success(data.message || 'Profile updated');
        // update auth context and localStorage
        const newAuth = { ...(auth || authState), user: data.user };
        setAuth(newAuth);
        localStorage.setItem('auth', JSON.stringify(newAuth));
        setPassword('');
      } else {
        toast.error(data?.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Update failed');
    }
  };

  return (
    <Layout title="User Profile" description="Manage your profile">
      <div className="container-fluid m-0 p-0" style={{ minHeight: "100vh" }}>
        <div className="row g-0" style={{ minHeight: "100vh" }}>
          <div className="col-12 col-md-3 bg-light border-end" style={{ minHeight: "100vh" }}>
            <div className="p-3" style={{ overflowY: "auto" }}>
              <UserMenu />
            </div>
          </div>
          <div className="col-12 col-md-9" style={{ minHeight: "100vh" }}>
            <div className="p-4">
              <h2>Profile</h2>
              <div className="card p-3 mb-3">
                <p><strong>Name:</strong> {auth?.user?.name || "—"}</p>
                <p><strong>Email:</strong> {auth?.user?.email || "—"}</p>
                <p><strong>Phone:</strong> {auth?.user?.phone || "—"}</p>
                <p><strong>Address:</strong> {auth?.user?.address || "—"}</p>
              </div>
 
              <div className="card p-3">
                <h5>Update Profile</h5>
                <form onSubmit={handleUpdate}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email (read-only)</label>
                    <input className="form-control" value={email} readOnly />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">New Password (optional)</label>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>

                  <button type="submit" className="btn btn-primary">Update Profile</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;