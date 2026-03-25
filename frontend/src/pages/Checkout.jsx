import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import { orderApi } from '../api/orderApi';
import api from '../api/axiosConfig';

const PAYMENT_METHODS = [
  { id: 'COD', label: 'Thanh toán khi nhận hàng (COD)', desc: 'Trả tiền mặt khi nhận hàng' },
  { id: 'ATM', label: 'Chuyển khoản ngân hàng', desc: 'Chuyển khoản qua ATM/Internet Banking' },
  { id: 'Momo', label: 'Ví Momo', desc: 'Thanh toán qua ví điện tử Momo' },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';

  const [form, setForm] = useState({ address: '', phone: '', note: '' });
  const [payment, setPayment] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      // 1. Đồng bộ giỏ hàng với backend
      await api.delete('/carts').catch(()=> {}); // Xóa giỏ hàng cũ nếu có
      
      for (const item of items) {
        await api.post('/carts/items', { productId: item.id, quantity: item.quantity });
      }

      // 2. Tạo đơn hàng từ backend cart
      const response = await orderApi.create({
        address: form.address,
      });
      
      if (response && response.success) {
        setSuccess(true);
        clearCart();
      } else {
        alert(response?.message || 'Đặt hàng thất bại, vui lòng thử lại.');
      }
    } catch (error) {
      alert(error?.message || 'Có lỗi xảy ra trong quá trình kết nối.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="text-center max-w-md mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', damping: 10 }}
            className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <span className="text-success text-5xl font-bold">✓</span>
          </motion.div>
          <h2 className="text-3xl font-bold text-primary-dark mb-4">Đặt hàng thành công!</h2>
          <p className="text-gray-500 mb-8">
            Đơn hàng của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
          </p>
          <button onClick={() => navigate('/')} className="btn-primary cursor-pointer">
            Về trang chủ
          </button>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-400 mb-4">Giỏ hàng trống</h2>
          <button onClick={() => navigate('/products')} className="btn-primary cursor-pointer">
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-dark mb-8">Thanh toán</h1>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card p-6"
              >
                <h3 className="text-lg font-bold text-primary-dark mb-4">Thông tin giao hàng</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Địa chỉ giao hàng *</label>
                    <input
                      required
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="Nhập địa chỉ chi tiết..."
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Số điện thoại *</label>
                    <input
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="Nhập số điện thoại..."
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Ghi chú</label>
                    <textarea
                      value={form.note}
                      onChange={(e) => setForm({ ...form, note: e.target.value })}
                      placeholder="Ghi chú thêm cho đơn hàng..."
                      rows={3}
                      className="input-field resize-none"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-6"
              >
                <h3 className="text-lg font-bold text-primary-dark mb-4">Phương thức thanh toán</h3>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                        payment === method.id
                          ? 'border-secondary bg-secondary/5'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={payment === method.id}
                        onChange={(e) => setPayment(e.target.value)}
                        className="mt-1 accent-secondary"
                      />
                      <div>
                        <div className="font-semibold text-primary-dark">{method.label}</div>
                        <div className="text-sm text-gray-400">{method.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="card p-6 sticky top-24">
                <h3 className="text-lg font-bold text-primary-dark mb-4">Đơn hàng ({items.length})</h3>

                <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 truncate mr-2">
                        {item.name} <span className="text-gray-400">x{item.quantity}</span>
                      </span>
                      <span className="font-medium shrink-0">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tạm tính</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Vận chuyển</span>
                    <span className="text-success">Miễn phí</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="font-bold text-primary-dark">Tổng cộng</span>
                    <span className="text-xl font-bold text-secondary">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Xác nhận đặt hàng'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
}
