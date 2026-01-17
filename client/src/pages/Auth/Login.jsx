import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import "../../styles/AuthStyles.css";
import { useAuth } from "../../context/Auth.jsx";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    // Auth context returns an object (auth, setAuth, logout)
    const { auth, setAuth } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await axios.post(`${apiUrl}/api/v1/auth/login`, {
                email,
                password
            });
            if (response.data.user.isVerified === false) {
                toast.error("Please verify your email first");
                return;
            }

            if (response.data.status) {
                toast.success("Login successful");
                const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
                const user = response.data.user;
                const token = response.data.token;

                // save auth before navigating
                setAuth({
                    user,
                    token,
                    expiresAt
                });
                localStorage.setItem('auth', JSON.stringify({
                    user,
                    token,
                    expiresAt
                }));

                // navigate based on role (assumes role === 1 is admin)
 
                setTimeout(() => {
                console.log(
                    "User role:", user.admin
                    
                )
                    if (user?.admin === true) {
                        navigate('/dashboard/admin');
                    } else {
                        navigate('/');
                    }
                }, 600);
            } else {
                toast.error(response.data.message || "Login failed");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <Layout title={'Login'} description={'Login to your account'}>
            <div className="auth-container">
                <div className="auth-card">
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                id="email"
                                type="email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3 text-end">
                            <button type="button" className="btn btn-link p-0" onClick={() => navigate('/forget-password')}>Forgot Password?</button>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Login</button>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
export default Login;