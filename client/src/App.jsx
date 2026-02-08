import Layout from './components/Layout.jsx';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage.jsx';
import About from './pages/About.jsx';
import ContactUs from './pages/ContactUs.jsx';
import PageNotFound from './pages/PageNotFound.jsx';
import Policy from './pages/Policy.jsx';
import Register from './pages/Auth/Register.jsx';
import Login from './pages/Auth/Login.jsx';
import Dashboard from './pages/user/Dashboard.jsx';
import Private from './components/Routes/Private.jsx';
import ForgetPassword from './pages/Auth/ForgetPassword.jsx';
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import AdminHome from "./pages/Admin/AdminHome.jsx";
import CreateCategory from "./pages/Admin/CreateCategory.jsx";
import CreateProduct from "./pages/Admin/CreateProduct.jsx";
import Products from "./pages/Admin/Products.jsx";
import Orders from "./pages/Admin/Orders.jsx";
import Users from "./pages/Admin/Users.jsx";
import AdminFeedback from "./pages/Admin/AdminFeedback.jsx";
import AdminRoutes from "./components/Routes/AdminRoutes.jsx";
import UserProfile from "./pages/user/Profile.jsx";
import UserOrders from "./pages/user/UserOrders.jsx";
import UpdateProduct from "./pages/Admin/UpdateProduct.jsx";
import ProductDetails from './pages/ProductDetails.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import CartPage from './pages/CartPage.jsx';
import Checkout from './pages/Checkout.jsx';
import VerifyEmail from './pages/Auth/VerifyEmail.jsx';
import VerifyEmailInfo from './pages/Auth/VerifyEmailInfo.jsx';
import Feedback from './pages/Feedback.jsx';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<Private />}>
          <Route index element={<Dashboard />} />
        </Route>

        {/* User area (protected) */}
        <Route path="/dashboard/user" element={<Private />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="orders" element={<UserOrders />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/dashboard/admin" element={<AdminRoutes />}>
          <Route index element={<AdminHome />} />
          <Route path="create-category" element={<CreateCategory />} />
          <Route path="create-product" element={<CreateProduct />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="feedback" element={<AdminFeedback />} />
          <Route path="update-product/:id" element={<UpdateProduct />} />
          

        </Route>

        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/logout" element={<Login />} />
        <Route path='/forget-password' element={<ForgetPassword />} />
        <Route path="/verify-email-info" element={<VerifyEmailInfo />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
     

        {/* Catch-all */}
        <Route path="*" element={<PageNotFound />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/category/:id" element={<CategoryPage />} />
      </Routes>
    </>
  );
}

export default App;
