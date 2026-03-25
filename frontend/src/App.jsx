import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useAuthStore from './store/useAuthStore';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Admin/Dashboard';
import ResetPassword from './ResetPassword';
import ForgotPassword from './ForgotPassword';
import Profile from './pages/Profile';
import PaymentResult from './pages/PaymentResult';

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

function AppRoutes() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/reset-password', '/forgot-password'].includes(location.pathname);
  const { isAuthenticated, login } = useAuthStore();

  useEffect(() => {
    // Hydrate old sessions missing auth-storage
    if (!isAuthenticated) {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      if (token && userStr) {
        try {
          login(JSON.parse(userStr), token);
        } catch(e) {}
      }
    }
  }, [isAuthenticated, login]);

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <Header />}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/products" element={<PageTransition><Products /></PageTransition>} />
            <Route path="/products/:id" element={<PageTransition><ProductDetail /></PageTransition>} />
            <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
            <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />

            {/* Protected Routes (phải đăng nhập) */}
            <Route path="/checkout" element={<PrivateRoute><PageTransition><Checkout /></PageTransition></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><PageTransition><Profile /></PageTransition></PrivateRoute>} />
            <Route path="/payment/result" element={<PrivateRoute><PageTransition><PaymentResult /></PageTransition></PrivateRoute>} />

            {/* Admin Routes (chỉ Admin/Staff) */}
            <Route path="/admin" element={<AdminRoute><PageTransition><Dashboard /></PageTransition></AdminRoute>} />
          </Routes>
        </AnimatePresence>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
