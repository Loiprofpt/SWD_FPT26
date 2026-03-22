import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';
import { authApi } from '../api/authApi';

export default function Register() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', phoneNumber: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    if (form.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        phoneNumber: form.phoneNumber,
      });
      if (res?.success) {
        login(res.data, res.data.token);
        navigate('/');
      } else {
        setError(res?.message || 'Đăng ký thất bại');
      }
    } catch (err) {
      setError(err?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Visual */}
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-secondary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 -right-20 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-float-delayed" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 text-center max-w-md"
        >
          <div className="w-32 h-32 mx-auto mb-8 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20">
            <span className="text-6xl font-bold text-white/80">S</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Tham gia cùng chúng tôi</h2>
          <p className="text-white/60">
            Tạo tài khoản để nhận ưu đãi độc quyền và theo dõi đơn hàng dễ dàng.
          </p>
        </motion.div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-primary">
              STEM<span className="text-secondary">Shop</span>
            </span>
          </Link>

          <h1 className="text-3xl font-bold text-primary-dark mb-2">Tạo tài khoản</h1>
          <p className="text-gray-400 mb-8">Đăng ký để bắt đầu mua sắm</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-danger/10 text-danger text-sm p-4 rounded-xl mb-6"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Họ tên</label>
              <input
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="Nguyen Van A"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@example.com"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Số điện thoại</label>
              <input
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                placeholder="0912 345 678"
                className="input-field"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Mật khẩu</label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Ít nhất 6 ký tự"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Xác nhận</label>
                <input
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Nhập lại mật khẩu"
                  className="input-field"
                />
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Đăng ký'
              )}
            </motion.button>
          </form>

          <p className="text-center text-gray-400 mt-8">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-secondary font-semibold hover:text-secondary-dark transition-colors">
              Đăng nhập
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
