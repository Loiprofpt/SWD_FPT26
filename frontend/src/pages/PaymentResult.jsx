import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  
  useEffect(() => {
    // VNPay trả về vnp_ResponseCode (00 là thành công)
    // Momo trả về resultCode (0 là thành công)
    const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
    const resultCode = searchParams.get('resultCode');
    const generalStatus = searchParams.get('status');

    // Giả lập thời gian verify cho mượt UX (tuỳ chọn, thực tế gọi API lên BE để verify chữ ký)
    const timer = setTimeout(() => {
      if (vnp_ResponseCode) {
        setStatus(vnp_ResponseCode === '00' ? 'success' : 'error');
      } else if (resultCode) {
        setStatus(resultCode === '0' ? 'success' : 'error');
      } else if (generalStatus) {
        setStatus(generalStatus === 'success' ? 'success' : 'error');
      } else {
        setStatus('error'); // Không có mã trả về thì coi như lỗi
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [searchParams]);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center border border-gray-100"
      >
        {status === 'loading' && (
          <div className="py-8">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800">Đang xử lý...</h2>
            <p className="text-gray-500 mt-2">Vui lòng đợi trong giây lát để xác nhận giao dịch.</p>
          </div>
        )}

        {status === 'success' && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 15 }}>
            <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Thanh toán thành công!</h2>
            <p className="text-gray-500 mb-8">Cảm ơn bạn đã mua sắm tại STEM Shop. Đơn hàng của bạn đã được ghi nhận và đang được xử lý.</p>
            <div className="space-y-3">
              <Link to="/profile" className="btn-primary block w-full py-3.5 text-center font-semibold text-lg shadow-lg shadow-primary/30">
                Xem đơn hàng
              </Link>
              <Link to="/" className="block w-full py-3 text-gray-500 font-medium hover:bg-gray-50 rounded-xl transition-colors">
                Quay về trang chủ
              </Link>
            </div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 15 }}>
            <div className="w-24 h-24 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Giao dịch thất bại</h2>
            <p className="text-gray-500 mb-8">Đã có lỗi xảy ra trong quá trình thanh toán hoặc giao dịch này đã bị hủy bỏ bởi bạn.</p>
            <div className="space-y-3">
              <Link to="/checkout" className="block w-full py-3.5 bg-gray-900 text-white rounded-xl text-center font-semibold text-lg hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20">
                Thử thanh toán lại
              </Link>
              <Link to="/" className="block w-full py-3 text-gray-500 font-medium hover:bg-gray-50 rounded-xl transition-colors">
                Quay về trang chủ
              </Link>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
