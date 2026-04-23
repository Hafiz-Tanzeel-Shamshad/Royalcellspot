import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderConfirmation from "./pages/OrderConfirmation.jsx";
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AddProduct from './pages/admin/AddProduct.jsx';
import OrderList from './pages/admin/OrderList.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

function App() {
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAdmin(true);
    }
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div style={styles.app}>
        {/* Announcement Bar */}
        <div style={styles.announcement}>
          <span>✈️ aaaaFREE INTERNATIONAL SHIPPING ON ORDERS ABOVE $500 • 🔒 Secure Checkout • ✓ Authentic Products</span>
        </div>
        
        <Navbar />
        
        <main style={styles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
            <Route path="/admin/login" element={<AdminLogin setAdmin={setAdmin} />} />
                        <Route path="/admin" element={admin ? <AdminDashboard setAdmin={setAdmin} /> : <Navigate to="/admin/login" />} />
            <Route path="/admin/add-product" element={admin ? <AddProduct /> : <Navigate to="/admin/login" />} />
            <Route path="/admin/orders" element={admin ? <OrderList /> : <Navigate to="/admin/login" />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    color: '#0a0a0a',
  },
  announcement: {
    background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
    color: '#fff',
    textAlign: 'center',
    padding: '10px 16px',
    fontSize: '12px',
    letterSpacing: '0.5px',
    fontWeight: '500',
  },
  main: {
    minHeight: 'calc(100vh - 200px)',
  }
};

export default App;
