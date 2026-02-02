import Header from './Header.jsx';  
import Footer from './Footer.jsx';
import Breadcrumb from './Breadcrumb.jsx';
import BackToTop from './BackToTop.jsx';
import { Helmet } from "react-helmet";
import { ToastContainer} from 'react-toastify';
import '../styles/GlobalImprovements.css';

const Layout = ({children,title,description,keywords,author}) => {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
      </Helmet>
      <Header/>
      <main style={{minHeight:'74vh'}} className="container">
        <ToastContainer />
        {children}    
      </main>
      <BackToTop />
      <Footer/> 
    </>
  )
}

Layout.defaultProps = {
  title: "Ecommerce Website",
  description: "Welcome to our Ecommerce Website",
  keywords: "ecommerce, shopping, online store",
  author: "Novadaya store team"
}

export default Layout