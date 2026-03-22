import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore from '../store/useCartStore';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-dark mb-2">Giỏ hàng</h1>
          <p className="text-gray-400 mb-8">{items.length} sản phẩm trong giỏ</p>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl text-gray-300">0</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-400 mb-4">Giỏ hàng trống</h3>
            <p className="text-gray-400 mb-8">Bạn chưa thêm sản phẩm nào vào giỏ hàng</p>
            <Link to="/products" className="btn-primary inline-block">
              Tiếp tục mua sắm
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="card p-4 sm:p-6"
                  >
                    <div className="flex gap-4 sm:gap-6">
                      {/* Image */}
                      <Link to={`/products/${item.id}`} className="shrink-0">
                        <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gray-50 rounded-xl flex items-center justify-center">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-2" />
                          ) : (
                            <div className="w-12 h-12 rounded-xl gradient-primary opacity-15" />
                          )}
                        </div>
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <Link to={`/products/${item.id}`}>
                          <h3 className="font-semibold text-primary-dark hover:text-secondary transition-colors truncate">
                            {item.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          {item.brandName && (
                            <span className="text-xs text-gray-400">{item.brandName}</span>
                          )}
                        </div>
                        <div className="text-secondary font-bold mt-2">{formatPrice(item.price)}</div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center bg-gray-100 rounded-xl">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-primary transition-colors cursor-pointer"
                            >
                              −
                            </button>
                            <span className="w-9 text-center text-sm font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-primary transition-colors cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-bold text-primary-dark">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-sm text-danger hover:text-red-700 transition-colors cursor-pointer"
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={clearCart}
                className="text-sm text-gray-400 hover:text-danger transition-colors cursor-pointer"
              >
                Xóa tất cả
              </motion.button>
            </div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="card p-6 sticky top-24">
                <h3 className="text-lg font-bold text-primary-dark mb-6">Tổng đơn hàng</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tạm tính ({items.length} sản phẩm)</span>
                    <span className="font-medium">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Phí vận chuyển</span>
                    <span className="text-success font-medium">Miễn phí</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="font-bold text-primary-dark">Tổng cộng</span>
                    <span className="text-xl font-bold text-secondary">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <Link to="/checkout" className="btn-primary block text-center w-full">
                  Thanh toán
                </Link>
                <Link to="/products" className="block text-center text-sm text-gray-400 hover:text-secondary mt-3 transition-colors">
                  Tiếp tục mua sắm
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
