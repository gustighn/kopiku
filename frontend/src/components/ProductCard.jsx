import { useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import { toggleWishlist } from '../services/wishlistService';
import { getImageUrl } from '../services/api';

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
      className="group bg-white rounded-2xl p-4 flex flex-col h-full transition-all duration-300 cursor-pointer hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 hover:border-gray-200">
      
      <div className="relative aspect-[4/3] bg-gray-50/50 rounded-xl flex items-center justify-center p-6 overflow-hidden mb-5">
        <img src={getImageUrl(product.image)} alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
        <button onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center transition-all hover:scale-110 text-gray-400 hover:text-red-500 z-10">
          <FiHeart className={`w-4 h-4 ${wishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      <div className="flex flex-col flex-1 items-center text-center px-1">
        <h3 className="font-medium text-gray-900 text-base mb-1 line-clamp-1">
          {product.name}
        </h3>
        
        <span className="text-gray-500 text-sm mb-4">
          {product.category}
        </span>

        <p className="text-lg font-semibold text-gray-900 mb-5 mt-auto">
          {formatPrice(product.price)}
        </p>

        <button onClick={handleAddToCart}
          className="w-full py-2.5 bg-gray-900 text-white hover:bg-gray-800 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors">
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  );
}

