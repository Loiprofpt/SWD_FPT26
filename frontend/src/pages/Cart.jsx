import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore from '../store/useCartStore';

const FREE_SHIP_THRESHOLD = 500000;

const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';

// ── Empty state ──────────────────────────────────────────────────────────────
function EmptyCart() {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-32 px-4"
    >
      {/* Illustration – no icons */}
      <div className="relative mb-10">
        {/* Outer glow ring */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-secondary/20"
          style={{ margin: '-20px' }}
        />
        {/* Main circle */}
        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-2 border-dashed border-secondary/30 flex items-center justify-center">
          {/* Basket shape */}
          <div className="relative">
            <div className="w-20 h-14 rounded-b-3xl border-4 border-secondary/60 relative flex items-end justify-center pb-1">
              <div className="flex gap-1">
                <div className="w-1 h-6 bg-secondary/40 rounded-full" />
                <div className="w-1 h-6 bg-secondary/40 rounded-full" />
                <div className="w-1 h-6 bg-secondary/40 rounded-full" />
              </div>
              {/* Handle */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-6 border-t-4 border-x-4 border-secondary/60 rounded-t-full" />
            </div>
            {/* Sparkles */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-2 -right-4 w-3 h-3 rounded-full bg-accent/70"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              className="absolute -bottom-2 -left-4 w-2 h-2 rounded-full bg-warning/70"
            />
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-primary-dark mb-3">Giỏ hàng trống</h2>
      <p className="text-gray-500 text-center max-w-sm mb-8 leading-relaxed">
        Bạn chưa thêm sản phẩm nào. Hãy khám phá bộ sưu tập STEM đa dạng của chúng tôi!
      </p>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
        <Link
          to="/products"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
        >
          <div className="w-5 h-5 rounded-full border-2 border-white/70 flex items-center justify-center">
            <div className="w-2 h-2 border-r-2 border-t-2 border-white/70 rotate-45 -translate-x-px" />
          </div>
          Khám phá sản phẩm
        </Link>
      </motion.div>

      {/* Suggested categories */}
      <div className="mt-12 flex flex-wrap gap-3 justify-center">
        {['Robot & Lập trình', 'Khoa học thực nghiệm', 'Toán học tư duy', 'Điện tử cơ bản'].map((cat) => (
          <motion.div key={cat} whileHover={{ y: -2, scale: 1.03 }}>
            <Link
              to="/products"
              className="text-sm px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:border-secondary hover:text-secondary transition-all duration-200 shadow-sm"
            >
              {cat}
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Cart item ────────────────────────────────────────────────────────────────
function CartItem({ item, index, onRemove, onUpdate }) {
  const [removing, setRemoving] = useState(false);

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => onRemove(item.id), 300);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: removing ? 0 : 1, x: removing ? -50 : 0 }}
      exit={{ opacity: 0, x: -50, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex gap-4 p-4 sm:p-5">
        {/* Product image */}
        <Link to={`/products/${item.id}`} className="shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-gradient-to-br from-surface to-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-contain p-2 hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20" />
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <Link to={`/products/${item.id}`}>
              <h3 className="font-semibold text-primary-dark hover:text-secondary transition-colors line-clamp-2 text-sm sm:text-base leading-snug">
                {item.name}
              </h3>
            </Link>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              {item.brandName && (
                <span className="text-xs px-2 py-0.5 bg-primary/8 text-primary rounded-full font-medium">
                  {item.brandName}
                </span>
              )}
              {item.categoryName && (
                <span className="text-xs px-2 py-0.5 bg-secondary/8 text-secondary-dark rounded-full font-medium">
                  {item.categoryName}
                </span>
              )}
            </div>
          </div>

          {/* Price + controls */}
          <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
            {/* Quantity stepper */}
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => onUpdate(item.id, item.quantity - 1)}
                className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-100 transition-colors cursor-pointer font-bold text-lg"
              >
                −
              </motion.button>
              <span className="w-10 text-center text-sm font-bold text-primary-dark select-none">
                {item.quantity}
              </span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => onUpdate(item.id, item.quantity + 1)}
                className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-100 transition-colors cursor-pointer font-bold text-lg"
              >
                +
              </motion.button>
            </div>

            {/* Prices */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-gray-400">{formatPrice(item.price)} × {item.quantity}</div>
                <div className="text-base font-bold text-secondary">{formatPrice(item.price * item.quantity)}</div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleRemove}
                className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors cursor-pointer group"
              >
                <div className="w-3.5 h-0.5 bg-danger group-hover:scale-110 transition-transform rounded-full" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Shipping progress bar ────────────────────────────────────────────────────
function ShippingProgress({ total }) {
  const percent = Math.min((total / FREE_SHIP_THRESHOLD) * 100, 100);
  const remaining = FREE_SHIP_THRESHOLD - total;

  return (
    <div className="mb-5 p-4 rounded-xl bg-gradient-to-r from-accent/10 to-secondary/10 border border-accent/20">
      {percent >= 100 ? (
        <p className="text-sm font-semibold text-success text-center">
          Chúc mừng! Bạn được miễn phí vận chuyển
        </p>
      ) : (
        <p className="text-sm text-gray-600 text-center mb-3">
          Thêm <span className="font-bold text-primary">{formatPrice(remaining)}</span> để được{' '}
          <span className="font-bold text-success">miễn phí vận chuyển</span>
        </p>
      )}
      <div className="h-2 bg-white/70 rounded-full overflow-hidden mt-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-accent to-secondary"
        />
      </div>
    </div>
  );
}

// ── Summary sidebar ──────────────────────────────────────────────────────────
function OrderSummary({ items, totalPrice }) {
  const navigate = useNavigate();
  const shippingFee = totalPrice >= FREE_SHIP_THRESHOLD ? 0 : 30000;
  const finalTotal = totalPrice + shippingFee;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="lg:col-span-1"
    >
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24">
        <h3 className="text-lg font-bold text-primary-dark mb-4">Tóm tắt đơn hàng</h3>

        <ShippingProgress total={totalPrice} />

        {/* Line items */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Tạm tính ({items.reduce((s, i) => s + i.quantity, 0)} sp)</span>
            <span className="font-medium text-gray-700">{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Phí vận chuyển</span>
            {shippingFee === 0 ? (
              <span className="font-semibold text-success">Miễn phí</span>
            ) : (
              <span className="font-medium text-gray-700">{formatPrice(shippingFee)}</span>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4 mb-5">
          <div className="flex justify-between items-center">
            <span className="font-bold text-primary-dark">Tổng cộng</span>
            <motion.span
              key={finalTotal}
              initial={{ scale: 1.15, color: '#00b4d8' }}
              animate={{ scale: 1, color: '#00b4d8' }}
              transition={{ duration: 0.3 }}
              className="text-xl font-bold text-secondary"
            >
              {formatPrice(finalTotal)}
            </motion.span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Đã bao gồm VAT (nếu có)</p>
        </div>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(30,58,95,0.25)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/checkout')}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-bold text-base shadow-lg shadow-primary/20 cursor-pointer transition-all duration-300"
        >
          Tiến hành thanh toán
        </motion.button>

        <Link
          to="/products"
          className="block text-center text-sm text-gray-400 hover:text-secondary mt-3 transition-colors"
        >
          ← Tiếp tục mua sắm
        </Link>

        {/* Trust badges */}
        <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-3 gap-3">
          {[
            { label: 'Bảo mật', sub: 'SSL 256-bit' },
            { label: 'Đổi trả', sub: '30 ngày' },
            { label: 'Hỗ trợ', sub: '24/7' },
          ].map(({ label, sub }) => (
            <div key={label} className="text-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 mx-auto mb-1 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-secondary/50" />
              </div>
              <p className="text-xs font-semibold text-gray-600">{label}</p>
              <p className="text-xs text-gray-400">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link to="/" className="hover:text-secondary transition-colors">Trang chủ</Link>
            <span>/</span>
            <span className="text-primary-dark font-medium">Giỏ hàng</span>
          </div>

          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-primary-dark">Giỏ hàng</h1>
              <p className="text-gray-400 mt-1">
                {items.length === 0
                  ? 'Chưa có sản phẩm'
                  : `${items.reduce((s, i) => s + i.quantity, 0)} sản phẩm trong giỏ`}
              </p>
            </div>

            {items.length > 0 && (
              <AnimatePresence>
                {showClearConfirm ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-2 bg-white border border-danger/30 rounded-xl px-4 py-2 shadow-sm"
                  >
                    <span className="text-sm text-gray-600">Xóa tất cả?</span>
                    <button
                      onClick={() => { clearCart(); setShowClearConfirm(false); }}
                      className="text-sm font-semibold text-danger hover:text-red-700 cursor-pointer transition-colors"
                    >
                      Xóa
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="text-sm text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                    >
                      Hủy
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => setShowClearConfirm(true)}
                    className="text-sm text-gray-400 hover:text-danger transition-colors cursor-pointer border border-gray-200 hover:border-danger/40 rounded-xl px-4 py-2"
                  >
                    Xóa tất cả
                  </motion.button>
                )}
              </AnimatePresence>
            )}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {items.length === 0 ? (
            <EmptyCart key="empty" />
          ) : (
            <motion.div
              key="cart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid lg:grid-cols-3 gap-6"
            >
              {/* Items list */}
              <div className="lg:col-span-2 space-y-3">
                <AnimatePresence>
                  {items.map((item, i) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      index={i}
                      onRemove={removeFromCart}
                      onUpdate={updateQuantity}
                    />
                  ))}
                </AnimatePresence>

                {/* Recently viewed hint */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-secondary/10 flex items-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                  <p className="text-sm text-gray-500">
                    Sản phẩm STEM chính hãng — bảo hành 12 tháng tại tất cả cửa hàng
                  </p>
                </motion.div>
              </div>

              {/* Sidebar */}
              <OrderSummary items={items} totalPrice={totalPrice} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
