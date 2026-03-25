import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { productApi } from '../../api/productApi';
import { dashboardApi } from '../../api/dashboardApi';
import { orderApi } from '../../api/orderApi';
import { categoryApi } from '../../api/categoryApi';
import { brandApi } from '../../api/brandApi';

const TABS = ['Tổng quan', 'Đơn hàng', 'Sản phẩm', 'Danh mục', 'Thương hiệu'];

const STATUS_COLORS = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Shipping: 'bg-blue-100 text-blue-600',
  Done: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-600',
};

export default function Dashboard() {
  const [tab, setTab] = useState('Tổng quan');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
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

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('vi-VN') : '';

  useEffect(() => {
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
    }
  }, [tab]);

  const loadProducts = () => productApi.getAll().then((res) => { if (res.success) setProducts(res.data); }).catch(console.error);
  const loadCategories = () => categoryApi.getAll().then((res) => { if (res.success) setCategories(res.data); }).catch(console.error);
  const loadBrands = () => brandApi.getAll().then((res) => { if (res.success) setBrands(res.data); }).catch(console.error);

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

  return (
    <div className="pt-24 pb-16 min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-dark">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Quản lý cửa hàng STEM Shop</p>
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
                          <td className="px-6 py-4">
                            <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className={`text-xs font-semibold px-3 py-1.5 rounded-full border-none cursor-pointer ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                              <option value="Pending">Pending</option>
                              <option value="Shipping">Shipping</option>
                              <option value="Done">Done</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
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
              {showBrandModal && <SimpleModal title={editBrand ? 'Sửa thương hiệu' : 'Thêm thương hiệu'} item={editBrand}
                fields={[{ key: 'brandName', label: 'Tên thương hiệu', required: true }, { key: 'description', label: 'Mô tả' }]}
                onClose={() => setShowBrandModal(false)}
                onSave={async (data) => {
                  const res = editBrand ? await brandApi.update(editBrand.id, data) : await brandApi.create(data);
                  if (res.success) { setShowBrandModal(false); loadBrands(); } else { alert(res.message || 'Lỗi'); }
                }} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ===================== PRODUCT MODAL ===================== */
function ProductModal({ product, categories, brands, onClose, onSaved, loadSupportData }) {
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
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('price', form.price);
      if (form.description) fd.append('description', form.description);
      if (form.technicalSpecs) fd.append('technicalSpecs', form.technicalSpecs);
      if (form.ageRange) fd.append('ageRange', form.ageRange);
      if (form.stockQuantity) fd.append('stockQuantity', form.stockQuantity);
      if (form.categoryId) fd.append('categoryId', form.categoryId);
      if (form.brandId) fd.append('brandId', form.brandId);
      if (imageFile) fd.append('imageFile', imageFile);

      const res = product ? await productApi.update(product.id, fd) : await productApi.create(fd);
      if (res.success) { onSaved(); } else { alert(res.message || 'Lỗi lưu sản phẩm'); }
    } catch (error) { alert(error.message || 'Lỗi lưu sản phẩm'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-primary-dark mb-6">{product ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Tên sản phẩm *</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Giá (VNĐ) *</label>
              <input type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Tồn kho</label>
              <input type="number" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: +e.target.value })} className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Danh mục</label>
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="input-field cursor-pointer">
                <option value="">-- Chọn --</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.categoryName || c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Thương hiệu</label>
              <select value={form.brandId} onChange={(e) => setForm({ ...form, brandId: e.target.value })} className="input-field cursor-pointer">
                <option value="">-- Chọn --</option>
                {brands.map((b) => <option key={b.id} value={b.id}>{b.brandName || b.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Độ tuổi</label>
            <input value={form.ageRange} onChange={(e) => setForm({ ...form, ageRange: e.target.value })} placeholder="VD: 8-14" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Mô tả</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-field resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Thông số kỹ thuật</label>
            <input value={form.technicalSpecs} onChange={(e) => setForm({ ...form, technicalSpecs: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Hình ảnh</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0])} className="input-field text-sm" />
            {product?.imageUrl && !imageFile && <img src={product.imageUrl} alt="" className="mt-2 h-20 rounded-lg object-cover" />}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1 py-2.5 cursor-pointer">{saving ? 'Đang lưu...' : 'Lưu'}</button>
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 cursor-pointer">Hủy</button>
          </div>
        </form>
      </motion.div>
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
