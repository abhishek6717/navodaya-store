import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import React from 'react';

const PageNotFound = () => {
    return (
        <Layout title={'Page Not Found'} description={'description'} className="container">
            <div className="pnf">
                <h1>404</h1>
                <h2>Oops! Page not Found</h2>
                <Link to="/" className="pnfLink">
                    Go to Home
                </Link>
            </div>
        </Layout>
    );
}
export default PageNotFound;