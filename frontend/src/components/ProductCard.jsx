import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useCartStore from '../store/useCartStore';

export default function ProductCard({ product, index = 0 }) {
  const addToCart = useCartStore((s) => s.addToCart);

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN').format(price) + 'đ';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="card group overflow-hidden"
    >
      {/* Image */}
      <Link to={`/products/${product.id}`} className="block relative overflow-hidden">
        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center p-8">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl gradient-primary opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
          )}
        </div>
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {/* Badge */}
        {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
          <span className="absolute top-3 right-3 bg-warning text-white text-xs font-bold px-3 py-1 rounded-full">
            Còn {product.stockQuantity}
          </span>
        )}
        {product.stockQuantity === 0 && (
          <span className="absolute top-3 right-3 bg-danger text-white text-xs font-bold px-3 py-1 rounded-full">
            Hết hàng
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="p-5">
        {/* Category & Brand */}
        <div className="flex items-center gap-2 mb-2">
          {product.categoryName && (
            <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-0.5 rounded-md">
              {product.categoryName}
            </span>
          )}
          {product.brandName && (
            <span className="text-xs font-medium text-primary/60 bg-primary/5 px-2 py-0.5 rounded-md">
              {product.brandName}
            </span>
          )}
        </div>

        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-primary-dark group-hover:text-secondary transition-colors duration-300 line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>
        </Link>

        {product.ageRange && (
          <p className="text-xs text-gray-400 mt-1">Độ tuổi: {product.ageRange}</p>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <span className="text-lg font-bold text-secondary">
            {formatPrice(product.price)}
          </span>
          {JSON.parse(localStorage.getItem("user") || "{}")?.role !== 'Admin' && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => addToCart(product)}
              disabled={product.stockQuantity === 0}
              className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold
                         hover:bg-primary-light transition-all duration-300
                         disabled:opacity-40 disabled:cursor-not-allowed
                         hover:shadow-lg hover:shadow-primary/25 cursor-pointer"
            >
              Thêm
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
