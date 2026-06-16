import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';
import { getWishlist } from '../services/wishlistService';

export default function Wishlist() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['wishlist'], queryFn: getWishlist });
  const wishlist = data?.data?.data || [];

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <div className="container-page page-top pb-20 md:pb-28">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#111111] tracking-tight">Wishlist Saya</h1>
          {wishlist.length > 0 && (
            <p className="text-[#6b7280] text-sm mt-1">{wishlist.length} produk disimpan</p>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-16 bg-white border border-[#e5e7eb] rounded-2xl max-w-md mx-auto">
            <FiHeart className="w-14 h-14 text-[#111111]/15 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#111111] mb-2">Wishlist Kosong</h3>
            <p className="text-[#6b7280] text-sm mb-6">Simpan kopi favoritmu di sini</p>
            <Link
              to="/products"
              className="inline-flex px-6 py-2.5 bg-[#111111] text-white rounded-xl font-semibold text-sm hover:bg-[#242424] transition-colors"
            >
              Jelajahi Produk
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-5">
            {wishlist.map(item => (
              <ProductCard
                key={item.id}
                product={item.product}
                wishlisted={true}
                onWishlistChange={() => queryClient.invalidateQueries(['wishlist'])}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
