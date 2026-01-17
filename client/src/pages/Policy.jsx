import Layout from "../components/Layout";

const Policy = () => {  
    return (
        <Layout title={'Privacy-policy'} description={'Best offers'} className="container">
            <div className="row">
                <div className="col-md-6">
                    <img
                        src="/images/policy.jpg"
                        alt="Privacy Policy"
                        className="img-fluid rounded"
                        style={{ maxWidth: "100%", height: "auto", margin: "20px 0" }}
                        loading="lazy"
                    />
                </div>
                <div className="col-md-6" style={{ padding: "20px" }}>
                    <h1>Privacy Policy</h1>
                    <p>
                        This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from our website.
                    </p>
                    <h2>Information We Collect</h2>
                    <p>
                        When you visit the site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, as you browse the site, we collect information about the individual web pages or products that you view, what websites or search terms referred you to the site, and information about how you interact with the site.
                    </p>
                    <h2>Use of Personal Information</h2>
                    <p>
                        We use the information we collect to fulfill orders placed through the site (including processing your payment information, arranging for shipping, and providing you with confirmations).
                    </p>
                </div>
            </div>
        </Layout>
    );
}
export default Policy;