import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { productApi } from '../api/productApi';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Arduino Uno R3', price: 250000, stockQuantity: 100, categoryName: 'Linh kiện', brandName: 'Arduino', imageUrl: '', ageRange: '10+' },
  { id: 2, name: 'Raspberry Pi 4 Model B', price: 1500000, stockQuantity: 50, categoryName: 'Linh kiện', brandName: 'Raspberry Pi', imageUrl: '', ageRange: '12+' },
  { id: 3, name: 'LEGO Mindstorms EV3', price: 8500000, stockQuantity: 20, categoryName: 'Robot', brandName: 'LEGO', imageUrl: '', ageRange: '10+' },
  { id: 4, name: 'Kit Robot Car 4WD', price: 450000, stockQuantity: 75, categoryName: 'Robot', brandName: 'Arduino', imageUrl: '', ageRange: '12+' },
  { id: 5, name: 'Sensor Kit 37 in 1', price: 350000, stockQuantity: 200, categoryName: 'Kit học tập', brandName: 'Arduino', imageUrl: '', ageRange: '10+' },
  { id: 6, name: 'Breadboard Kit Cơ Bản', price: 120000, stockQuantity: 300, categoryName: 'Linh kiện', brandName: 'Arduino', imageUrl: '', ageRange: '8+' },
  { id: 7, name: 'LEGO Education SPIKE', price: 7200000, stockQuantity: 15, categoryName: 'Kit học tập', brandName: 'LEGO', imageUrl: '', ageRange: '8+' },
  { id: 8, name: 'Raspberry Pi Pico W', price: 180000, stockQuantity: 150, categoryName: 'Linh kiện', brandName: 'Raspberry Pi', imageUrl: '', ageRange: '12+' },
  { id: 9, name: 'ESP32 Dev Board', price: 95000, stockQuantity: 250, categoryName: 'Linh kiện', brandName: 'Arduino', imageUrl: '', ageRange: '14+' },
  { id: 10, name: 'Servo Motor SG90', price: 25000, stockQuantity: 500, categoryName: 'Linh kiện', brandName: 'Arduino', imageUrl: '', ageRange: '10+' },
  { id: 11, name: 'LEGO Boost Creative', price: 3600000, stockQuantity: 30, categoryName: 'Robot', brandName: 'LEGO', imageUrl: '', ageRange: '7+' },
  { id: 12, name: 'Raspberry Pi Camera V2', price: 650000, stockQuantity: 80, categoryName: 'Linh kiện', brandName: 'Raspberry Pi', imageUrl: '', ageRange: '12+' },
];

const CATEGORIES = ['Tất cả', 'Robot', 'Linh kiện', 'Kit học tập'];
const BRANDS = ['Tất cả', 'Arduino', 'Raspberry Pi', 'LEGO'];
const SORT_OPTIONS = [
  { value: 'default', label: 'Mặc định' },
  { value: 'price_asc', label: 'Giá: Thấp → Cao' },
  { value: 'price_desc', label: 'Giá: Cao → Thấp' },
  { value: 'name', label: 'Tên A-Z' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'Tất cả');
  const [brand, setBrand] = useState('Tất cả');
  const [sort, setSort] = useState('default');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    productApi.getAll().then((res) => {
      if (res?.data?.length) setProducts(res.data);
    }).catch(() => {});
  }, []);

  const filtered = products
    .filter((p) => {
      if (category !== 'Tất cả' && p.categoryName !== category) return false;
      if (brand !== 'Tất cả' && p.brandName !== brand) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'price_asc') return a.price - b.price;
      if (sort === 'price_desc') return b.price - a.price;
      if (sort === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-dark">Sản phẩm STEM</h1>
          <p className="text-gray-500 mt-2">
            Tìm kiếm và khám phá hàng trăm sản phẩm STEM chất lượng
          </p>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card p-4 sm:p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-field sm:w-48 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-outline py-2 sm:hidden"
            >
              Bộ lọc {showFilters ? '▲' : '▼'}
            </button>
          </div>

          {/* Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} sm:block mt-4 pt-4 border-t border-gray-100`}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <label className="text-xs text-gray-400 font-medium uppercase tracking-wider block mb-2">Danh mục</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                        category === cat
                          ? 'bg-secondary text-white shadow-md shadow-secondary/25'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 font-medium uppercase tracking-wider block mb-2">Thương hiệu</label>
                <div className="flex flex-wrap gap-2">
                  {BRANDS.map((b) => (
                    <button
                      key={b}
                      onClick={() => setBrand(b)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                        brand === b
                          ? 'bg-primary text-white shadow-md shadow-primary/25'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-400 text-sm mb-6"
        >
          Hiển thị <span className="font-semibold text-primary-dark">{filtered.length}</span> sản phẩm
        </motion.p>

        {/* Product Grid */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={`${category}-${brand}-${sort}-${search}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl text-gray-300">?</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">Không tìm thấy sản phẩm</h3>
              <p className="text-gray-400">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
