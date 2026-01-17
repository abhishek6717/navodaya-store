import Layout from "../../components/Layout";

const VerifyEmailInfo = () => {
  return (
    <Layout title="Verify Email">
      <div style={{ maxWidth: 500, margin: "50px auto", textAlign: "center" }}>
        <h2>Verify Your Email</h2>
        <p>
          We have sent a verification link to your email address.
          Please click the link to activate your account.
        </p>
        <p style={{ color: "#777" }}>
          Check spam folder if not received.
        </p>
      </div>
    </Layout>
  );
};

export default VerifyEmailInfo;
