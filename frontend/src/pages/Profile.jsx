import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axiosConfig';
import { orderApi } from '../api/orderApi';

const Profile = () => {
    const [searchParams] = useSearchParams();
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

    // State cho Lịch sử đơn hàng
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'orders' ? 'orders' : 'profile');
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';
    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('vi-VN', {
        year: 'numeric', month: '2-digit', day: '2-digit', 
        hour: '2-digit', minute: '2-digit'
    });

    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            const res = await orderApi.getMyOrders();
            if (res.success) {
                setOrders(res.data);
            }
        } catch (error) {
            console.error("Lỗi lấy đơn hàng:", error);
        } finally {
            setLoadingOrders(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'orders') {
            fetchOrders();
        }
    }, [activeTab]);

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return;
        try {
            const res = await orderApi.cancelMyOrder(orderId);
            if (res.success) {
                setMessage({ type: 'success', text: 'Hủy đơn hàng thành công!' });
                fetchOrders(); // tải lại danh sách
            } else {
                setMessage({ type: 'error', text: res.message || 'Lỗi khi hủy đơn' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Lỗi khi hủy đơn' });
        }
    };

    // Lấy token
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get("/users/profile");
                if (response.success) {
                    setProfile(response.data);
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
                    } catch { /* fallback */ }
                }
                if (error.status === 401) {
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
            const response = await api.put("/users/profile", {
                fullName: profile.fullName,
                phoneNumber: profile.phoneNumber
            });

            if (response.success) {
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
                setMessage({ type: 'error', text: response.message });
            }
        } catch {
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
            const response = await api.post("/auth/change-password", {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });

            if (response.success) {
                setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
                setShowPasswordModal(false);
                setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setMessage({ type: 'error', text: response.message });
            }
        } catch (error) {
            let errorMsg = 'Lỗi khi đổi mật khẩu.';
            
            // Trường hợp 1: Lỗi Logic từ Backend trả về (ví dụ: Sai mật khẩu cũ) -> { success: false, message: "..." }
            if (error.message) {
                errorMsg = error.message;
            } 
            // Trường hợp 2: Lỗi Validation từ .NET (ví dụ: Mật khẩu ngắn < 6 ký tự) -> { errors: { NewPassword: [...] } }
            else if (error.errors) {
                errorMsg = Object.values(error.errors).flat().join('\n');
            }
            
            setMessage({ type: 'error', text: errorMsg });
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
                    {/* Tabs */}
                    <div className="flex gap-6 border-b border-gray-100 mb-8">
                        <button 
                            className={`pb-4 text-lg font-bold transition-colors relative ${activeTab === 'profile' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                            onClick={() => { setActiveTab('profile'); setMessage({ type: '', text: '' }); }}
                        >
                            Thông tin cá nhân
                            {activeTab === 'profile' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                        </button>
                        <button 
                            className={`pb-4 text-lg font-bold transition-colors relative ${activeTab === 'orders' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                            onClick={() => { setActiveTab('orders'); setMessage({ type: '', text: '' }); }}
                        >
                            Lịch sử đơn hàng
                            {activeTab === 'orders' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                        </button>
                    </div>

                    {message.text && !showPasswordModal && (
                        <div className={`p-4 rounded-lg mb-6 text-sm text-center border ${message.type === 'error' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-green-50 text-green-500 border-green-100'}`}>
                            {message.text}
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
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
                                        className="btn-primary w-full py-3 flex justify-center shadow-lg shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
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
                        </motion.div>
                    )}

                    {activeTab === 'orders' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                            {loadingOrders ? (
                                <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                                    Đang tải đơn hàng...
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="p-8 text-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                                    <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                    {orders.map((order) => (
                                        <div key={order.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow bg-white">
                                            <div className="flex flex-wrap justify-between items-start gap-4 mb-4 pb-4 border-b border-gray-50">
                                                <div>
                                                    <span className="text-sm font-bold text-primary-dark">Đơn hàng #{order.id}</span>
                                                    <span className="text-xs text-gray-400 block mt-1">{formatDate(order.orderDate)}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                                        order.status === 'Pending' ? 'bg-warning/10 text-warning' :
                                                        order.status === 'Shipping' ? 'bg-blue-100 text-blue-600' :
                                                        order.status === 'Cancelled' ? 'bg-danger/10 text-danger' :
                                                        'bg-success/10 text-success'
                                                    }`}>
                                                        {order.status === 'Pending' ? 'Chờ xử lý' :
                                                         order.status === 'Shipping' ? 'Đang giao' :
                                                         order.status === 'Cancelled' ? 'Đã hủy' : 'Hoàn thành'}
                                                    </span>
                                                    {order.status === 'Pending' && (
                                                        <button 
                                                            onClick={() => handleCancelOrder(order.id)}
                                                            className="text-xs font-medium text-danger hover:underline cursor-pointer"
                                                        >
                                                            Hủy đơn
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-3 mb-4">
                                                {order.items?.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between items-center text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-xs">SP</div>
                                                            <div>
                                                                <p className="font-medium text-gray-800 truncate max-w-[200px] sm:max-w-xs">{item.productName}</p>
                                                                <p className="text-xs text-gray-400">SL: {item.quantity}</p>
                                                            </div>
                                                        </div>
                                                        <span className="font-medium text-gray-600">{formatPrice(item.price)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            <div className="pt-3 border-t border-gray-50 space-y-2">
                                                <div className="flex justify-between items-start text-sm">
                                                    <span className="text-gray-500">Giao đến:</span>
                                                    <span className="text-gray-700 text-right font-medium max-w-[250px]">{order.address}</span>
                                                </div>
                                                {order.phone && (
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-gray-500">SĐT:</span>
                                                        <span className="text-gray-700 font-medium">{order.phone}</span>
                                                    </div>
                                                )}
                                                {order.note && (
                                                    <div className="flex flex-col text-sm bg-gray-50 p-2 rounded-lg mt-1">
                                                        <span className="text-gray-400 text-xs uppercase font-bold mb-1">Ghi chú:</span>
                                                        <span className="text-gray-600 italic">"{order.note}"</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between items-center pt-2 border-t border-gray-50/50">
                                                    <span className="text-sm text-gray-500 font-bold">Tổng tiền:</span>
                                                    <span className="text-lg font-bold text-secondary">{formatPrice(order.totalAmount)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
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