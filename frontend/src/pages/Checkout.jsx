import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import { orderApi } from '../api/orderApi';
import api from '../api/axiosConfig';

const PAYMENT_METHODS = [
  { id: 'COD', label: 'Thanh toán khi nhận hàng (COD)', desc: 'Trả tiền mặt khi nhận hàng', icon: '💵' },
  { id: 'VNPay', label: 'VNPay', desc: 'Thanh toán qua cổng VNPay (QR / ATM / Visa)', icon: '💳' },
  { id: 'ATM', label: 'Chuyển khoản ngân hàng', desc: 'Chuyển khoản qua ATM/Internet Banking', icon: '🏦' },
  { id: 'Momo', label: 'Ví Momo', desc: 'Thanh toán qua ví điện tử Momo', icon: '📱' },
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
  const [orderResult, setOrderResult] = useState(null); // Lưu kết quả đơn hàng
  const [step, setStep] = useState('form'); // 'form' | 'processing' | 'success' | 'error' | 'vnpay'
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login'); return; }
    if (items.length === 0) return;

    if (payment === 'VNPay') {
      setStep('vnpay');
      return;
    }
    
    await processOrder();
  };

  const processOrder = async () => {
    setLoading(true);
    setStep('processing');
    setErrorMsg('');

    try {
      // ===== BƯỚC 1: Xóa giỏ hàng cũ trên Backend =====
      await api.delete('/carts').catch(() => {});

      // ===== BƯỚC 2: Đồng bộ từng sản phẩm lên giỏ hàng Backend (tuần tự để tránh race condition) =====
      for (const item of items) {
          await api.post('/carts/items', { productId: item.id, quantity: item.quantity });
      }

      // ===== BƯỚC 3: Tạo đơn hàng từ giỏ hàng Backend =====
      const response = await orderApi.create({ 
        address: form.address,
        phone: form.phone,
        note: form.note
      });

      if (response && response.success) {
        // Đặt hàng thành công — xóa giỏ hàng FE + chuyển màn hình success
        clearCart();
        setOrderResult(response.data);
        setStep('success');
      } else {
        setErrorMsg(response?.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
        setStep('error');
      }
    } catch (error) {
      setErrorMsg(error?.message || 'Có lỗi xảy ra trong quá trình xử lý đơn hàng.');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

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
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <h2 className="text-3xl font-bold text-primary-dark mb-2">Đặt hàng thành công!</h2>
          {orderResult && (
            <div className="bg-gray-50 rounded-xl p-4 mb-4 text-left">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Mã đơn hàng:</span>
                <span className="font-bold text-primary-dark">#{orderResult.id}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Tổng tiền:</span>
                <span className="font-bold text-secondary">{formatPrice(orderResult.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Trạng thái:</span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">Chờ xử lý</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Địa chỉ:</span>
                <span className="text-gray-700 text-right max-w-[200px]">{orderResult.address}</span>
              </div>
            </div>
          )}
          <p className="text-gray-500 mb-6 text-sm">
            Đơn hàng của bạn đã được ghi nhận và đang chờ Admin xác nhận.
            Bạn có thể theo dõi trạng thái đơn hàng trong <strong>Lịch sử mua hàng</strong>.
          </p>
          <div className="space-y-3">
            <Link to="/profile" className="btn-primary block w-full py-3 text-center font-semibold shadow-lg shadow-primary/30">
              Xem lịch sử đơn hàng
            </Link>
            <button onClick={() => navigate('/')} className="block w-full py-3 text-gray-500 font-medium hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
              Về trang chủ
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ==================== MÀN HÌNH LỖI ====================
  if (step === 'error') {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md mx-auto">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Đặt hàng thất bại</h2>
          <p className="text-gray-500 mb-6">{errorMsg}</p>
          <div className="space-y-3">
            <button onClick={() => setStep('form')} className="btn-primary w-full py-3 cursor-pointer">Thử lại</button>
            <button onClick={() => navigate('/cart')} className="w-full py-3 text-gray-500 font-medium hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
              Quay lại giỏ hàng
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ==================== TRANG GIỎ TRỐNG ====================
  if (items.length === 0) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-400 mb-4">Giỏ hàng trống</h2>
          <button onClick={() => navigate('/products')} className="btn-primary cursor-pointer">Tiếp tục mua sắm</button>
        </div>
      </div>
    );
  }

  // ==================== FORM CHECKOUT ====================
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-dark mb-8">Thanh toán</h1>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Info */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
                <h3 className="text-lg font-bold text-primary-dark mb-4">Thông tin giao hàng</h3>
                <div className="space-y-4">
                  <div>
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
                  </div>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
                <h3 className="text-lg font-bold text-primary-dark mb-4">Phương thức thanh toán</h3>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((method) => (
                    <label key={method.id}
                      className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                        payment === method.id ? 'border-secondary bg-secondary/5 shadow-sm' : 'border-gray-100 hover:border-gray-200'
                      }`}>
                      <input type="radio" name="payment" value={method.id} checked={payment === method.id}
                        onChange={(e) => setPayment(e.target.value)} className="mt-1 accent-secondary" />
                      <div className="flex-1">
                        <div className="font-semibold text-primary-dark">{method.icon} {method.label}</div>
                        <div className="text-sm text-gray-400">{method.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
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
                    <span className="text-green-600 font-medium">Miễn phí</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="font-bold text-primary-dark">Tổng cộng</span>
                    <span className="text-xl font-bold text-secondary">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base font-semibold shadow-lg shadow-primary/30 cursor-pointer">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    '🛒 Xác nhận đặt hàng'
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
