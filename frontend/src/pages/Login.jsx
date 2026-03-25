import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import api from '../api/axiosConfig';
import useAuthStore from '../store/useAuthStore';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const loginStore = useAuthStore(state => state.login);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);
        
        try {
            // Gọi API Login thông qua authApi (đã intercept trả về data)
            const data = await authApi.login(email, password);

            if (data.success) {
                const { token, role, fullName } = data.data;
                const userObj = { role, fullName, email };
                
                // Lưu Token và thông tin User vào LocalStorage
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(userObj));
                loginStore(userObj, token);

                // Dispatch event để các component khác (nếu có lắng nghe) cập nhật state
                window.dispatchEvent(new Event("storage"));
                
                // alert("Đăng nhập thành công!"); // Có thể bỏ alert cho mượt
                
                // Chuyển hướng dựa trên Role
                if (role === "Admin") {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            } else {
                setError(data.message);
            }
        } catch (err) {
            const errMsg = err?.message || (typeof err === 'string' ? err : "Lỗi kết nối Server");
            setError(errMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const data = await api.post("/auth/google-login", {
                IdToken: credentialResponse.credential
            });

            if (data.success) {
                const { token, role, fullName, email: userEmail } = data.data;
                const userObj = { role, fullName, email: userEmail };
                
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(userObj));
                loginStore(userObj, token);
                window.dispatchEvent(new Event("storage"));

                // Chuyển hướng
                if (role === "Admin") {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError(err.message || "Lỗi đăng nhập Google");
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
                        Đăng nhập
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Chào mừng bạn quay trở lại với STEM Shop
                    </p>
                </div>
                
                {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm text-center border border-red-100">
                        {error}
                    </div>
                )}
            
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required 
                                   className="input-field w-full" placeholder="name@example.com" />
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="block text-sm font-medium text-gray-700">Mật khẩu *</label>
                                <Link to="/forgot-password" style={{ fontSize: "14px", color: "#007bff" }} className="hover:underline">Quên mật khẩu?</Link>
                            </div>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6"
                                   className="input-field w-full" placeholder="••••••••" />
                        </div>
                    </div>

                    <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3 flex justify-center shadow-lg shadow-primary/30 disabled:opacity-50 cursor-pointer">
                        {isSubmitting ? 'Đang xác thực...' : 'Đăng nhập'}
                    </button>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Hoặc tiếp tục với</span>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleLogin}
                            onError={() => {
                                setError("Đăng nhập Google thất bại");
                            }}
                        />
                    </div>

                    <div className="text-center text-sm">
                        <span className="text-gray-500">Chưa có tài khoản? </span>
                        <Link to="/register" style={{ color: "#007bff" }} className="font-medium hover:underline">
                            Đăng ký ngay
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;