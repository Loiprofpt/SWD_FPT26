import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const items = useCartStore((s) => s.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const navLinks = [
    { to: '/', label: 'Trang chủ' },
    { to: '/products', label: 'Sản phẩm' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-primary/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center"
            >
              <span className="text-white font-bold text-lg">S</span>
            </motion.div>
            <span className={`text-xl font-bold transition-colors duration-300 ${
              scrolled ? 'text-primary' : 'text-white'
            }`}>
              STEM<span className="text-secondary">Shop</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  location.pathname === link.to
                    ? 'text-secondary'
                    : scrolled
                    ? 'text-gray-600 hover:text-primary'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
                {location.pathname === link.to && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-secondary rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/cart"
              className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                scrolled ? 'text-gray-600 hover:text-primary' : 'text-white/80 hover:text-white'
              }`}
            >
              Giỏ hàng
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-xs rounded-full flex items-center justify-center font-bold"
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {user?.roleId === 1 && (
                  <Link to="/admin" className="btn-secondary text-sm py-2 px-4">
                    Admin
                  </Link>
                )}
                <div className="relative group">
                  <button className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    scrolled ? 'text-primary' : 'text-white'
                  }`}>
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user?.fullName?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="font-medium">{user?.fullName || 'User'}</span>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                    <Link to="/orders" className="block px-4 py-3 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-t-xl transition-colors">
                      Đơn hàng của tôi
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-3 text-danger hover:bg-red-50 rounded-b-xl transition-colors"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    scrolled ? 'text-primary hover:bg-primary/5' : 'text-white hover:bg-white/10'
                  }`}
                >
                  Đăng nhập
                </Link>
                <Link to="/register" className="btn-secondary text-sm py-2 px-4">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'text-primary' : 'text-white'
            }`}
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`block h-0.5 rounded transition-all duration-300 ${
                mobileOpen ? 'rotate-45 translate-y-2' : ''
              } ${scrolled ? 'bg-primary' : 'bg-white'}`} />
              <span className={`block h-0.5 rounded transition-all duration-300 ${
                mobileOpen ? 'opacity-0' : ''
              } ${scrolled ? 'bg-primary' : 'bg-white'}`} />
              <span className={`block h-0.5 rounded transition-all duration-300 ${
                mobileOpen ? '-rotate-45 -translate-y-2' : ''
              } ${scrolled ? 'bg-primary' : 'bg-white'}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-xl"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block px-4 py-3 rounded-xl text-gray-600 hover:text-primary hover:bg-primary/5 font-medium transition-all"
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/cart" className="block px-4 py-3 rounded-xl text-gray-600 hover:text-primary hover:bg-primary/5 font-medium transition-all">
                Giỏ hàng {totalItems > 0 && `(${totalItems})`}
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/orders" className="block px-4 py-3 rounded-xl text-gray-600 hover:text-primary hover:bg-primary/5 font-medium transition-all">
                    Đơn hàng của tôi
                  </Link>
                  <button onClick={logout} className="w-full text-left px-4 py-3 rounded-xl text-danger hover:bg-red-50 font-medium transition-all">
                    Đăng xuất
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link to="/login" className="flex-1 btn-outline text-center text-sm py-2">Đăng nhập</Link>
                  <Link to="/register" className="flex-1 btn-secondary text-center text-sm py-2">Đăng ký</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
