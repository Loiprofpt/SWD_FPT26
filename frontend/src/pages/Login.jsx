import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        
        try {
            // Gọi API Login
            const response = await axios.post("https://localhost:7142/api/auth/login", {
                email,
                password
            });

            if (response.data.success) {
                const { token, role, fullName } = response.data.data;
                
                // Lưu Token và thông tin User vào LocalStorage
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify({ role, fullName, email }));

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
                setError(response.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Lỗi kết nối Server");
        }
    };

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const response = await axios.post("https://localhost:7142/api/auth/google-login", {
                IdToken: credentialResponse.credential
            });

            if (response.data.success) {
                const { token, role, fullName, email: userEmail } = response.data.data;
                
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify({ role, fullName, email: userEmail }));
                window.dispatchEvent(new Event("storage"));

                // Chuyển hướng
                if (role === "Admin") {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Lỗi đăng nhập Google");
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
                                <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                                <Link to="/forgot-password" style={{ fontSize: "14px", color: "#007bff" }} className="hover:underline">Quên mật khẩu?</Link>
                            </div>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required 
                                   className="input-field w-full" placeholder="••••••••" />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary w-full py-3 flex justify-center shadow-lg shadow-primary/30">
                        Đăng nhập
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