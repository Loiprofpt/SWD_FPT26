import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Đảm bảo PORT này khớp với Backend (7142)
    const API_URL = "https://localhost:7142/api/auth/forgot-password";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        try {
            const response = await axios.post(API_URL, { email });
            if (response.data.success) {
                setIsError(false);
                setMessage("Email hướng dẫn đã được gửi. Vui lòng kiểm tra hộp thư!");
            } else {
                setIsError(true);
                setMessage(response.data.message || "Không thể gửi yêu cầu.");
            }
        } catch (error) {
            setIsError(true);
            setMessage(error.response?.data?.message || "Lỗi kết nối đến Server.");
        } finally {
            setIsLoading(false);
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
                        Quên mật khẩu
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Nhập email của bạn để nhận liên kết đặt lại mật khẩu
                    </p>
                </div>
            
                {message && (
                    <div className={`p-4 rounded-lg text-sm text-center border ${isError ? 'bg-red-50 text-red-500 border-red-100' : 'bg-green-50 text-green-500 border-green-100'}`}>
                        {message}
                    </div>
                )}
            
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                            type="email" value={email} onChange={(e) => setEmail(e.target.value)} required 
                            className="input-field w-full" placeholder="name@example.com" 
                        />
                    </div>
                    
                    <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 flex justify-center shadow-lg shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed">
                        {isLoading ? "Đang gửi..." : "Gửi yêu cầu"}
                    </button>

                    <div className="text-center text-sm">
                        <Link to="/login" style={{ color: "#007bff" }} className="font-medium hover:underline">Quay lại đăng nhập</Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;