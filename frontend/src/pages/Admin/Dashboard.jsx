import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_STATS = [
  { label: 'Doanh thu', value: '25.600.000đ', change: '+12%', color: 'bg-blue-50 text-blue-600' },
  { label: 'Đơn hàng', value: '156', change: '+8%', color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Sản phẩm', value: '342', change: '+5', color: 'bg-violet-50 text-violet-600' },
  { label: 'Khách hàng', value: '1.204', change: '+23', color: 'bg-amber-50 text-amber-600' },
];

const MOCK_ORDERS = [
  { id: 1, customer: 'Nguyen Van A', total: 750000, status: 'Pending', date: '2026-03-20' },
  { id: 2, customer: 'Tran Thi B', total: 1250000, status: 'Shipping', date: '2026-03-19' },
  { id: 3, customer: 'Le Van C', total: 450000, status: 'Done', date: '2026-03-18' },
  { id: 4, customer: 'Pham Thi D', total: 8500000, status: 'Pending', date: '2026-03-18' },
  { id: 5, customer: 'Hoang Van E', total: 350000, status: 'Done', date: '2026-03-17' },
];

const MOCK_PRODUCTS = [
  { id: 1, name: 'Arduino Uno R3', price: 250000, stock: 100, category: 'Linh kiện' },
  { id: 2, name: 'Raspberry Pi 4', price: 1500000, stock: 50, category: 'Linh kiện' },
  { id: 3, name: 'LEGO Mindstorms EV3', price: 8500000, stock: 20, category: 'Robot' },
  { id: 4, name: 'Kit Robot Car 4WD', price: 450000, stock: 75, category: 'Robot' },
  { id: 5, name: 'Sensor Kit 37 in 1', price: 350000, stock: 200, category: 'Kit học tập' },
  { id: 6, name: 'Breadboard Kit', price: 120000, stock: 300, category: 'Linh kiện' },
];

const TABS = ['Tổng quan', 'Đơn hàng', 'Sản phẩm'];

const STATUS_COLORS = {
  Pending: 'bg-warning/10 text-warning',
  Shipping: 'bg-blue-100 text-blue-600',
  Done: 'bg-success/10 text-success',
};

export default function Dashboard() {
  const [tab, setTab] = useState('Tổng quan');
  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';

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
                {MOCK_STATS.map((stat, i) => (
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
                      {MOCK_ORDERS.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-primary-dark">#{order.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                          <td className="px-6 py-4 text-sm font-medium">{formatPrice(order.total)}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400">{order.date}</td>
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
                      {MOCK_ORDERS.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-primary-dark">#{order.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                          <td className="px-6 py-4 text-sm font-medium">{formatPrice(order.total)}</td>
                          <td className="px-6 py-4">
                            <select
                              defaultValue={order.status}
                              className="text-xs font-semibold px-3 py-1 rounded-full border-none cursor-pointer bg-gray-100"
                            >
                              <option>Pending</option>
                              <option>Shipping</option>
                              <option>Done</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400">{order.date}</td>
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
                    <button className="btn-primary text-sm py-2 px-4">Thêm mới</button>
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
                      {MOCK_PRODUCTS.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-primary-dark">#{product.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 font-medium">{product.name}</td>
                          <td className="px-6 py-4 text-sm font-medium text-secondary">{formatPrice(product.price)}</td>
                          <td className="px-6 py-4">
                            <span className={`text-sm font-medium ${product.stock < 30 ? 'text-danger' : 'text-success'}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                              {product.category}
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
