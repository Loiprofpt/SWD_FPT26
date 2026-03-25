import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { productApi } from '../../api/productApi';
import { dashboardApi } from '../../api/dashboardApi';
import { orderApi } from '../../api/orderApi';
import { categoryApi } from '../../api/categoryApi';
import { brandApi } from '../../api/brandApi';
import { warehouseApi } from '../../api/warehouseApi';

const TABS = ['Tổng quan', 'Đơn hàng', 'Sản phẩm', 'Danh mục', 'Thương hiệu', 'Kho hàng'];

const STATUS_COLORS = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-purple-100 text-purple-700',
  Shipping: 'bg-blue-100 text-blue-600',
  Done: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-600',
};

/* ===================== TOAST HOOK ===================== */
function useToast() {
  const [toasts, setToasts] = useState([]);
  const toast = useCallback((msg, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);
  return { toasts, toast };
}

function ToastContainer({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id}
            initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60 }}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-medium ${
              t.type === 'error' ? 'bg-red-500' : t.type === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
            }`}>
            <span>{t.type === 'error' ? '❌' : t.type === 'warning' ? '⚠️' : '✅'}</span>
            {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function Dashboard() {
  const [tab, setTab] = useState('Tổng quan');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState([
    { label: 'Doanh thu', value: '0đ', color: 'bg-blue-50 text-blue-600' },
    { label: 'Đơn hàng', value: '0', color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Sản phẩm', value: '0', color: 'bg-violet-50 text-violet-600' },
    { label: 'Khách hàng', value: '0', color: 'bg-amber-50 text-amber-600' },
  ]);
  const { toasts, toast } = useToast();

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
  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('vi-VN') : '';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (tab === 'Tổng quan') {
          const [data, ordRes] = await Promise.all([
            dashboardApi.getStats().catch(() => ({})),
            orderApi.getAll().catch(() => ({ success: false, data: [] }))
          ]);
          setStats([
            { label: 'Doanh thu', value: formatPrice(data.totalRevenue || 0), color: 'bg-blue-50 text-blue-600' },
            { label: 'Đơn hàng', value: (data.totalOrders || 0).toString(), color: 'bg-emerald-50 text-emerald-600' },
            { label: 'Sản phẩm', value: (data.totalProducts || 0).toString(), color: 'bg-violet-50 text-violet-600' },
            { label: 'Khách hàng', value: (data.totalUsers || 0).toString(), color: 'bg-amber-50 text-amber-600' },
          ]);
          if (ordRes.success) setOrders(ordRes.data.slice(0, 5));
        } else if (tab === 'Đơn hàng') {
          const res = await orderApi.getAll();
          if (res.success) setOrders(res.data);
        } else if (tab === 'Sản phẩm') {
          await loadProducts();
        } else if (tab === 'Danh mục') {
          await loadCategories();
        } else if (tab === 'Thương hiệu') {
          await loadBrands();
        } else if (tab === 'Kho hàng') {
          await loadWarehouses();
        }
      } catch (e) {
        toast('Không thể kết nối server. Vui lòng kiểm tra backend!', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tab]);

  const loadProducts = async () => { const res = await productApi.getAll(); if (res.success) setProducts(res.data); };
  const loadCategories = async () => { const res = await categoryApi.getAll(); if (res.success) setCategories(res.data); };
  const loadBrands = async () => { const res = await brandApi.getAll(); if (res.success) setBrands(res.data); };
  const loadWarehouses = async () => { const data = await warehouseApi.getAll(); setWarehouses(data || []); };
  const refreshTab = () => setTab(t => { return t; }); // force re-trigger useEffect
  const forceRefresh = useCallback(() => {
    const cur = tab;
    setTab('__temp');
    setTimeout(() => setTab(cur), 0);
  }, [tab]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await orderApi.updateStatus(orderId, { status: newStatus });
      if (res.success) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        toast(`Đơn #${orderId}: đổi trạng thái → ${newStatus}`, newStatus === 'Cancelled' ? 'warning' : 'success');
      } else { toast(res.message || 'Lỗi cập nhật', 'error'); }
    } catch (error) { toast(error.message || 'Lỗi cập nhật', 'error'); }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Xóa sản phẩm này?')) return;
    try {
      const res = await productApi.delete(id);
      if (res.success) { loadProducts(); toast('Xóa sản phẩm thành công!'); }
      else toast(res.message || 'Lỗi xóa', 'error');
    } catch (error) { toast(error.message || 'Lỗi xóa sản phẩm', 'error'); }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Xóa danh mục này?')) return;
    try {
      const res = await categoryApi.delete(id);
      if (res.success) { loadCategories(); toast('Xóa danh mục thành công!'); }
      else toast(res.message || 'Lỗi xóa', 'error');
    } catch (error) { toast(error.message || 'Lỗi xóa danh mục', 'error'); }
  };

  const handleDeleteBrand = async (id) => {
    if (!window.confirm('Xóa thương hiệu này?')) return;
    try {
      const res = await brandApi.delete(id);
      if (res.success) { loadBrands(); toast('Xóa thương hiệu thành công!'); }
      else toast(res.message || 'Lỗi xóa', 'error');
    } catch (error) { toast(error.message || 'Lỗi xóa thương hiệu', 'error'); }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
      const res = editCategory ? await categoryApi.update(editCategory.id, data) : await categoryApi.create(data);
      if (res.success) { setShowCategoryModal(false); loadCategories(); toast(editCategory ? 'Cập nhật danh mục thành công!' : 'Thêm danh mục thành công!'); }
      else toast(res.message || 'Lỗi lưu danh mục', 'error');
    } catch (error) { toast(error.message || 'Lỗi lưu danh mục', 'error'); }
    finally { setLoadingAction(false); }
  };

  const handleSaveBrand = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
      const res = editBrand ? await brandApi.update(editBrand.id, data) : await brandApi.create(data);
      if (res.success) { setShowBrandModal(false); loadBrands(); toast(editBrand ? 'Cập nhật thương hiệu thành công!' : 'Thêm thương hiệu thành công!'); }
      else toast(res.message || 'Lỗi lưu thương hiệu', 'error');
    } catch (error) { toast(error.message || 'Lỗi lưu thương hiệu', 'error'); }
    finally { setLoadingAction(false); }
  };

  const handleCreateWarehouse = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
      await warehouseApi.create(data);
      setShowWarehouseModal(false); loadWarehouses(); toast('Tạo kho hàng thành công! 🏭');
    } catch (error) { toast(error.message || 'Lỗi tạo kho', 'error'); }
    finally { setLoadingAction(false); }
  };

  const handleImportStock = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.quantity = parseInt(data.quantity);
    try {
      await warehouseApi.importStock(data);
      setShowImportModal(false); loadWarehouses(); loadProducts(); toast(`Nhập ${data.quantity} sản phẩm vào kho thành công! 📦`);
    } catch (error) { toast(error.message || 'Lỗi nhập hàng', 'error'); }
    finally { setLoadingAction(false); }
  };
  return (
    <div className="pt-24 pb-16 min-h-screen bg-surface">
      <ToastContainer toasts={toasts} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-primary-dark">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Quản lý cửa hàng STEM Shop</p>
          </div>
          <button onClick={forceRefresh} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow text-sm text-gray-500 hover:text-primary hover:shadow-md transition-all cursor-pointer">
            <span className={loading ? 'animate-spin' : ''}>&#8635;</span> Làm mới
          </button>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm mb-8 w-fit flex-wrap">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${tab === t ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-primary'}`}>
              {t}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center justify-center py-20 text-primary">
              <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {/* ========== TỔNG QUAN ========== */}
          {tab === 'Tổng quan' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, i) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card p-6">
                    <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-primary-dark">{stat.value}</p>
                  </motion.div>
                ))}
              </div>
              <div className="card overflow-hidden">
                <div className="p-6 border-b border-gray-100"><h3 className="font-bold text-primary-dark">Đơn hàng gần đây</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr className="bg-gray-50">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">ID</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Khách hàng</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Tổng tiền</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Trạng thái</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Ngày</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-50">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-primary-dark">#{order.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">User #{order.userId}</td>
                          <td className="px-6 py-4 text-sm font-medium">{formatPrice(order.totalAmount)}</td>
                          <td className="px-6 py-4"><span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status}</span></td>
                          <td className="px-6 py-4 text-sm text-gray-400">{formatDate(order.orderDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========== ĐƠN HÀNG ========== */}
          {tab === 'Đơn hàng' && (
            <motion.div key="orders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <div className="card overflow-hidden">
                <div className="p-6 border-b border-gray-100"><h3 className="font-bold text-primary-dark">Tất cả đơn hàng ({orders.length})</h3></div>
                <div className="divide-y divide-gray-50">
                  {orders.map((order) => (
                    <OrderRow key={order.id} order={order} onStatusChange={handleStatusChange} formatPrice={formatPrice} formatDate={formatDate} />
                  ))}
                  {orders.length === 0 && <div className="p-8 text-center text-gray-400">Chưa có đơn hàng nào.</div>}
                </div>
              </div>
            </motion.div>
          )}

          {/* ========== SẢN PHẨM ========== */}
          {tab === 'Sản phẩm' && (
            <motion.div key="products" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <div className="card overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-primary-dark">Sản phẩm ({products.length})</h3>
                  <button onClick={() => { setEditProduct(null); setShowProductModal(true); }} className="btn-primary text-sm py-2 px-4 cursor-pointer">+ Thêm mới</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr className="bg-gray-50">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">ID</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Tên SP</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Giá</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Tồn kho</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Danh mục</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Thao tác</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-50">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-primary-dark">#{p.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 font-medium">{p.name}</td>
                          <td className="px-6 py-4 text-sm font-medium text-secondary">{formatPrice(p.price)}</td>
                          <td className="px-6 py-4"><span className={`text-sm font-medium ${p.stockQuantity < 30 ? 'text-red-500' : 'text-green-600'}`}>{p.stockQuantity}</span></td>
                          <td className="px-6 py-4"><span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{p.categoryName || '—'}</span></td>
                          <td className="px-6 py-4">
                            <div className="flex gap-3">
                              <button onClick={() => { setEditProduct(p); setShowProductModal(true); }} className="text-sm text-secondary hover:text-secondary-dark cursor-pointer">Sửa</button>
                              <button onClick={() => handleDeleteProduct(p.id)} className="text-sm text-red-500 hover:text-red-700 cursor-pointer">Xóa</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {showProductModal && <ProductModal product={editProduct} categories={categories.length ? categories : []} brands={brands.length ? brands : []}
                onClose={() => setShowProductModal(false)} onSaved={() => { setShowProductModal(false); loadProducts(); }}
                loadSupportData={() => { if (!categories.length) loadCategories(); if (!brands.length) loadBrands(); }} />}
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
              {showCategoryModal && <SimpleModal title={editCategory ? 'Sửa danh mục' : 'Thêm danh mục'} item={editCategory}
                fields={[{ key: 'categoryName', label: 'Tên danh mục', required: true }, { key: 'description', label: 'Mô tả' }]}
                onClose={() => setShowCategoryModal(false)}
                onSave={async (data) => {
                  const res = editCategory ? await categoryApi.update(editCategory.id, data) : await categoryApi.create(data);
                  if (res.success) { setShowCategoryModal(false); loadCategories(); } else { alert(res.message || 'Lỗi'); }
                }} />}
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
                  {warehouses.length === 0 && (
                    <div className="col-span-2 py-16 text-center text-gray-400">
                      <div className="text-4xl mb-3">🏭</div>
                      <p className="font-medium">Chưa có kho hàng nào</p>
                      <p className="text-sm mt-1">Bấm "+ Thêm Kho" để tạo kho đầu tiên.</p>
                    </div>
                  )}
                </div>
              </div>
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
/* ===================== PRODUCT MODAL (wrapper) ===================== */
function ProductModal({ product, categories, brands, onClose, onSaved, loadSupportData }) {
  const [loadingAction, setLoadingAction] = useState(false);
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-primary-dark mb-6">{product ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
        <ProductModalContent product={product} categories={categories} brands={brands}
          onClose={onClose} onSaved={onSaved} loadSupportData={loadSupportData}
          loadingAction={loadingAction} setLoadingAction={setLoadingAction} />
      </motion.div>
    </div>
  );
}

/* ===================== ORDER ROW (Expandable) ===================== */
function OrderRow({ order, onStatusChange, formatPrice, formatDate }) {
  const [expanded, setExpanded] = useState(false);

  const STATUS_COLORS_LOCAL = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Confirmed: 'bg-purple-100 text-purple-700',
    Shipping: 'bg-blue-100 text-blue-600',
    Done: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-600',
  };

  return (
    <div className={`transition-colors ${expanded ? 'bg-gray-50/80' : 'hover:bg-gray-50/50'}`}>
      <div className="flex items-center gap-4 px-6 py-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <span className="text-xs text-gray-400 w-4">{expanded ? '▼' : '▶'}</span>
        <span className="text-sm font-bold text-primary-dark w-16">#{order.id}</span>
        <span className="text-sm text-gray-600 w-28">User #{order.userId}</span>
        <span className="text-sm font-medium text-secondary flex-1">{formatPrice(order.totalAmount)}</span>
        <span className="text-sm text-gray-500 w-24 hidden sm:block truncate" title={order.address}>{order.address || '—'}</span>
        <select value={order.status}
          onChange={(e) => { e.stopPropagation(); onStatusChange(order.id, e.target.value); }}
          onClick={(e) => e.stopPropagation()}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full border-none cursor-pointer ${STATUS_COLORS_LOCAL[order.status] || 'bg-gray-100 text-gray-600'}`}>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Shipping">Shipping</option>
          <option value="Done">Done</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <span className="text-xs text-gray-400 w-24 text-right hidden md:block">{formatDate(order.orderDate)}</span>
      </div>
      {expanded && (
        <div className="px-6 pb-4 pl-16">
          {order.items && order.items.length > 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50/80">
                  <th className="text-left px-4 py-2 text-xs text-gray-400 font-medium">Sản phẩm</th>
                  <th className="text-center px-4 py-2 text-xs text-gray-400 font-medium">SL</th>
                  <th className="text-right px-4 py-2 text-xs text-gray-400 font-medium">Đơn giá</th>
                  <th className="text-right px-4 py-2 text-xs text-gray-400 font-medium">Thành tiền</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2 font-medium text-gray-700">{item.productName}</td>
                      <td className="px-4 py-2 text-center text-gray-500">{item.quantity}</td>
                      <td className="px-4 py-2 text-right text-gray-500">{formatPrice(item.price)}</td>
                      <td className="px-4 py-2 text-right font-medium text-secondary">{formatPrice(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">Không có dữ liệu chi tiết đơn hàng.</p>
          )}
        </div>
      )}
    </div>
  );
}
