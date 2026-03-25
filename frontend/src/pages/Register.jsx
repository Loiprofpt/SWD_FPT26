import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const data = await authApi.register(formData);

            if (data.success) {
                // alert("Đăng ký thành công! Vui lòng đăng nhập.");
                navigate("/login");
            } else {
                setError(data.message);
            }
        } catch (err) {
            const errMsg = typeof err === 'string' ? err : (err?.message || err?.title || "Lỗi hệ thống");
            setError(errMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl"
            >
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-primary-dark">
                        Tạo tài khoản
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Đăng ký để trải nghiệm mua sắm tốt nhất
                    </p>
                </div>
            
                {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm text-center border border-red-100">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required minLength="2"
                                   className="input-field w-full" placeholder="VD: Nguyễn Văn A" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required 
                                   pattern="^(0|84)[3|5|7|8|9][0-9]{8}$" title="Số điện thoại VN hợp lệ (10/11 số tùy định dạng chuẩn)" 
                                   className="input-field w-full" placeholder="VD: 0901234567" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required 
                                   className="input-field w-full" placeholder="name@example.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu *</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength="6"
                                   className="input-field w-full" placeholder="Ít nhất 6 ký tự" />
                        </div>
                    </div>

                    <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3 flex justify-center shadow-lg shadow-primary/30 disabled:opacity-50 cursor-pointer">
                        {isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
                    </button>

                    <div className="text-center text-sm">
                        <span className="text-gray-500">Đã có tài khoản? </span>
                        <Link to="/login" style={{ color: "#007bff" }} className="font-medium hover:underline">
                            Đăng nhập ngay
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Register;