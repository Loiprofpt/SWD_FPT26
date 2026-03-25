import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { productApi } from '../../api/productApi';
import { dashboardApi } from '../../api/dashboardApi';
import { orderApi } from '../../api/orderApi';

const TABS = ['Tổng quan', 'Đơn hàng', 'Sản phẩm'];

const STATUS_COLORS = {
  Pending: 'bg-warning/10 text-warning',
  Shipping: 'bg-blue-100 text-blue-600',
  Done: 'bg-success/10 text-success',
  Cancelled: 'bg-danger/10 text-danger',
};

export default function Dashboard() {
  const [tab, setTab] = useState('Tổng quan');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState([
    { label: 'Doanh thu', value: '0đ', change: '', color: 'bg-blue-50 text-blue-600' },
    { label: 'Đơn hàng', value: '0', change: '', color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Sản phẩm', value: '0', change: '', color: 'bg-violet-50 text-violet-600' },
    { label: 'Khách hàng', value: '0', change: '', color: 'bg-amber-50 text-amber-600' },
  ]);

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('vi-VN') : '';

  useEffect(() => {
    if (tab === 'Tổng quan') {
      dashboardApi.getStats().then((data) => {
        setStats([
          { label: 'Doanh thu', value: formatPrice(data.totalRevenue || 0), change: '', color: 'bg-blue-50 text-blue-600' },
          { label: 'Đơn hàng', value: (data.totalOrders || 0).toString(), change: '', color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Sản phẩm', value: (data.totalProducts || 0).toString(), change: '', color: 'bg-violet-50 text-violet-600' },
          { label: 'Khách hàng', value: (data.totalUsers || 0).toString(), change: '', color: 'bg-amber-50 text-amber-600' },
        ]);
      }).catch(console.error);
      
      orderApi.getAll().then((res) => {
        if(res.success) setOrders(res.data.slice(0, 5));
      }).catch(console.error);
    } else if (tab === 'Đơn hàng') {
      orderApi.getAll().then((res) => {
        if(res.success) setOrders(res.data);
      }).catch(console.error);
    } else if (tab === 'Sản phẩm') {
      productApi.getAll().then((res) => {
        if(res.success) setProducts(res.data);
      }).catch(console.error);
    }
  }, [tab]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await orderApi.updateStatus(orderId, { status: newStatus });
      if (res.success) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      } else {
        alert(res.message || 'Lỗi cập nhật trạng thái');
      }
    } catch (error) {
      alert(error.message || 'Lỗi cập nhật trạng thái');
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-dark">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Quản lý cửa hàng STEM Shop</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm mb-8 w-fit">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                tab === t ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-primary'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'Tổng quan' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="card p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-primary-dark">{stat.value}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${stat.color}`}>
                        {stat.change}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="card overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="font-bold text-primary-dark">Đơn hàng gần đây</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">ID</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Khách hàng</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Tổng tiền</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Trạng thái</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Ngày</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-primary-dark">#{order.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">User #{order.userId}</td>
                          <td className="px-6 py-4 text-sm font-medium">{formatPrice(order.totalAmount)}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400">{formatDate(order.orderDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'Đơn hàng' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="card overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-primary-dark">Tất cả đơn hàng</h3>
                  <input placeholder="Tìm đơn hàng..." className="input-field w-64" />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">ID</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Khách hàng</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Tổng tiền</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Trạng thái</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Ngày</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-primary-dark">#{order.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">User #{order.userId}</td>
                          <td className="px-6 py-4 text-sm font-medium">{formatPrice(order.totalAmount)}</td>
                          <td className="px-6 py-4">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className={`text-xs font-semibold px-3 py-1 rounded-full border-none cursor-pointer ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Shipping">Shipping</option>
                              <option value="Done">Done</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400">{formatDate(order.orderDate)}</td>
                          <td className="px-6 py-4">
                            <button className="text-sm text-secondary hover:text-secondary-dark transition-colors cursor-pointer">
                              Chi tiết
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'Sản phẩm' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="card overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h3 className="font-bold text-primary-dark">Tất cả sản phẩm</h3>
                  <div className="flex gap-3">
                    <input placeholder="Tìm sản phẩm..." className="input-field w-48" />
                    <button className="btn-primary text-sm py-2 px-4 cursor-pointer">Thêm mới</button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">ID</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Tên SP</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Giá</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Tồn kho</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Danh mục</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-primary-dark">#{product.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 font-medium">{product.name}</td>
                          <td className="px-6 py-4 text-sm font-medium text-secondary">{formatPrice(product.price)}</td>
                          <td className="px-6 py-4">
                            <span className={`text-sm font-medium ${product.stockQuantity < 30 ? 'text-danger' : 'text-success'}`}>
                              {product.stockQuantity}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                              {product.categoryName}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-3">
                              <button className="text-sm text-secondary hover:text-secondary-dark transition-colors cursor-pointer">
                                Sửa
                              </button>
                              <button className="text-sm text-danger hover:text-red-700 transition-colors cursor-pointer">
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
