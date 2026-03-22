import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { productApi } from '../api/productApi';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Arduino Uno R3', price: 250000, stockQuantity: 100, categoryName: 'Linh kiện', brandName: 'Arduino', imageUrl: '', ageRange: '10+' },
  { id: 2, name: 'Raspberry Pi 4 Model B', price: 1500000, stockQuantity: 50, categoryName: 'Linh kiện', brandName: 'Raspberry Pi', imageUrl: '', ageRange: '12+' },
  { id: 3, name: 'LEGO Mindstorms EV3', price: 8500000, stockQuantity: 20, categoryName: 'Robot', brandName: 'LEGO', imageUrl: '', ageRange: '10+' },
  { id: 4, name: 'Kit Robot Car 4WD', price: 450000, stockQuantity: 75, categoryName: 'Robot', brandName: 'Arduino', imageUrl: '', ageRange: '12+' },
  { id: 5, name: 'Sensor Kit 37 in 1', price: 350000, stockQuantity: 200, categoryName: 'Kit học tập', brandName: 'Arduino', imageUrl: '', ageRange: '10+' },
  { id: 6, name: 'Breadboard Kit Cơ Bản', price: 120000, stockQuantity: 300, categoryName: 'Linh kiện', brandName: 'Arduino', imageUrl: '', ageRange: '8+' },
  { id: 7, name: 'LEGO Education SPIKE', price: 7200000, stockQuantity: 15, categoryName: 'Kit học tập', brandName: 'LEGO', imageUrl: '', ageRange: '8+' },
  { id: 8, name: 'Raspberry Pi Pico W', price: 180000, stockQuantity: 150, categoryName: 'Linh kiện', brandName: 'Raspberry Pi', imageUrl: '', ageRange: '12+' },
];

const CATEGORIES = [
  { name: 'Robot', count: 25, color: 'from-blue-500 to-cyan-400' },
  { name: 'Linh kiện', count: 120, color: 'from-emerald-500 to-teal-400' },
  { name: 'Kit học tập', count: 45, color: 'from-violet-500 to-purple-400' },
];

const STATS = [
  { value: '500+', label: 'Sản phẩm' },
  { value: '10K+', label: 'Khách hàng' },
  { value: '50+', label: 'Thương hiệu' },
  { value: '99%', label: 'Hài lòng' },
];

export default function Home() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);

  useEffect(() => {
    productApi.getAll().then((res) => {
      if (res?.success) setProducts(res.data);
    }).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen gradient-hero overflow-hidden flex items-center">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/2 -left-20 w-60 h-60 bg-accent/10 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-secondary/5 rounded-full blur-2xl animate-pulse-slow" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block bg-white/10 backdrop-blur-sm text-secondary-light text-sm font-medium px-4 py-2 rounded-full mb-6 border border-white/10"
              >
                #1 STEM Education Store
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Khám phá{' '}
                <span className="text-gradient">Thế giới STEM</span>
                <br />
                cho tương lai
              </h1>

              <p className="text-white/70 text-lg sm:text-xl mb-8 max-w-lg">
                Cung cấp bộ kit Robot, Arduino, Raspberry Pi và hàng trăm sản phẩm
                STEM giúp bạn học tập và sáng tạo.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/products">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-secondary text-white px-8 py-4 rounded-2xl font-semibold text-lg
                               hover:bg-secondary-dark transition-all duration-300
                               hover:shadow-xl hover:shadow-secondary/30 cursor-pointer"
                  >
                    Mua sắm ngay
                  </motion.button>
                </Link>
                <Link to="/products">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-semibold text-lg
                               hover:bg-white/10 transition-all duration-300 cursor-pointer"
                  >
                    Tìm hiểu thêm
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Hero visual */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Main card */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20"
                >
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Arduino', color: 'bg-cyan-400/20', text: 'text-cyan-300' },
                      { label: 'Robot Kit', color: 'bg-emerald-400/20', text: 'text-emerald-300' },
                      { label: 'Sensor', color: 'bg-violet-400/20', text: 'text-violet-300' },
                      { label: 'Raspberry', color: 'bg-rose-400/20', text: 'text-rose-300' },
                    ].map((item, i) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + i * 0.15 }}
                        className={`${item.color} rounded-2xl p-6 text-center`}
                      >
                        <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-white/10 flex items-center justify-center">
                          <span className={`text-2xl font-bold ${item.text}`}>
                            {item.label.charAt(0)}
                          </span>
                        </div>
                        <span className="text-white/80 text-sm font-medium">{item.label}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Floating badge */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -top-4 -right-4 bg-accent text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-accent/30"
                >
                  HOT SALE
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-20 pt-12 border-t border-white/10"
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/50 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="text-secondary text-sm font-semibold tracking-wider uppercase">Danh mục</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-dark mt-2">
              Khám phá theo danh mục
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                whileHover={{ y: -6, scale: 1.02 }}
              >
                <Link
                  to={`/products?category=${cat.name}`}
                  className={`block bg-gradient-to-br ${cat.color} rounded-3xl p-8 text-white relative overflow-hidden group`}
                >
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700" />
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-2">{cat.name}</h3>
                    <p className="text-white/80">{cat.count} sản phẩm</p>
                    <span className="inline-block mt-4 bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-xl group-hover:bg-white/30 transition-colors">
                      Xem ngay →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-14 gap-4"
          >
            <div>
              <span className="text-secondary text-sm font-semibold tracking-wider uppercase">Nổi bật</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-dark mt-2">
                Sản phẩm nổi bật
              </h2>
            </div>
            <Link
              to="/products"
              className="text-secondary font-semibold hover:text-secondary-dark transition-colors group"
            >
              Xem tất cả{' '}
              <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Why STEM */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="text-secondary text-sm font-semibold tracking-wider uppercase">Tại sao chọn chúng tôi</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-dark mt-2">
              Uy tín & Chất lượng
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Chính hãng 100%', desc: 'Tất cả sản phẩm đều có nguồn gốc rõ ràng, bảo hành chính hãng từ nhà sản xuất.', color: 'bg-blue-50 text-blue-600', letter: 'C' },
              { title: 'Giao hàng nhanh', desc: 'Vận chuyển nhanh chóng toàn quốc. Giao hàng trong 24h nội thành HCM.', color: 'bg-emerald-50 text-emerald-600', letter: 'G' },
              { title: 'Hỗ trợ tận tình', desc: 'Đội ngũ kỹ thuật hỗ trợ hướng dẫn sử dụng và lập trình miễn phí.', color: 'bg-violet-50 text-violet-600', letter: 'H' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="card p-8 text-center hover:border-secondary/20 border border-transparent"
              >
                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                  <span className="text-2xl font-bold">{item.letter}</span>
                </div>
                <h3 className="text-xl font-bold text-primary-dark mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="gradient-hero rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-secondary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent/20 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Sẵn sàng bắt đầu hành trình STEM?
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                Đăng ký ngay để nhận ưu đãi 10% cho đơn hàng đầu tiên và cập nhật sản phẩm mới nhất.
              </p>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-primary px-8 py-4 rounded-2xl font-bold text-lg
                             hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  Đăng ký miễn phí
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
