import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout.jsx";
import UserMenu from "../../components/UserMenu.jsx";
import { useAuth } from "../../context/Auth.jsx";
import { toast } from "react-toastify";
import "../../styles/Profile.css";

const UserProfile = () => {
  const { auth, setAuth } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const u = auth?.user;
    if (u) {
      setName(u.name || "");
      setEmail(u.email || "");
      setPhone(u.phone || "");
      setAddress(u.address || "");
    }
  }, [auth]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = auth?.token;
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
        const newAuth = { ...auth, user: data.user };
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
      <div className="profile-container">
        <div className="profile-content">
          <div className="profile-sidebar">
            <UserMenu />
          </div>
          
          <div className="profile-main">
            <div className="profile-card">
              <div className="profile-header">
                <h2>My Profile</h2>
                <p>Manage your account information and security</p>
              </div>

              <form onSubmit={handleUpdate}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Enter your name"
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    value={email} 
                    readOnly 
                    disabled
                  />
                  <small style={{color: '#999', marginTop: '5px', display: 'block'}}>Email cannot be changed</small>
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <textarea 
                    className="form-control" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    rows="3"
                    placeholder="Enter your address"
                  />
                </div>

                <div className="form-group">
                  <label>New Password <span style={{fontWeight: 'normal', color: '#888'}}>(Leave blank to keep current)</span></label>
                  <input 
                    type="password" 
                    className="form-control" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Enter new password"
                  />
                </div>

                <button type="submit" className="btn-update">
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;