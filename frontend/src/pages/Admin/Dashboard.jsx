import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Mock Data ───────────────────────────────────────────────────────────────
const STATS = [
  {
    label: 'Doanh thu tháng',
    value: 25600000,
    display: '25,6M',
    unit: 'đ',
    change: +12.4,
    chart: [40, 55, 42, 70, 60, 80, 75, 90, 85, 100, 92, 110],
    gradient: 'from-blue-500 to-cyan-400',
    bg: 'from-blue-50 to-cyan-50',
    dot: 'bg-blue-500',
  },
  {
    label: 'Tổng đơn hàng',
    value: 156,
    display: '156',
    unit: ' đơn',
    change: +8.1,
    chart: [20, 30, 25, 40, 38, 55, 48, 60, 58, 72, 68, 80],
    gradient: 'from-emerald-500 to-teal-400',
    bg: 'from-emerald-50 to-teal-50',
    dot: 'bg-emerald-500',
  },
  {
    label: 'Sản phẩm',
    value: 342,
    display: '342',
    unit: ' sp',
    change: +5,
    chart: [100, 120, 115, 130, 128, 140, 135, 150, 148, 160, 158, 170],
    gradient: 'from-violet-500 to-purple-400',
    bg: 'from-violet-50 to-purple-50',
    dot: 'bg-violet-500',
  },
  {
    label: 'Khách hàng',
    value: 1204,
    display: '1.204',
    unit: ' KH',
    change: +23,
    chart: [300, 450, 400, 550, 500, 620, 580, 700, 680, 820, 800, 950],
    gradient: 'from-orange-500 to-amber-400',
    bg: 'from-orange-50 to-amber-50',
    dot: 'bg-orange-500',
  },
];

const REVENUE_BARS = [
  { month: 'T1', value: 12 }, { month: 'T2', value: 18 },
  { month: 'T3', value: 15 }, { month: 'T4', value: 22 },
  { month: 'T5', value: 19 }, { month: 'T6', value: 28 },
  { month: 'T7', value: 24 }, { month: 'T8', value: 32 },
  { month: 'T9', value: 29 }, { month: 'T10', value: 38 },
  { month: 'T11', value: 35 }, { month: 'T12', value: 45 },
];

const ORDERS = [
  { id: 1001, customer: 'Nguyễn Văn An', email: 'an.nv@gmail.com', total: 750000, status: 'Pending', date: '20/03/2026', items: 2 },
  { id: 1002, customer: 'Trần Thị Bình', email: 'binh.tt@gmail.com', total: 1250000, status: 'Shipping', date: '19/03/2026', items: 3 },
  { id: 1003, customer: 'Lê Văn Cường', email: 'cuong.lv@gmail.com', total: 450000, status: 'Done', date: '18/03/2026', items: 1 },
  { id: 1004, customer: 'Phạm Thị Dung', email: 'dung.pt@gmail.com', total: 8500000, status: 'Pending', date: '18/03/2026', items: 5 },
  { id: 1005, customer: 'Hoàng Văn Em', email: 'em.hv@gmail.com', total: 350000, status: 'Done', date: '17/03/2026', items: 1 },
  { id: 1006, customer: 'Vũ Thị Hoa', email: 'hoa.vt@gmail.com', total: 2100000, status: 'Shipping', date: '17/03/2026', items: 4 },
  { id: 1007, customer: 'Đặng Minh Khoa', email: 'khoa.dm@gmail.com', total: 680000, status: 'Cancelled', date: '16/03/2026', items: 2 },
];

const PRODUCTS = [
  { id: 1, name: 'Arduino Uno R3', price: 250000, stock: 100, category: 'Linh kiện', brand: 'Arduino', sold: 45 },
  { id: 2, name: 'Raspberry Pi 4 Model B', price: 1500000, stock: 50, category: 'Linh kiện', brand: 'Raspberry', sold: 32 },
  { id: 3, name: 'LEGO Mindstorms EV3', price: 8500000, stock: 20, category: 'Robot', brand: 'LEGO', sold: 12 },
  { id: 4, name: 'Kit Robot Car 4WD', price: 450000, stock: 75, category: 'Robot', brand: 'Generic', sold: 67 },
  { id: 5, name: 'Sensor Kit 37 in 1', price: 350000, stock: 200, category: 'Kit học tập', brand: 'Generic', sold: 120 },
  { id: 6, name: 'Breadboard Kit 830 lỗ', price: 120000, stock: 300, category: 'Linh kiện', brand: 'Generic', sold: 180 },
  { id: 7, name: 'LCD 16x2 I2C', price: 85000, stock: 150, category: 'Linh kiện', brand: 'Generic', sold: 95 },
  { id: 8, name: 'Mô hình Hệ Mặt Trời', price: 320000, stock: 18, category: 'Khoa học', brand: 'EduSmart', sold: 8 },
];

const USERS = [
  { id: 1, name: 'Nguyễn Văn An', email: 'an.nv@gmail.com', role: 'Customer', joined: '01/01/2026', orders: 8, spent: 5400000 },
  { id: 2, name: 'Trần Thị Bình', email: 'binh.tt@gmail.com', role: 'Customer', joined: '15/01/2026', orders: 5, spent: 3200000 },
  { id: 3, name: 'Admin System', email: 'admin@stemshop.vn', role: 'Admin', joined: '01/01/2025', orders: 0, spent: 0 },
  { id: 4, name: 'Lê Văn Cường', email: 'cuong.lv@gmail.com', role: 'Customer', joined: '20/02/2026', orders: 3, spent: 1800000 },
  { id: 5, name: 'Phạm Thị Dung', email: 'dung.pt@gmail.com', role: 'Customer', joined: '05/03/2026', orders: 12, spent: 9700000 },
];

// ─── Sidebar config ──────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { key: 'overview', label: 'Tổng quan', dot: 'bg-secondary' },
  { key: 'orders', label: 'Đơn hàng', dot: 'bg-warning', badge: 3 },
  { key: 'products', label: 'Sản phẩm', dot: 'bg-accent' },
  { key: 'users', label: 'Khách hàng', dot: 'bg-violet-500' },
  { key: 'categories', label: 'Danh mục', dot: 'bg-pink-400' },
];

const STATUS_MAP = {
  Pending:   { label: 'Chờ xử lý', cls: 'bg-warning/15 text-warning' },
  Shipping:  { label: 'Đang giao',  cls: 'bg-blue-100 text-blue-600' },
  Done:      { label: 'Hoàn thành', cls: 'bg-success/15 text-success' },
  Cancelled: { label: 'Đã hủy',     cls: 'bg-danger/10 text-danger' },
};

const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + 'đ';

// ─── Mini sparkline ──────────────────────────────────────────────────────────
function Sparkline({ data, gradient }) {
  const max = Math.max(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (v / max) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 100 50" className="w-full h-12" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sg-${gradient}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopOpacity="0.3" stopColor="currentColor" />
          <stop offset="100%" stopOpacity="0" stopColor="currentColor" />
        </linearGradient>
      </defs>
      <polyline
        points={pts}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-80"
      />
    </svg>
  );
}

// ─── Stat card ───────────────────────────────────────────────────────────────
function StatCard({ stat, index }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = stat.value;
    const duration = 1200;
    const step = (end / duration) * 16;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [stat.value]);

  const formattedCount = stat.label === 'Doanh thu tháng'
    ? (count / 1000000).toFixed(1) + 'M'
    : count.toLocaleString('vi-VN');

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className={`relative overflow-hidden bg-gradient-to-br ${stat.bg} rounded-2xl p-5 border border-white/60 shadow-sm hover:shadow-md transition-shadow duration-300`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
          <p className="text-2xl font-bold text-primary-dark mt-1">
            {formattedCount}
            <span className="text-sm font-normal text-gray-400 ml-1">{stat.unit}</span>
          </p>
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-xl ${stat.change > 0 ? 'bg-success/15 text-success' : 'bg-danger/10 text-danger'}`}>
          <span>{stat.change > 0 ? '↑' : '↓'}</span>
          <span>{Math.abs(stat.change)}%</span>
        </div>
      </div>

      {/* Sparkline */}
      <div className={`bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
        <Sparkline data={stat.chart} gradient={stat.gradient} />
      </div>

      <p className="text-xs text-gray-400 mt-1">So với tháng trước</p>

      {/* Decorative blob */}
      <div className={`absolute -bottom-4 -right-4 w-20 h-20 rounded-full ${stat.dot} opacity-8`} />
    </motion.div>
  );
}

// ─── Revenue bar chart ───────────────────────────────────────────────────────
function RevenueChart() {
  const max = Math.max(...REVENUE_BARS.map((r) => r.value));
  const currentMonth = 11; // December (0-indexed)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-primary-dark">Doanh thu theo tháng</h3>
          <p className="text-xs text-gray-400 mt-0.5">Năm 2026 — đơn vị: triệu đồng</p>
        </div>
        <div className="flex gap-2">
          {['2025', '2026'].map((y, i) => (
            <button key={y} className={`text-xs px-3 py-1 rounded-lg font-medium cursor-pointer transition-all ${i === 1 ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-100'}`}>
              {y}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-end gap-2 h-40">
        {REVENUE_BARS.map((bar, i) => {
          const height = (bar.value / max) * 100;
          const isCurrent = i === currentMonth;
          return (
            <div key={bar.month} className="flex-1 flex flex-col items-center gap-1 group">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: 0.3 + i * 0.04, duration: 0.6, ease: 'easeOut' }}
                className={`w-full rounded-t-lg relative ${isCurrent
                  ? 'bg-gradient-to-t from-primary to-secondary'
                  : 'bg-gradient-to-t from-gray-200 to-gray-100 group-hover:from-secondary/40 group-hover:to-secondary/20'
                } transition-colors duration-300 cursor-pointer`}
              >
                {/* Tooltip */}
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-primary-dark text-white text-xs px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {bar.value}M
                </div>
              </motion.div>
              <span className={`text-xs font-medium ${isCurrent ? 'text-primary' : 'text-gray-400'}`}>
                {bar.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Overview tab ────────────────────────────────────────────────────────────
function OverviewTab() {
  const topProducts = [...PRODUCTS].sort((a, b) => b.sold - a.sold).slice(0, 5);
  const pendingOrders = ORDERS.filter((o) => o.status === 'Pending');

  return (
    <motion.div key="overview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}>
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {STATS.map((s, i) => <StatCard key={s.label} stat={s} index={i} />)}
      </div>

      <div className="grid lg:grid-cols-5 gap-6 mb-6">
        {/* Revenue chart */}
        <div className="lg:col-span-3">
          <RevenueChart />
        </div>

        {/* Top products */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-primary-dark mb-4">Top sản phẩm bán chạy</h3>
          <div className="space-y-3">
            {topProducts.map((p, i) => {
              const maxSold = topProducts[0].sold;
              const pct = Math.round((p.sold / maxSold) * 100);
              return (
                <div key={p.id}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${i === 0 ? 'bg-warning' : i === 1 ? 'bg-gray-400' : 'bg-orange-300'}`}>
                        {i + 1}
                      </span>
                      <span className="text-sm text-gray-700 truncate max-w-[140px]">{p.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-500">{p.sold} đã bán</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.5 + i * 0.08, duration: 0.6 }}
                      className={`h-full rounded-full ${i === 0 ? 'bg-gradient-to-r from-warning to-orange-400' : 'bg-gradient-to-r from-secondary to-accent'}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pending orders + order status summary */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pending table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="font-bold text-primary-dark">Đơn hàng chờ xử lý</h3>
            <span className="text-xs bg-warning/15 text-warning font-semibold px-2 py-1 rounded-lg">{pendingOrders.length} đơn</span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {['Mã đơn', 'Khách hàng', 'Tổng tiền', 'Thao tác'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pendingOrders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-bold text-primary">#{o.id}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-gray-700">{o.customer}</p>
                    <p className="text-xs text-gray-400">{o.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-secondary">{formatPrice(o.total)}</td>
                  <td className="px-5 py-3.5">
                    <button className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg cursor-pointer hover:bg-primary-light transition-colors">Xử lý</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order status donut */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-primary-dark mb-4">Trạng thái đơn hàng</h3>
          {Object.entries(STATUS_MAP).map(([key, { label, cls }]) => {
            const count = ORDERS.filter((o) => o.status === key).length;
            const pct = Math.round((count / ORDERS.length) * 100);
            return (
              <div key={key} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>
                  <span className="text-xs text-gray-500">{count} ({pct}%)</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.4, duration: 0.7 }}
                    className={`h-full rounded-full ${
                      key === 'Done' ? 'bg-success' :
                      key === 'Shipping' ? 'bg-blue-400' :
                      key === 'Pending' ? 'bg-warning' : 'bg-danger'
                    }`}
                  />
                </div>
              </div>
            );
          })}

          {/* Quick stats */}
          <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-success/8 rounded-xl">
              <p className="text-xl font-bold text-success">{ORDERS.filter(o => o.status === 'Done').length}</p>
              <p className="text-xs text-gray-400">Hoàn thành</p>
            </div>
            <div className="text-center p-3 bg-warning/8 rounded-xl">
              <p className="text-xl font-bold text-warning">{ORDERS.filter(o => o.status === 'Pending').length}</p>
              <p className="text-xs text-gray-400">Chờ xử lý</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Orders tab ──────────────────────────────────────────────────────────────
function OrdersTab() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orders, setOrders] = useState(ORDERS);

  const filtered = orders.filter((o) => {
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) || String(o.id).includes(search);
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id, status) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
  };

  return (
    <motion.div key="orders" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, mã đơn..."
            className="input-field flex-1 text-sm"
          />
          <div className="flex gap-2 flex-wrap">
            {[['all', 'Tất cả'], ['Pending', 'Chờ xử lý'], ['Shipping', 'Đang giao'], ['Done', 'Hoàn thành'], ['Cancelled', 'Đã hủy']].map(([v, l]) => (
              <button
                key={v}
                onClick={() => setStatusFilter(v)}
                className={`text-xs px-3 py-2 rounded-xl font-medium cursor-pointer transition-all ${statusFilter === v ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Mã đơn', 'Khách hàng', 'Số SP', 'Tổng tiền', 'Trạng thái', 'Ngày đặt', 'Thao tác'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence>
                {filtered.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="px-5 py-4 text-sm font-bold text-primary">#{order.id}</td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-700">{order.customer}</p>
                      <p className="text-xs text-gray-400">{order.email}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-center text-gray-600">{order.items}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-secondary">{formatPrice(order.total)}</td>
                    <td className="px-5 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl cursor-pointer border-none outline-none ${STATUS_MAP[order.status]?.cls}`}
                      >
                        {Object.entries(STATUS_MAP).map(([k, { label }]) => (
                          <option key={k} value={k}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">{order.date}</td>
                    <td className="px-5 py-4">
                      <button className="text-xs text-secondary hover:text-secondary-dark font-semibold cursor-pointer transition-colors">
                        Chi tiết
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">Không tìm thấy đơn hàng nào</div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
          <p className="text-xs text-gray-400">Hiển thị {filtered.length}/{ORDERS.length} đơn hàng</p>
          <div className="flex gap-1">
            {[1, 2, 3].map((p) => (
              <button key={p} className={`w-7 h-7 text-xs rounded-lg cursor-pointer ${p === 1 ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-200'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Products tab ────────────────────────────────────────────────────────────
function ProductsTab() {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState(PRODUCTS);
  const [showModal, setShowModal] = useState(false);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const deleteProduct = (id) => setProducts((prev) => prev.filter((p) => p.id !== id));

  return (
    <motion.div key="products" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm sản phẩm, danh mục..."
            className="input-field text-sm w-full sm:w-72"
          />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowModal(true)}
            className="btn-primary text-sm py-2.5 px-5 whitespace-nowrap"
          >
            + Thêm sản phẩm
          </motion.button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['SP', 'Tên sản phẩm', 'Giá', 'Đã bán', 'Tồn kho', 'Danh mục', 'Thao tác'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence>
                {filtered.map((product, i) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30" />
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-gray-700">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.brand}</p>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-secondary">{formatPrice(product.price)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-secondary to-accent rounded-full"
                            style={{ width: `${Math.min((product.sold / 200) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{product.sold}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-sm font-semibold ${product.stock < 25 ? 'text-danger' : product.stock < 60 ? 'text-warning' : 'text-success'}`}>
                        {product.stock}
                      </span>
                      {product.stock < 25 && <span className="ml-1 text-xs text-danger/70">Sắp hết</span>}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg font-medium">{product.category}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-3">
                        <button className="text-xs text-secondary hover:text-secondary-dark font-semibold cursor-pointer transition-colors">Sửa</button>
                        <button onClick={() => deleteProduct(product.id)} className="text-xs text-danger hover:text-red-700 font-semibold cursor-pointer transition-colors">Xóa</button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">Không tìm thấy sản phẩm</div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
          <p className="text-xs text-gray-400">Hiển thị {filtered.length}/{PRODUCTS.length} sản phẩm</p>
        </div>
      </div>

      {/* Add product modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-primary-dark mb-5">Thêm sản phẩm mới</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Tên sản phẩm</label>
                  <input className="input-field text-sm" placeholder="Nhập tên sản phẩm..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Giá (đ)</label>
                    <input className="input-field text-sm" type="number" placeholder="0" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Tồn kho</label>
                    <input className="input-field text-sm" type="number" placeholder="0" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Danh mục</label>
                    <select className="input-field text-sm">
                      <option>Linh kiện</option>
                      <option>Robot</option>
                      <option>Kit học tập</option>
                      <option>Khoa học</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Thương hiệu</label>
                    <input className="input-field text-sm" placeholder="Thương hiệu..." />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Mô tả</label>
                  <textarea className="input-field text-sm h-20 resize-none" placeholder="Mô tả sản phẩm..." />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">
                  Hủy
                </button>
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-semibold cursor-pointer hover:shadow-lg transition-all">
                  Lưu sản phẩm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Users tab ───────────────────────────────────────────────────────────────
function UsersTab() {
  const [search, setSearch] = useState('');
  const filtered = USERS.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div key="users" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex gap-3 items-center justify-between">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm khách hàng..." className="input-field text-sm w-72" />
          <span className="text-xs text-gray-400">{USERS.length} tài khoản</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Khách hàng', 'Vai trò', 'Đơn hàng', 'Tổng chi tiêu', 'Ngày tham gia', 'Thao tác'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${user.role === 'Admin' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-gray-600 text-center">{user.orders}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-secondary">{user.spent > 0 ? formatPrice(user.spent) : '—'}</td>
                  <td className="px-5 py-4 text-xs text-gray-400">{user.joined}</td>
                  <td className="px-5 py-4">
                    <button className="text-xs text-secondary hover:text-secondary-dark font-semibold cursor-pointer transition-colors">Xem</button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Categories tab ──────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 1, name: 'Linh kiện điện tử', products: 45, description: 'Arduino, cảm biến, module...' },
  { id: 2, name: 'Robot & Lập trình', products: 32, description: 'Kit robot, coding toys...' },
  { id: 3, name: 'Kit học tập', products: 28, description: 'Bộ kit thí nghiệm, học tập...' },
  { id: 4, name: 'Khoa học thực nghiệm', products: 19, description: 'Dụng cụ thí nghiệm khoa học...' },
  { id: 5, name: 'Toán học tư duy', products: 24, description: 'Khối hình, puzzle, tư duy...' },
];

function CategoriesTab() {
  return (
    <motion.div key="categories" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <div className="w-5 h-5 rounded bg-gradient-to-br from-primary/40 to-secondary/40" />
              </div>
              <span className="text-xs bg-secondary/10 text-secondary font-semibold px-2 py-1 rounded-lg">{cat.products} SP</span>
            </div>
            <h4 className="font-bold text-primary-dark text-sm mb-1">{cat.name}</h4>
            <p className="text-xs text-gray-400 mb-4">{cat.description}</p>
            <div className="flex gap-2">
              <button className="text-xs text-secondary hover:text-secondary-dark font-semibold cursor-pointer transition-colors">Sửa</button>
              <span className="text-gray-200">|</span>
              <button className="text-xs text-danger hover:text-red-700 font-semibold cursor-pointer transition-colors">Xóa</button>
            </div>
          </motion.div>
        ))}

        {/* Add category card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: CATEGORIES.length * 0.07 }}
          className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-secondary hover:bg-secondary/5 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
            <span className="text-2xl font-light text-secondary">+</span>
          </div>
          <p className="text-sm font-semibold text-gray-500">Thêm danh mục</p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const [activeNav, setActiveNav] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const TAB_CONTENT = {
    overview: <OverviewTab />,
    orders: <OrdersTab />,
    products: <ProductsTab />,
    users: <UsersTab />,
    categories: <CategoriesTab />,
  };

  const navLabel = NAV_ITEMS.find((n) => n.key === activeNav)?.label || 'Tổng quan';

  return (
    <div className="min-h-screen bg-surface flex">
      {/* ── Sidebar ── */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 72 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden md:flex flex-col bg-primary-dark text-white sticky top-0 h-screen shrink-0 overflow-hidden"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center shrink-0">
            <span className="text-white font-black text-sm">S</span>
          </div>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <p className="font-bold text-white text-sm">STEM Shop</p>
              <p className="text-xs text-white/40">Admin Panel</p>
            </motion.div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = activeNav === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveNav(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 text-left ${
                  active ? 'bg-white/15 text-white shadow-sm' : 'text-white/50 hover:bg-white/8 hover:text-white/80'
                }`}
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${item.dot} ${active ? 'opacity-100' : 'opacity-40'}`} />
                {sidebarOpen && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex items-center justify-between">
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="text-xs bg-warning text-white px-1.5 py-0.5 rounded-full font-bold">{item.badge}</span>
                    )}
                  </motion.div>
                )}
                {!sidebarOpen && item.badge && (
                  <span className="absolute ml-4 -mt-4 text-xs bg-warning text-white w-4 h-4 rounded-full flex items-center justify-center font-bold text-[10px]">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Collapse button */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center py-2.5 px-3 rounded-xl text-white/40 hover:text-white hover:bg-white/8 transition-all cursor-pointer"
          >
            <span className="text-sm">{sidebarOpen ? '←' : '→'}</span>
          </button>
        </div>
      </motion.aside>

      {/* ── Main content ── */}
      <div className="flex-1 min-w-0">
        {/* Topbar */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button className="md:hidden flex flex-col gap-1 cursor-pointer" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <span className="w-5 h-0.5 bg-gray-600 rounded" />
              <span className="w-5 h-0.5 bg-gray-600 rounded" />
              <span className="w-5 h-0.5 bg-gray-600 rounded" />
            </button>

            <div>
              <h1 className="text-lg font-bold text-primary-dark">{navLabel}</h1>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Link to="/" className="hover:text-secondary transition-colors">Trang chủ</Link>
                <span>/</span>
                <span>Admin</span>
                <span>/</span>
                <span className="text-primary font-medium">{navLabel}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer transition-colors">
                <div className="w-4 h-4 border-2 border-gray-500 rounded-sm relative">
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-1 border-2 border-gray-500 rounded-t-full border-b-0" />
                </div>
              </button>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger rounded-full text-white text-[10px] flex items-center justify-center font-bold">3</span>
            </div>

            {/* Admin avatar */}
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">
                A
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-primary-dark">Admin</p>
                <p className="text-xs text-gray-400">admin@stemshop.vn</p>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {TAB_CONTENT[activeNav]}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
