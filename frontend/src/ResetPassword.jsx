import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Lấy token và email từ URL (do Backend gửi qua link)
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Thay đổi PORT này theo port thực tế của Backend bạn (ví dụ 5000, 5123, 7000...)
    const API_URL = "https://localhost:7142/api/auth/reset-password"; 

    useEffect(() => {
        if (!token || !email) {
            setIsError(true);
            setMessage("Đường dẫn không hợp lệ hoặc bị thiếu thông tin.");
        }
    }, [token, email]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setIsError(true);
            setMessage("Mật khẩu nhập lại không khớp!");
            return;
        }

        if (newPassword.length < 6) {
            setIsError(true);
            setMessage("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }

        setIsLoading(true); // Bắt đầu loading
        try {
            const response = await axios.post(API_URL, {
                email: email,
                token: token,
                newPassword: newPassword
            });

            if (response.data.success) {
                setIsError(false);
                setMessage("Đổi mật khẩu thành công! Đang chuyển hướng về trang đăng nhập...");
                setTimeout(() => {
                    navigate("/login"); // Chuyển hướng về trang Login
                }, 2000);
            } else {
                setIsError(true);
                setMessage(response.data.message || "Có lỗi xảy ra.");
            }
        } catch (error) {
            setIsError(true);
            setMessage(error.response?.data?.message || "Lỗi kết nối đến Server.");
        } finally {
            setIsLoading(false); // Kết thúc loading
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
                        Đặt lại mật khẩu
                    </h2>
                </div>
            
                {message && (
                    <div className={`p-4 rounded-lg text-sm text-center border ${isError ? 'bg-red-50 text-red-500 border-red-100' : 'bg-green-50 text-green-500 border-green-100'}`}>
                        {message}
                    </div>
                )}
            
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required 
                                   className="input-field w-full" placeholder="••••••••" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nhập lại mật khẩu</label>
                            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required 
                                   className="input-field w-full" placeholder="••••••••" />
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="btn-primary w-full py-3 flex justify-center shadow-lg shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed">
                        {isLoading ? "Đang xử lý..." : "Xác nhận"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ResetPassword;