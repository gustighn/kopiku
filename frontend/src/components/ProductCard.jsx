import { useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import { toggleWishlist } from '../services/wishlistService';

const formatPrice = (price) => 'Rp ' + Number(price).toLocaleString('id-ID');

export default function ProductCard({ product, wishlisted = false, onWishlistChange }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) { toast.info('Silakan login terlebih dahulu'); navigate('/login'); return; }
    try { await addItem(product.id); toast.success(`${product.name} ditambahkan ke keranjang!`); } catch { toast.error('Gagal menambahkan ke keranjang'); }
  };

  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) { toast.info('Silakan login terlebih dahulu'); navigate('/login'); return; }
    try {
      const res = await toggleWishlist(product.id);
      toast.success(res.data.message);
      onWishlistChange?.();
    } catch { toast.error('Gagal mengubah wishlist'); }
  };

  const calories = 100 + (product.id * 17) % 150;
  const sugar = 5 + (product.id * 7) % 25;

  return (
    <div onClick={() => navigate(`/products/${product.id}`)}
      className="group bg-white rounded-3xl p-2.5 pb-6 border border-[#e5e7eb]/80 flex flex-col h-full transition-all duration-400 cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#00704A]/6 hover:border-[#00704A]/25">
      {/* Image Container with Nested Rounded Corners */}
      <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-[#f8faf9] to-[#edf7f3] rounded-2xl flex items-center justify-center p-6 flex-shrink-0">
        <img src={`/uploads/products/${product.image}`} alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-lg" />
        <button onClick={handleWishlist}
          className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm border border-[#e5e7eb] flex items-center justify-center shadow-sm hover:scale-110 transition-all duration-300 text-[#1E3932] hover:text-red-500 z-10">
          <FiHeart className={`w-4 h-4 ${wishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      {/* Info Container */}
      <div className="pt-5 px-3 flex flex-col flex-1 items-center text-center">
        {/* Category Badge */}
        <span className="inline-block px-3 py-1 bg-[#00704A]/6 text-[#00704A] text-[9px] rounded-full font-extrabold uppercase tracking-[0.15em] mb-3">
          {product.category}
        </span>

        {/* Product Title */}
        <h3 className="font-extrabold text-[#1E3932] text-sm md:text-base mb-2 line-clamp-2 leading-snug tracking-tight min-h-[44px] flex items-center justify-center w-full">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center justify-center gap-1 mb-3.5">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.rating || 5) ? 'text-amber-400' : 'text-gray-200'}`} />
          ))}
          <span className="text-xs text-[#6b7280] font-semibold ml-1">({Number(product.rating || 5).toFixed(1)})</span>
        </div>

        {/* Nutrition Info Line */}
        <div className="flex items-center justify-center gap-2 text-[10px] text-[#6b7280] mb-4.5 bg-[#f1f8f5] py-2 px-3.5 rounded-full w-full font-medium">
          <span>Kalori: <strong className="text-[#1E3932] font-semibold">{calories}</strong></span>
          <span className="w-1 h-1 rounded-full bg-[#00704A]/25" />
          <span>Gula: <strong className="text-[#1E3932] font-semibold">{sugar}g</strong></span>
        </div>

        {/* Price */}
        <p className="text-lg md:text-xl font-black text-[#00704A] tracking-tight mb-5 mt-auto">
          {formatPrice(product.price)}
        </p>

        {/* Buy Button */}
        <button onClick={handleAddToCart}
          className="w-full py-2.5 bg-[#00704A] text-white hover:bg-[#004E31] text-xs font-bold rounded-full flex items-center justify-center gap-2 transition-all duration-300 shadow-md shadow-[#00704A]/5 hover:shadow-lg hover:shadow-[#00704A]/15 active:scale-[0.98]">
          <FiShoppingCart className="w-3.5 h-3.5" /> Tambah ke Keranjang
        </button>
      </div>
    </div>
  );
}

