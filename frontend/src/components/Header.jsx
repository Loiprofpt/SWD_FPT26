import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore from '../store/useCartStore';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // Giả sử useCartStore trả về object chứa items
    const { items } = useCartStore() || { items: [] }; 
    const [user, setUser] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const checkUser = () => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                setUser(JSON.parse(userStr));
            } catch (e) {
                setUser(null);
            }
        } else {
            setUser(null);
        }
    };

    useEffect(() => {
        checkUser();
        
        // Lắng nghe sự kiện custom từ Login.jsx để cập nhật ngay lập tức
        window.addEventListener("storage", checkUser);
        
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("storage", checkUser);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setShowUserMenu(false);
        window.dispatchEvent(new Event("storage")); // Cập nhật lại trạng thái cho các component khác
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
                        S
                    </div>
                    <span className="font-bold text-xl tracking-tight text-primary-dark">
                        STEM Shop
                    </span>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {[
                        { name: 'Trang chủ', path: '/' },
                        { name: 'Sản phẩm', path: '/products' },
                    ].map((item) => (
                        <Link 
                            key={item.path} 
                            to={item.path}
                            className={`text-sm font-medium transition-colors ${
                                isActive(item.path) 
                                    ? 'text-primary' 
                                    : 'text-gray-500 hover:text-primary'
                            }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    {/* Cart */}
                    <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors group">
                        <svg className="w-6 h-6 text-gray-600 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        {items && items.length > 0 && (
                            <span className="absolute top-0 right-0 w-5 h-5 bg-danger text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                                {items.length}
                            </span>
                        )}
                    </Link>

                    {/* User Section */}
                    {user ? (
                        <div className="relative">
                            <button 
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 hover:bg-gray-100 py-1 px-2 rounded-lg transition-colors cursor-pointer"
                            >
                                <div className="w-8 h-8 bg-secondary/10 text-secondary rounded-full flex items-center justify-center font-bold">
                                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                    {user.fullName}
                                </span>
                            </button>

                            <AnimatePresence>
                                {showUserMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-1"
                                    >
                                        <div className="px-4 py-3 border-b border-gray-50">
                                            <p className="text-sm font-bold text-gray-700 truncate">{user.fullName}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                        
                                        <Link 
                                            to="/profile" 
                                            className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            Thông tin cá nhân
                                        </Link>
                                        {user.role !== 'Admin' ? (
                                            <Link 
                                                to="/profile?tab=orders" 
                                                className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                📋 Lịch sử mua hàng
                                            </Link>
                                        ) : (
                                            <Link 
                                                to="/admin" 
                                                className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                Trang quản trị
                                            </Link>
                                        )}
                                        
                                        <button 
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-red-50 transition-colors cursor-pointer"
                                        >
                                            Đăng xuất
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                                Đăng nhập
                            </Link>
                            <Link 
                                to="/register" 
                                className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/30 transition-all"
                            >
                                Đăng ký
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;