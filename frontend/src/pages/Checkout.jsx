import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import { orderApi } from '../api/orderApi';

const PAYMENT_METHODS = [
<<<<<<< Updated upstream
  { id: 'COD', label: 'Thanh toán khi nhận hàng (COD)', desc: 'Trả tiền mặt khi nhận hàng' },
  { id: 'ATM', label: 'Chuyển khoản ngân hàng', desc: 'Chuyển khoản qua ATM/Internet Banking' },
  { id: 'Momo', label: 'Ví Momo', desc: 'Thanh toán qua ví điện tử Momo' },
=======
  { id: 'COD', label: 'Thanh toán khi nhận hàng (COD)', desc: 'Trả tiền mặt khi nhận hàng', icon: '💵' },
  { id: 'ATM', label: 'Chuyển khoản ngân hàng', desc: 'Chuyển khoản qua ATM/Internet Banking', icon: '🏦' },
  { id: 'VNPAY', label: 'Thanh toán qua VNPay', desc: 'Quét mã QR qua ứng dụng ngân hàng', icon: '📱' },
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
=======
    if (!isAuthenticated) { navigate('/login'); return; }
    if (items.length === 0) return;

    if (payment === 'VNPAY') {
      setStep('vnpay');
      return;
    }
    
    await processOrder();
  };

  const processOrder = async () => {
>>>>>>> Stashed changes
    setLoading(true);
    try {
      await orderApi.create({
        address: form.address,
        paymentMethod: payment,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      });
      setSuccess(true);
      clearCart();
    } catch {
      setSuccess(true);
      clearCart();
    } finally {
      setLoading(false);
    }
  };

<<<<<<< Updated upstream
  if (success) {
=======
  // ==================== MÀN HÌNH ĐANG XỬ LÝ ====================
  if (step === 'processing') {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-primary-dark mb-2">Đang xử lý đơn hàng...</h2>
          <p className="text-gray-500">Vui lòng đợi trong giây lát, hệ thống đang đồng bộ giỏ hàng và tạo đơn.</p>
        </motion.div>
      </div>
    );
  }

  // ==================== MÀN HÌNH MÔ PHỎNG VNPAY ====================
  if (step === 'vnpay') {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center border-t-4 border-[#005BAA]">
          <h2 className="text-2xl font-extrabold text-[#005BAA] mb-2">Cổng giả lập VNPay</h2>
          <p className="text-gray-500 mb-6 text-sm">Quét mã QR dưới đây bằng App Ngân hàng</p>
          
          <div className="w-48 h-48 bg-white mx-auto flex items-center justify-center rounded-2xl mb-6 shadow-inner border-[3px] border-dashed border-[#005BAA]/30 relative overflow-hidden group hover:border-[#005BAA] transition-colors">
            <div className="absolute inset-0 bg-[#005BAA]/5 flex flex-col items-center justify-center">
                <svg className="w-12 h-12 text-[#005BAA] mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                <span className="text-[#005BAA] font-bold text-sm">QR CODE</span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <div className="flex justify-between text-sm mb-2"><span className="text-gray-500">Số tiền:</span><span className="font-bold text-lg text-secondary">{formatPrice(totalPrice)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Giao dịch:</span><span className="font-medium text-gray-700">Tự động</span></div>
          </div>

          <button onClick={processOrder} className="w-full bg-[#005BAA] text-white py-4 rounded-xl font-bold hover:bg-[#004a8b] transition-all duration-300 cursor-pointer shadow-lg shadow-[#005BAA]/30 transform active:scale-95">
            Xác nhận thanh toán (Mô phỏng)
          </button>
          <button onClick={() => setStep('form')} className="w-full mt-4 py-2 text-sm text-gray-400 hover:text-gray-700 font-medium transition-colors cursor-pointer">
            Hủy và chọn cách khác
          </button>
        </motion.div>
      </div>
    );
  }

  // ==================== MÀN HÌNH THÀNH CÔNG ====================
  if (step === 'success') {
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
                    <label className="block text-sm text-gray-500 mb-1">Địa chỉ giao hàng chi tiết *</label>
                    <input required minLength="10" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố..." className="input-field w-full" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Số điện thoại người nhận *</label>
                    <input required type="tel" pattern="^(0|84)[3|5|7|8|9][0-9]{8}$" title="Số điện thoại VN hợp lệ (10 số)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="VD: 0901234567" className="input-field w-full" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Ghi chú giao hàng</label>
                    <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })}
                      placeholder="Chỉ dẫn giao hàng, thời gian nhận mong muốn..." rows={3} className="input-field w-full resize-none" />
>>>>>>> Stashed changes
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
