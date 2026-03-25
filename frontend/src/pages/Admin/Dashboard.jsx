import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { productApi } from '../../api/productApi';
<<<<<<< Updated upstream

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

const TABS = ['Tổng quan', 'Đơn hàng', 'Sản phẩm'];
=======
import { dashboardApi } from '../../api/dashboardApi';
import { orderApi } from '../../api/orderApi';
import { categoryApi } from '../../api/categoryApi';
import { brandApi } from '../../api/brandApi';
import { warehouseApi } from '../../api/warehouseApi';

const TABS = ['Tổng quan', 'Đơn hàng', 'Sản phẩm', 'Danh mục', 'Thương hiệu', 'Kho hàng'];
>>>>>>> Stashed changes

const STATUS_COLORS = {
  Pending: 'bg-warning/10 text-warning',
  Shipping: 'bg-blue-100 text-blue-600',
  Done: 'bg-success/10 text-success',
};

export default function Dashboard() {
  const [tab, setTab] = useState('Tổng quan');
  const [products, setProducts] = useState([]);
<<<<<<< Updated upstream
=======
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [stats, setStats] = useState([
    { label: 'Doanh thu', value: '0đ', color: 'bg-blue-50 text-blue-600' },
    { label: 'Đơn hàng', value: '0', color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Sản phẩm', value: '0', color: 'bg-violet-50 text-violet-600' },
    { label: 'Khách hàng', value: '0', color: 'bg-amber-50 text-amber-600' },
  ]);

  // Modal states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [editBrand, setEditBrand] = useState(null);
  const [showWarehouseModal, setShowWarehouseModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

>>>>>>> Stashed changes
  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';

  useEffect(() => {
<<<<<<< Updated upstream
    if (tab === 'Sản phẩm') {
      productApi.getAll().then((res) => {
        if (res?.success) setProducts(res.data);
      });
    }
  }, [tab]);

=======
    if (tab === 'Tổng quan') {
      dashboardApi.getStats().then((data) => {
        setStats([
          { label: 'Doanh thu', value: formatPrice(data.totalRevenue || 0), color: 'bg-blue-50 text-blue-600' },
          { label: 'Đơn hàng', value: (data.totalOrders || 0).toString(), color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Sản phẩm', value: (data.totalProducts || 0).toString(), color: 'bg-violet-50 text-violet-600' },
          { label: 'Khách hàng', value: (data.totalUsers || 0).toString(), color: 'bg-amber-50 text-amber-600' },
        ]);
      }).catch(console.error);
      orderApi.getAll().then((res) => { if (res.success) setOrders(res.data.slice(0, 5)); }).catch(console.error);
    } else if (tab === 'Đơn hàng') {
      orderApi.getAll().then((res) => { if (res.success) setOrders(res.data); }).catch(console.error);
    } else if (tab === 'Sản phẩm') {
      loadProducts();
    } else if (tab === 'Danh mục') {
      loadCategories();
    } else if (tab === 'Thương hiệu') {
      loadBrands();
    } else if (tab === 'Kho hàng') {
      loadWarehouses();
    }
  }, [tab]);

  const loadProducts = () => { productApi.getAll().then((res) => { if (res.success) setProducts(res.data); }).catch(console.error); };
  const loadCategories = () => { categoryApi.getAll().then((res) => { if (res.success) setCategories(res.data); }).catch(console.error); };
  const loadBrands = () => { brandApi.getAll().then((res) => { if (res.success) setBrands(res.data); }).catch(console.error); };
  const loadWarehouses = () => { warehouseApi.getAll().then((data) => setWarehouses(data || [])).catch(console.error); };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await orderApi.updateStatus(orderId, { status: newStatus });
      if (res.success) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      } else { alert(res.message || 'Lỗi cập nhật'); }
    } catch (error) { alert(error.message || 'Lỗi cập nhật'); }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Xóa sản phẩm này?')) return;
    try {
      const res = await productApi.delete(id);
      if (res.success) loadProducts();
      else alert(res.message || 'Lỗi xóa');
    } catch (error) { alert(error.message || 'Lỗi xóa sản phẩm'); }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Xóa danh mục này?')) return;
    try {
      const res = await categoryApi.delete(id);
      if (res.success) loadCategories();
      else alert(res.message || 'Lỗi xóa');
    } catch (error) { alert(error.message || 'Lỗi xóa danh mục'); }
  };

  const handleDeleteBrand = async (id) => {
    if (!window.confirm('Xóa thương hiệu này?')) return;
    try {
      const res = await brandApi.delete(id);
      if (res.success) loadBrands();
      else alert(res.message || 'Lỗi xóa');
    } catch (error) { alert(error.message || 'Lỗi xóa thương hiệu'); }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
      const res = editCategory ? await categoryApi.update(editCategory.id, data) : await categoryApi.create(data);
      if (res.success) { setShowCategoryModal(false); loadCategories(); } else { alert(res.message || 'Lỗi lưu danh mục'); }
    } catch (error) { alert(error.message || 'Lỗi lưu danh mục'); }
    finally { setLoadingAction(false); }
  };

  const handleSaveBrand = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
      const res = editBrand ? await brandApi.update(editBrand.id, data) : await brandApi.create(data);
      if (res.success) { setShowBrandModal(false); loadBrands(); } else { alert(res.message || 'Lỗi lưu thương hiệu'); }
    } catch (error) { alert(error.message || 'Lỗi lưu thương hiệu'); }
    finally { setLoadingAction(false); }
  };

  const handleCreateWarehouse = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
      const res = await warehouseApi.create(data);
      if (res.success) { setShowWarehouseModal(false); loadWarehouses(); } else { alert(res.message || 'Lỗi tạo kho'); }
    } catch (error) { alert(error.message || 'Lỗi tạo kho'); }
    finally { setLoadingAction(false); }
  };

  const handleImportStock = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.quantity = parseInt(data.quantity); // Ensure quantity is a number
    try {
      const res = await warehouseApi.importStock(data);
      if (res.success) { setShowImportModal(false); loadWarehouses(); loadProducts(); } else { alert(res.message || 'Lỗi nhập hàng'); }
    } catch (error) { alert(error.message || 'Lỗi nhập hàng'); }
    finally { setLoadingAction(false); }
  };

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
            </motion.div>
          )}

          {/* ========== DANH MỤC ========== */}
          {tab === 'Danh mục' && (
            <motion.div key="categories" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <div className="card overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-primary-dark">Danh mục ({categories.length})</h3>
                  <button onClick={() => { setEditCategory(null); setShowCategoryModal(true); }} className="btn-primary text-sm py-2 px-4 cursor-pointer">+ Thêm mới</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr className="bg-gray-50">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">ID</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Tên danh mục</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Mô tả</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Thao tác</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-50">
                      {categories.map((c) => (
                        <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-primary-dark">#{c.id}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-700">{c.categoryName || c.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{c.description || '—'}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-3">
                              <button onClick={() => { setEditCategory(c); setShowCategoryModal(true); }} className="text-sm text-secondary hover:text-secondary-dark cursor-pointer">Sửa</button>
                              <button onClick={() => handleDeleteCategory(c.id)} className="text-sm text-red-500 hover:text-red-700 cursor-pointer">Xóa</button>
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

          {/* ========== THƯƠNG HIỆU ========== */}
          {tab === 'Thương hiệu' && (
            <motion.div key="brands" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <div className="card overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-primary-dark">Thương hiệu ({brands.length})</h3>
                  <button onClick={() => { setEditBrand(null); setShowBrandModal(true); }} className="btn-primary text-sm py-2 px-4 cursor-pointer">+ Thêm mới</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr className="bg-gray-50">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">ID</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Tên thương hiệu</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Mô tả</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Thao tác</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-50">
                      {brands.map((b) => (
                        <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-primary-dark">#{b.id}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-700">{b.brandName || b.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{b.description || '—'}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-3">
                              <button onClick={() => { setEditBrand(b); setShowBrandModal(true); }} className="text-sm text-secondary hover:text-secondary-dark cursor-pointer">Sửa</button>
                              <button onClick={() => handleDeleteBrand(b.id)} className="text-sm text-red-500 hover:text-red-700 cursor-pointer">Xóa</button>
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

          {/* ------------- TAB KHO HÀNG ------------- */}
          {tab === 'Kho hàng' && (
            <motion.div key="warehouses" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <div className="card p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-primary-dark">Quản lý Kho</h3>
                  <div className="flex gap-3">
                    <button onClick={() => setShowWarehouseModal(true)} className="btn-primary text-sm py-2 px-4 cursor-pointer">
                      + Thêm Kho
                    </button>
                    <button onClick={() => { loadProducts(); setShowImportModal(true); }} className="px-4 py-2 bg-secondary text-white rounded-xl text-sm font-semibold hover:bg-secondary/90 transition-colors shadow-lg shadow-secondary/30 cursor-pointer">
                      📦 Nhập hàng
                    </button>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {warehouses.map((w) => (
                    <div key={w.id} className="border border-gray-100 rounded-xl p-5 hover:border-primary/30 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-gray-800 text-lg">{w.warehouseName}</h4>
                          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                            📍 {w.location}
                          </p>
                        </div>
                        <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                          {w.warehouseStocks?.length || 0} mã sản phẩm
                        </span>
                      </div>
                      {w.warehouseStocks?.length > 0 ? (
                        <div className="space-y-2 mt-4 pt-4 border-t border-gray-50 max-h-48 overflow-y-auto pr-2">
                          {w.warehouseStocks.map((ws, i) => (
                            <div key={i} className="flex justify-between text-sm items-center bg-gray-50 px-3 py-2 rounded-lg">
                              <span className="text-gray-700 truncate mr-2" title={ws.product?.name}>
                                {ws.product?.name || `Product #${ws.productId}`}
                              </span>
                              <span className="font-bold text-secondary bg-white px-2 py-1 rounded shadow-sm border border-gray-100">
                                Tồn: {ws.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-4 pt-4 border-t border-gray-50 text-center text-sm text-gray-400 py-4">
                          Kho đang trống
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
>>>>>>> Stashed changes
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ===================== MODALS ===================== */}

      {/* 1. PRODUCT MODAL */}
      <AnimatePresence>
        {showProductModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4" onClick={() => setShowProductModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-primary-dark mb-6">{editProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
              <ProductModalContent product={editProduct} categories={categories} brands={brands}
                onClose={() => setShowProductModal(false)} onSaved={() => { setShowProductModal(false); loadProducts(); }}
                loadSupportData={() => { if (!categories.length) loadCategories(); if (!brands.length) loadBrands(); }}
                loadingAction={loadingAction} setLoadingAction={setLoadingAction} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. CATEGORY MODAL */}
      <AnimatePresence>
        {showCategoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-800">{editCategory ? 'Sửa Danh mục' : 'Thêm Danh mục'}</h3>
                <button type="button" onClick={() => setShowCategoryModal(false)} className="text-gray-400 hover:text-danger cursor-pointer text-xl">×</button>
              </div>
              <form onSubmit={handleSaveCategory} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục *</label>
                    <input name="categoryName" defaultValue={editCategory?.categoryName || editCategory?.name} required className="input-field w-full" placeholder="VD: Robot" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                    <textarea name="description" defaultValue={editCategory?.description} className="input-field w-full resize-none" rows="3" placeholder="Mô tả danh mục..." />
                  </div>
                </div>
                <button type="submit" disabled={loadingAction} className="btn-primary w-full mt-6 py-3 cursor-pointer disabled:opacity-50">
                  {loadingAction ? 'Đang lưu...' : 'Lưu lại'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. BRAND MODAL */}
      <AnimatePresence>
        {showBrandModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-800">{editBrand ? 'Sửa Thương hiệu' : 'Thêm Thương hiệu'}</h3>
                <button type="button" onClick={() => setShowBrandModal(false)} className="text-gray-400 hover:text-danger cursor-pointer text-xl">×</button>
              </div>
              <form onSubmit={handleSaveBrand} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên thương hiệu *</label>
                    <input name="brandName" defaultValue={editBrand?.brandName || editBrand?.name} required className="input-field w-full" placeholder="VD: LEGO" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                    <textarea name="description" defaultValue={editBrand?.description} className="input-field w-full resize-none" rows="3" placeholder="Mô tả thương hiệu..." />
                  </div>
                </div>
                <button type="submit" disabled={loadingAction} className="btn-primary w-full mt-6 py-3 cursor-pointer disabled:opacity-50">
                  {loadingAction ? 'Đang lưu...' : 'Lưu lại'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. CREATE WAREHOUSE MODAL */}
      <AnimatePresence>
        {showWarehouseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-800">Thêm Kho Hàng Mới</h3>
                <button type="button" onClick={() => setShowWarehouseModal(false)} className="text-gray-400 hover:text-danger cursor-pointer text-xl">×</button>
              </div>
              <form onSubmit={handleCreateWarehouse} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên kho *</label>
                    <input name="warehouseName" required minLength="3" className="input-field w-full" placeholder="VD: Kho Tổng Quận 1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vị trí / Địa chỉ *</label>
                    <input name="location" required minLength="5" className="input-field w-full" placeholder="VD: 123 Lê Lợi, Q1, TP.HCM" />
                  </div>
                </div>
                <button type="submit" disabled={loadingAction} className="btn-primary w-full mt-6 py-3 cursor-pointer disabled:opacity-50">
                  {loadingAction ? 'Đang tạo...' : 'Tạo kho'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. IMPORT STOCK MODAL */}
      <AnimatePresence>
        {showImportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-secondary/10">
                <h3 className="font-bold text-secondary-dark">📦 Nhập hàng vào kho</h3>
                <button type="button" onClick={() => setShowImportModal(false)} className="text-gray-400 hover:text-danger cursor-pointer text-xl">×</button>
              </div>
              <form onSubmit={handleImportStock} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chọn Kho *</label>
                    <select name="warehouseId" required className="input-field w-full bg-white">
                      <option value="">-- Chọn kho nhập --</option>
                      {warehouses.map(w => <option key={w.id} value={w.id}>{w.warehouseName}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chọn Sản phẩm *</label>
                    <select name="productId" required className="input-field w-full bg-white">
                      <option value="">-- Chọn sản phẩm --</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name} (Tồn tổng: {p.stockQuantity})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng nhập *</label>
                    <input type="number" name="quantity" required min="1" max="10000" className="input-field w-full" placeholder="VD: 100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                    <textarea name="remarks" className="input-field w-full resize-none" rows="2" placeholder="VD: Nhập lô hàng tháng 11..." />
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100">
                  ℹ️ Lưu ý: Số lượng nhập sẽ động cộng dồn vào tồn kho tổng của sản phẩm và ghi nhận vào lịch sử kho.
                </div>
                <button type="submit" disabled={loadingAction} className="w-full mt-6 py-3 bg-secondary text-white rounded-xl hover:bg-secondary-dark font-semibold shadow-lg shadow-secondary/30 disabled:opacity-50 transition-colors cursor-pointer">
                  {loadingAction ? 'Đang xử lý...' : 'Xác nhận nhập kho'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
<<<<<<< Updated upstream
=======

/* ===================== PRODUCT MODAL CONTENT ===================== */
function ProductModalContent({ product, categories, brands, onClose, onSaved, loadSupportData, loadingAction, setLoadingAction }) {
  const [form, setForm] = useState({
    name: product?.name || '', description: product?.description || '',
    technicalSpecs: product?.technicalSpecs || '', ageRange: product?.ageRange || '',
    price: product?.price || 0, stockQuantity: product?.stockQuantity || 0,
    categoryId: product?.categoryId || '', brandId: product?.brandId || '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadSupportData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (imageFile) data.append('imageFile', imageFile);

    try {
      const res = product ? await productApi.update(product.id, data) : await productApi.create(data);
      if (res.success) onSaved();
      else alert(res.message || 'Lỗi lưu sản phẩm');
    } catch (err) { alert(err.message || 'Lỗi lưu sản phẩm'); }
    finally { setLoadingAction(false); }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Tên sản phẩm *</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field w-full" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Giá (VNĐ) *</label>
            <input type="number" required min="1000" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} className="input-field w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Tồn kho</label>
            <input type="number" min="0" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: +e.target.value })} className="input-field w-full" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Danh mục *</label>
            <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="input-field w-full cursor-pointer">
              <option value="">-- Chọn --</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.categoryName || c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Thương hiệu *</label>
            <select required value={form.brandId} onChange={(e) => setForm({ ...form, brandId: e.target.value })} className="input-field w-full cursor-pointer">
              <option value="">-- Chọn --</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.brandName || b.name}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Độ tuổi</label>
          <input value={form.ageRange} onChange={(e) => setForm({ ...form, ageRange: e.target.value })} placeholder="VD: 8-14" className="input-field w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Mô tả</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-field w-full resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Thông số kỹ thuật</label>
          <input value={form.technicalSpecs} onChange={(e) => setForm({ ...form, technicalSpecs: e.target.value })} className="input-field w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Hình ảnh {product ? '' : '*'}</label>
          <input type="file" required={!product} accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0])} className="input-field w-full text-sm" />
          {product?.imageUrl && !imageFile && <img src={product.imageUrl} alt="" className="mt-2 h-20 rounded-lg object-cover" />}
        </div>
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 cursor-pointer">Hủy</button>
          <button type="submit" disabled={loadingAction} className="btn-primary flex-1 py-3 cursor-pointer disabled:opacity-50">
            {loadingAction ? 'Đang lưu...' : 'Lưu sản phẩm'}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ===================== SIMPLE MODAL (Category / Brand) ===================== */
function SimpleModal({ title, item, fields, onClose, onSave }) {
  const [form, setForm] = useState(() => {
    const initial = {};
    fields.forEach(f => { initial[f.key] = item?.[f.key] || ''; });
    return initial;
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try { await onSave(form); }
    catch (error) { alert(error.message || 'Lỗi'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-primary-dark mb-6">{title}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-600 mb-1">{f.label} {f.required && '*'}</label>
              <input required={f.required} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="input-field" />
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1 py-2.5 cursor-pointer">{saving ? 'Đang lưu...' : 'Lưu'}</button>
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 cursor-pointer">Hủy</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
>>>>>>> Stashed changes
