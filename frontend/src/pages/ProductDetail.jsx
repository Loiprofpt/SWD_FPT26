import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useCartStore from '../store/useCartStore';
import { productApi } from '../api/productApi';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Arduino Uno R3', price: 250000, stockQuantity: 100, categoryName: 'Linh kiện', brandName: 'Arduino', imageUrl: '', ageRange: '10+', description: 'Bo mạch Arduino Uno R3 chính hãng, lý tưởng cho người mới bắt đầu học lập trình và điện tử.', technicalSpecs: 'Vi xử lý: ATmega328P | Điện áp: 5V | Digital I/O: 14 | Analog Input: 6 | Flash: 32KB' },
  { id: 2, name: 'Raspberry Pi 4 Model B', price: 1500000, stockQuantity: 50, categoryName: 'Linh kiện', brandName: 'Raspberry Pi', imageUrl: '', ageRange: '12+', description: 'Máy tính mini Raspberry Pi 4 với hiệu năng mạnh mẽ, hỗ trợ 4K dual display.', technicalSpecs: 'CPU: BCM2711 Quad-core | RAM: 4GB | WiFi: 802.11ac | Bluetooth 5.0 | USB 3.0 x2' },
  { id: 3, name: 'LEGO Mindstorms EV3', price: 8500000, stockQuantity: 20, categoryName: 'Robot', brandName: 'LEGO', imageUrl: '', ageRange: '10+', description: 'Bộ robot lập trình LEGO Mindstorms EV3 với nhiều cảm biến và động cơ.', technicalSpecs: 'CPU: ARM9 300MHz | RAM: 64MB | Flash: 16MB | Motor: 3 servo | Sensor: 5 loại' },
  { id: 4, name: 'Kit Robot Car 4WD', price: 450000, stockQuantity: 75, categoryName: 'Robot', brandName: 'Arduino', imageUrl: '', ageRange: '12+', description: 'Kit xe robot 4 bánh điều khiển từ xa, tương thích Arduino.', technicalSpecs: 'Motor: 4x DC | Driver: L298N | Khung: Acrylic | Bánh: 65mm | Pin: 18650 x2' },
];

export default function ProductDetail() {
  const { id } = useParams();
  const addToCart = useCartStore((s) => s.addToCart);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    productApi.getById(id).then((res) => {
      if (res?.data) setProduct(res.data);
      else setProduct(MOCK_PRODUCTS.find((p) => p.id === Number(id)) || MOCK_PRODUCTS[0]);
    }).catch(() => {
      setProduct(MOCK_PRODUCTS.find((p) => p.id === Number(id)) || MOCK_PRODUCTS[0]);
    });
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';

  if (!product) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-sm text-gray-400 mb-8"
        >
          <Link to="/" className="hover:text-secondary transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-secondary transition-colors">Sản phẩm</Link>
          <span>/</span>
          <span className="text-primary-dark">{product.name}</span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="card overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-12">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-48 h-48 rounded-3xl gradient-primary opacity-15" />
                )}
              </div>
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-2 mb-3">
              {product.categoryName && (
                <span className="text-xs font-medium text-secondary bg-secondary/10 px-3 py-1 rounded-lg">
                  {product.categoryName}
                </span>
              )}
              {product.brandName && (
                <span className="text-xs font-medium text-primary/60 bg-primary/5 px-3 py-1 rounded-lg">
                  {product.brandName}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-primary-dark mb-4">{product.name}</h1>

            <div className="text-3xl font-bold text-secondary mb-6">{formatPrice(product.price)}</div>

            {product.description && (
              <p className="text-gray-500 mb-6 leading-relaxed">{product.description}</p>
            )}

            {product.ageRange && (
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm text-gray-400">Độ tuổi phù hợp:</span>
                <span className="bg-accent/10 text-accent-dark text-sm font-semibold px-3 py-1 rounded-lg">{product.ageRange}</span>
              </div>
            )}

            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm text-gray-400">Tồn kho:</span>
              <span className={`text-sm font-semibold ${product.stockQuantity > 0 ? 'text-success' : 'text-danger'}`}>
                {product.stockQuantity > 0 ? `Còn ${product.stockQuantity} sản phẩm` : 'Hết hàng'}
              </span>
            </div>

            {/* Technical Specs */}
            {product.technicalSpecs && (
              <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <h3 className="font-semibold text-primary-dark mb-3">Thông số kỹ thuật</h3>
                <div className="space-y-2">
                  {product.technicalSpecs.split(' | ').map((spec, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 shrink-0" />
                      <span className="text-sm text-gray-600">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add to cart - Hide for Admin */}
            {JSON.parse(localStorage.getItem("user") || "{}")?.role !== 'Admin' ? (
              <div className="mt-auto pt-6 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-gray-100 rounded-xl">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center text-lg font-bold text-gray-600 hover:text-primary transition-colors cursor-pointer"
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 flex items-center justify-center text-lg font-bold text-gray-600 hover:text-primary transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddToCart}
                    disabled={product.stockQuantity === 0}
                    className={`flex-1 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 cursor-pointer ${
                      added
                        ? 'bg-success text-white'
                        : 'bg-primary text-white hover:bg-primary-light hover:shadow-xl hover:shadow-primary/25'
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    {added ? 'Đã thêm vào giỏ!' : 'Thêm vào giỏ hàng'}
                  </motion.button>
                </div>
              </div>
            ) : (
                <div className="mt-auto pt-6 border-t border-gray-100">
                    <Link to="/admin" className="block w-full py-4 bg-gray-100 text-gray-500 rounded-2xl font-semibold text-center hover:bg-gray-200 transition-colors">
                        Bạn đang ở chế độ Admin. Quản lý sản phẩm tại Dashboard.
                    </Link>
                </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
