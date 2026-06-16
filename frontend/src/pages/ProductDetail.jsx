import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiShoppingCart, FiMinus, FiPlus, FiHeart, FiArrowLeft, FiStar, FiZap, FiPackage, FiAlertTriangle, FiCoffee } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';
import { getProduct, getProducts } from '../services/productService';
import { createReview, getProductReviews } from '../services/reviewService';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';

const formatPrice = (p) => 'Rp ' + Number(p).toLocaleString('id-ID');

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();
  const [qty, setQty] = useState(1);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  const { data, isLoading } = useQuery({ queryKey: ['product', id], queryFn: () => getProduct(id) });
  const product = data?.data?.data;

  const { data: reviewsData } = useQuery({ queryKey: ['reviews', id], queryFn: () => getProductReviews(id) });
  const reviews = reviewsData?.data?.data || [];

  const { data: relatedData } = useQuery({
    queryKey: ['related', product?.category],
    queryFn: () => getProducts({ category: product?.category, limit: 4 }),
    enabled: !!product?.category
  });
  const relatedProducts = (relatedData?.data?.data || []).filter(p => p.id !== parseInt(id));

  const reviewMutation = useMutation({
    mutationFn: (data) => createReview(data),
    onSuccess: () => {
      toast.success('Review berhasil ditambahkan!');
      queryClient.invalidateQueries(['reviews', id]);
      queryClient.invalidateQueries(['product', id]);
      setReviewRating(0);
      setReviewComment('');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Gagal menambahkan review')
  });

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.info('Silakan login terlebih dahulu'); navigate('/login'); return; }
    try { await addItem(product.id, qty); toast.success(`${product.name} ditambahkan ke keranjang!`); } catch { toast.error('Gagal menambahkan ke keranjang'); }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) { toast.info('Silakan login terlebih dahulu'); navigate('/login'); return; }
    try { await addItem(product.id, qty); navigate('/cart'); } catch { toast.error('Gagal memproses pesanan'); }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!product) return (
    <div className="container-page pt-28 pb-16 text-center">
      <h2 className="text-2xl font-bold text-[#1E3932]">Produk tidak ditemukan</h2>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      <div className="container-page page-top pb-32 md:pb-40">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#00704A] transition-colors mb-12"
        >
          <FiArrowLeft className="w-4 h-4" /> Kembali
        </button>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-16 lg:gap-28 mb-32 md:mb-40">
          {/* Image */}
          <div className="rounded-3xl overflow-hidden flex items-center justify-center p-12 md:p-16 aspect-square border border-[#d1e7dd]" style={{ background: 'linear-gradient(135deg, #f0fdf4, #e8f5ee)' }}>
            <img
              src={`/uploads/products/${product.image}`}
              alt={product.name}
              className="w-full max-w-xs h-auto object-contain hover:scale-105 transition-transform duration-700 drop-shadow-lg"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            {/* Category badge */}
            <span className="inline-flex w-fit px-3 py-1 bg-[#00704A] text-white text-xs font-semibold rounded-full uppercase tracking-wider mb-4">
              {product.category}
            </span>

            <h1 className="text-3xl md:text-4xl font-bold text-[#1E3932] mb-3 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={`w-4 h-4 ${i < Math.round(product.rating || 5) ? 'text-amber-400' : 'text-gray-200'}`} />
                ))}
              </div>
              <span className="text-sm text-[#6b7280] font-medium">
                {Number(product.rating || 5).toFixed(1)} ({reviews.length} ulasan)
              </span>
            </div>

            <p className="text-2xl md:text-3xl font-bold text-[#00704A] mb-5">{formatPrice(product.price)}</p>

            <p className="text-[#6b7280] leading-relaxed mb-7 text-sm md:text-base">{product.description}</p>

            {/* Weight Options */}
            <div className="mb-6">
              <span className="block text-sm font-semibold text-[#1E3932] mb-3">Berat</span>
              <div className="flex gap-2">
                <button className="px-5 py-2 bg-[#00704A] text-white rounded-full text-sm font-semibold shadow-sm">200g</button>
                <button className="px-5 py-2 bg-white border border-[#d1e7dd] text-[#1E3932] rounded-full text-sm font-semibold hover:bg-[#f1f8f5] transition-colors">500g</button>
                <button className="px-5 py-2 bg-white border border-[#d1e7dd] text-[#1E3932] rounded-full text-sm font-semibold hover:bg-[#f1f8f5] transition-colors">1kg</button>
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-7">
              <span className="block text-sm font-semibold text-[#1E3932] mb-3">Kuantitas</span>
              <div className="inline-flex items-center border border-[#d1e7dd] rounded-full overflow-hidden bg-white">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-[#f1f8f5] transition-colors text-[#1E3932]"
                >
                  <FiMinus className="w-3.5 h-3.5" />
                </button>
                <span className="w-12 text-center font-semibold text-[#1E3932] text-sm">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-[#f1f8f5] transition-colors text-[#1E3932]"
                >
                  <FiPlus className="w-3.5 h-3.5" />
                </button>
              </div>
              {product.stock < 10 && product.stock > 0 && (
                <p className="text-xs text-amber-600 font-medium mt-2 flex items-center gap-2"><FiAlertTriangle className="w-4 h-4" /> Stok tersisa {product.stock}</p>
              )}
              {product.stock === 0 && (
                <p className="text-xs text-red-500 font-medium mt-2">Stok habis</p>
              )}
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 py-3 bg-[#00704A] text-white rounded-full font-semibold hover:bg-[#004E31] transition-all disabled:opacity-40 text-sm flex items-center justify-center gap-2 shadow-md shadow-[#00704A]/20"
              >
                <FiShoppingCart className="w-4 h-4" /> Tambah ke Keranjang
              </button>
              <button
                className="w-11 h-11 flex items-center justify-center border border-[#d1e7dd] rounded-full text-[#6b7280] hover:bg-[#f1f8f5] hover:text-red-500 transition-colors flex-shrink-0"
              >
                <FiHeart className="w-4 h-4" />
              </button>
            </div>

            {/* Feature Icons */}
            <div className="flex items-center gap-6 pt-6 border-t border-[#d1e7dd]">
              {[
                { icon: <FiCoffee className="w-5 h-5" />, label: '100% Arabica' },
                { icon: <FiZap className="w-5 h-5" />, label: 'Baru Disangrai' },
                { icon: <FiPackage className="w-5 h-5" />, label: 'Kemasan Aman' },
              ].map((f, i) => (
                <div key={i} className="text-center">
                  <div className="text-[#00704A] text-2xl mb-1">{f.icon}</div>
                  <p className="text-xs text-[#6b7280] font-medium">{f.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="border-t border-[#d1e7dd] pt-16 md:pt-24 mt-8 md:mt-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1E3932] mb-8 tracking-tight">Ulasan Pelanggan</h2>

          {/* Add Review */}
          {isAuthenticated && (
            <div className="rounded-2xl p-6 mb-8 border border-[#d1e7dd]" style={{ background: 'linear-gradient(135deg, #f0fdf4, #ffffff)' }}>
              <h3 className="font-semibold text-[#1E3932] mb-4 text-sm">Tulis Ulasan</h3>
              <div className="mb-4">
                <StarRating rating={reviewRating} onRate={setReviewRating} />
              </div>
              <textarea
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder="Bagikan pengalamanmu tentang produk ini..."
                className="w-full px-4 py-3 rounded-xl border border-[#d1e7dd] bg-white text-[#1E3932] text-sm focus:ring-2 focus:ring-[#00704A]/30 focus:outline-none resize-none h-24"
              />
              <button
                onClick={() => reviewMutation.mutate({ product_id: parseInt(id), rating: reviewRating, comment: reviewComment })}
                disabled={!reviewRating || reviewMutation.isPending}
                className="mt-4 px-5 py-2.5 bg-[#00704A] text-white rounded-full text-sm font-semibold hover:bg-[#004E31] transition-colors disabled:opacity-40 shadow-sm"
              >
                {reviewMutation.isPending ? 'Mengirim...' : 'Kirim Ulasan'}
              </button>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border border-[#d1e7dd]" style={{ background: 'linear-gradient(135deg, #f0fdf4, #e8f5ee)' }}>
                <FiStar className="w-10 h-10 mx-auto mb-3 text-[#00704A]/20" />
                <p className="text-[#6b7280] text-sm">Belum ada ulasan untuk produk ini.</p>
              </div>
            ) : reviews.map(review => (
              <div key={review.id} className="bg-white rounded-2xl p-5 border border-[#d1e7dd]">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00704A] to-[#1E9E6E] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {review.user?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1E3932] text-sm">{review.user?.name}</p>
                      <div className="flex gap-0.5 mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={`w-3 h-3 ${i < review.rating ? 'text-amber-400' : 'text-gray-200'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-[#9ca3af]">
                    {new Date(review.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <p className="text-[#374151] text-sm leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 md:mt-28 pt-16 md:pt-20 border-t border-[#d1e7dd]">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1E3932] mb-8 tracking-tight">Produk Terkait</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {relatedProducts.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
