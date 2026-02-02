import Layout from "../components/Layout";
import { BiEnvelope, BiPhone, BiMap } from "react-icons/bi";
import { Link } from "react-router-dom";

const ContactUs = () => {
  return (
    <Layout title={'Contact-Us'} description={'Contact us'} className="container">
      <div className="row contact-us">
        <div className="col-md-6">
          <img
            src="/images/contact-us.jpg"
            alt="Contact Us"
            className="img-fluid rounded"
            style={{ maxWidth: "100%", height: "auto", margin: "20px 0" }}
            loading="lazy"
          />
        </div>
        <div className="col-md-6" style={{ padding: "20px" }}>
          <h1>Contact Us</h1>
          <p>If you have any questions, feel free to reach out to us!</p>
          <p
            style={{
              fontSize: "1.2em",
              lineHeight: "1.5",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <BiEnvelope size={22} /> Email: info@example.com
          </p>
          <p
            style={{
              fontSize: "1.2em",
              lineHeight: "1.5",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <BiPhone size={22} /> Mobile: +91-1234567890
          </p>
          <p
            style={{
              fontSize: "1.2em",
              lineHeight: "1.5",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <BiMap size={22} /> Address: 123, Main Street, Your City, India
          </p>
          <Link to="/feedback" className="feedback-link">
            Give Website Feedback →
          </Link>
        </div>
      </div>
    </Layout>
  );
};
export default ContactUs;