import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
    const [profile, setProfile] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        role: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // State cho đổi mật khẩu
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    // Lấy token
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get("https://localhost:7142/api/users/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setProfile(response.data.data);
                }
            } catch (error) {
                // Fallback nếu API chưa sẵn sàng hoặc lỗi, lấy tạm từ localStorage để hiển thị
                const userStr = localStorage.getItem("user");
                if (userStr) {
                    try {
                        const localUser = JSON.parse(userStr);
                        setProfile(prev => ({
                            ...prev, 
                            fullName: localUser.fullName || '',
                            email: localUser.email || '',
                            role: localUser.role || ''
                        }));
                    } catch (e) {}
                }
                if (error.response?.status === 401) {
                    setMessage({ type: 'error', text: 'Phiên đăng nhập hết hạn.' });
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (token) fetchProfile();
        else setIsLoading(false);
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await axios.put("https://localhost:7142/api/users/profile", {
                fullName: profile.fullName,
                phoneNumber: profile.phoneNumber
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setMessage({ type: 'success', text: 'Cập nhật thành công!' });
                
                // Cập nhật lại LocalStorage để Header hiển thị tên mới ngay lập tức
                const userStr = localStorage.getItem("user");
                if (userStr) {
                    const userObj = JSON.parse(userStr);
                    userObj.fullName = profile.fullName;
                    localStorage.setItem("user", JSON.stringify(userObj));
                    window.dispatchEvent(new Event("storage"));
                }
            } else {
                setMessage({ type: 'error', text: response.data.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Lỗi khi cập nhật thông tin.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp!' });
            return;
        }

        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await axios.post("https://localhost:7142/api/auth/change-password", {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
                setShowPasswordModal(false);
                setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setMessage({ type: 'error', text: response.data.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Lỗi khi đổi mật khẩu.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="pt-32 text-center">Đang tải...</div>;

    return (
        <div className="pt-24 pb-16 min-h-screen bg-gray-50 flex justify-center">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl px-4"
            >
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-3xl font-bold text-primary-dark mb-6">Thông tin cá nhân</h2>
                    
                    {message.text && !showPasswordModal && (
                        <div className={`p-4 rounded-lg mb-6 text-sm text-center border ${message.type === 'error' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-green-50 text-green-500 border-green-100'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input 
                                    type="email" 
                                    value={profile.email || ''} 
                                    disabled 
                                    className="input-field w-full bg-gray-100 text-gray-500 cursor-not-allowed" 
                                />
                                <p className="text-xs text-gray-400 mt-1">* Email không thể thay đổi</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                                <input 
                                    type="text" 
                                    value={profile.role || ''} 
                                    disabled 
                                    className="input-field w-full bg-gray-100 text-gray-500 cursor-not-allowed" 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                            <input 
                                type="text" 
                                value={profile.fullName || ''} 
                                onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                                required
                                className="input-field w-full" 
                                placeholder="Nhập họ tên của bạn"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                            <input 
                                type="text" 
                                value={profile.phoneNumber || ''} 
                                onChange={(e) => setProfile({...profile, phoneNumber: e.target.value})}
                                className="input-field w-full" 
                                placeholder="Nhập số điện thoại"
                            />
                        </div>

                        <div className="pt-4">
                            <button 
                                type="submit" 
                                disabled={isSaving}
                                className="btn-primary w-full py-3 flex justify-center shadow-lg shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-8 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Bảo mật</h3>
                                <p className="text-sm text-gray-500">Đổi mật khẩu định kỳ để bảo vệ tài khoản</p>
                            </div>
                            <button 
                                onClick={() => {
                                    setShowPasswordModal(true);
                                    setMessage({ type: '', text: '' });
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                Đổi mật khẩu
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {showPasswordModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Đổi mật khẩu</h3>
                            
                            {message.text && (
                                <div className={`p-3 rounded-lg mb-4 text-sm text-center border ${message.type === 'error' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-green-50 text-green-500 border-green-100'}`}>
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                                    <input type="password" value={passwordData.oldPassword} onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})} required className="input-field w-full" placeholder="••••••••" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                                    <input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} required className="input-field w-full" placeholder="••••••••" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
                                    <input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} required className="input-field w-full" placeholder="••••••••" />
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button type="button" onClick={() => setShowPasswordModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">Hủy</button>
                                    <button type="submit" disabled={isSaving} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-70 cursor-pointer">{isSaving ? 'Đang xử lý...' : 'Xác nhận'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;