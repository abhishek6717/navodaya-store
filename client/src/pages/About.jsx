import Layout from "../components/Layout";

const About = () => {
  return (
    <Layout title={'About-Us'} className="container">
      <div className="row" >
        <div className="col-md-6">
          <img
            src="/images/about-us.jpg"
            alt="About Us"
            className="img-fluid rounded"
            style={{ maxWidth: "100%", height: "auto", margin: "20px 0" }}
            loading="lazy"
          />
        </div>
        <div className="col-md-6" style={{ padding: "20px" }}>
          <h1>About Us</h1>
          <p>
            Welcome to our e-commerce website! We are dedicated to providing you with the best products and services.
          </p>
          <p>
            Our mission is to deliver quality, value, and satisfaction to our customers. We believe in building lasting relationships based on trust and transparency.
          </p>
          <p>Thank you for choosing us. We look forward to serving you!</p>
        </div>
      </div>
    </Layout>
  );
};

export default About;