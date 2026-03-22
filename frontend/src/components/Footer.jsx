import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Footer() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  return (
    <footer className="bg-primary-dark text-white/80 mt-auto">
      {/* Wave separator */}
      <div className="relative h-16 bg-surface overflow-hidden">
        <svg
          viewBox="0 0 1440 64"
          className="absolute bottom-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0,32 C360,64 720,0 1080,32 C1260,48 1380,48 1440,32 L1440,64 L0,64 Z"
            fill="#0f1f33"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <motion.div {...fadeInUp} className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-white">
                STEM<span className="text-secondary">Shop</span>
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Cung cấp các sản phẩm STEM chất lượng cao, giúp trẻ em và học sinh
              phát triển tư duy sáng tạo và kỹ năng công nghệ.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.1 }}>
            <h4 className="text-white font-semibold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Trang chủ' },
                { to: '/products', label: 'Sản phẩm' },
                { to: '/cart', label: 'Giỏ hàng' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white/60 hover:text-secondary transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.2 }}>
            <h4 className="text-white font-semibold mb-4">Danh mục</h4>
            <ul className="space-y-2">
              {['Robot', 'Linh kiện', 'Kit học tập'].map((cat) => (
                <li key={cat}>
                  <span className="text-white/60 text-sm">{cat}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.3 }}>
            <h4 className="text-white font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-3">
              <li className="text-white/60 text-sm">
                <span className="text-white/40 text-xs block">Email</span>
                support@stemshop.vn
              </li>
              <li className="text-white/60 text-sm">
                <span className="text-white/40 text-xs block">Điện thoại</span>
                0123 456 789
              </li>
              <li className="text-white/60 text-sm">
                <span className="text-white/40 text-xs block">Địa chỉ</span>
                FPT University, HCM
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom */}
        <motion.div
          {...fadeInUp}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-white/40 text-sm">
            &copy; 2026 STEMShop. SWD392 - FPT University.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-white/40 text-sm hover:text-secondary transition-colors cursor-pointer">
              Điều khoản
            </span>
            <span className="text-white/40 text-sm hover:text-secondary transition-colors cursor-pointer">
              Chính sách
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
