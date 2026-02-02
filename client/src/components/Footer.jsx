import { NavLink, Link } from "react-router-dom";
const Footer = () => {
  return (
    <div className="footer">
      <p>&copy; {new Date().getFullYear()} Novodaya Store</p>
      <p>
        <Link to="/policy" className="text-white">
          Privacy Policy
        </Link>
        <span className="mx-2">|</span>
        <Link to="/about" className="text-white">
          About Us
        </Link> 
        <span className="mx-2">|</span>
        <Link to="/contact-us" className="text-white">
          Contact Us
        </Link>
        <span className="mx-2">|</span>
        <Link to="/feedback" className="text-white">
          Feedback
        </Link>
      </p> 
    </div>
  );
}   
export default Footer;