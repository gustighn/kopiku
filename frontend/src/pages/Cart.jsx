import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiMinus, FiPlus, FiTrash2, FiArrowRight, FiTag, FiShoppingCart, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import { validateCoupon } from '../services/couponService';
import { getImageUrl } from '../services/api';

const formatPrice = (p) => 'Rp ' + Number(p).toLocaleString('id-ID');

export default function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { items, totalPrice, fetchCart, updateQuantity, removeItem } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(null);

  const { isLoading } = useQuery({ queryKey: ['cart'], queryFn: fetchCart, enabled: isAuthenticated });

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await validateCoupon(couponCode);
      setDiscount(res.data.data);
      toast.success(`Kupon ${res.data.data.code} berhasil! Diskon ${res.data.data.discount}%`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Kupon tidak valid');
      setDiscount(null);
    }
  };

  const discountAmount = discount ? totalPrice * (parseFloat(discount.discount) / 100) : 0;
  const finalPrice = totalPrice - discountAmount;

  if (!isAuthenticated) {
    return (
      <div className="container-page page-top pb-16 min-h-screen flex flex-col items-center justify-center text-center">
        <FiShoppingCart className="w-16 h-16 mb-5 text-primary/20" />
        <h2 className="text-2xl font-bold text-ink mb-2">Silakan Login</h2>
        <p className="text-[#6b7280] text-sm mb-6">Login untuk melihat keranjang belanjamu</p>
        <Link to="/login" className="px-6 py-2.5 bg-primary text-white rounded-full font-semibold text-sm hover:bg-primary-dark transition-colors shadow-md">
          Masuk
        </Link>
      </div>
    );
  }

  if (isLoading) return <LoadingSpinner />;

  if (!items || items.length === 0) {
    return (
      <div className="container-page page-top pb-16 min-h-screen flex flex-col items-center justify-center text-center">
        <FiShoppingCart className="w-16 h-16 mb-5 text-primary/20" />
        <h2 className="text-2xl font-bold text-ink mb-2">Keranjang Kosong</h2>
        <p className="text-[#6b7280] text-sm mb-6">Yuk, tambahkan kopi favoritmu!</p>
        <Link to="/products" className="px-6 py-2.5 bg-primary text-white rounded-full font-semibold text-sm hover:bg-primary-dark transition-colors shadow-md">
          Jelajahi Produk
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #f0fdf4 100%)' }}>
      <div className="container-page page-top pb-32 md:pb-40">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#00704A] transition-colors mb-6"
          >
            <FiArrowLeft className="w-4 h-4" /> Lanjut Belanja
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1E3932] tracking-tight">
            Keranjang Belanja
            <span className="ml-3 text-lg font-medium text-[#6b7280]">({items.length} item)</span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-3xl p-6 md:p-8 flex gap-6 items-center border border-[#d1e7dd]">
                <img
                  src={getImageUrl(item.product?.image)}
                  alt={item.product?.name}
                  className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl flex-shrink-0 bg-[#f1f8f5]"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${item.product_id}`}
                    className="font-semibold text-[#1E3932] hover:text-[#00704A] block text-sm md:text-base mb-1 truncate"
                  >
                    {item.product?.name}
                  </Link>
                  <p className="text-[#6b7280] text-sm mb-3">{formatPrice(item.product?.price)}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-[#d1e7dd] rounded-full overflow-hidden bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-9 h-9 flex items-center justify-center hover:bg-[#f1f8f5] transition-colors"
                      >
                        <FiMinus className="w-3 h-3 text-[#1E3932]" />
                      </button>
                      <span className="w-9 text-center text-sm font-semibold text-[#1E3932]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-[#f1f8f5] transition-colors"
                      >
                        <FiPlus className="w-3 h-3 text-[#1E3932]" />
                      </button>
                    </div>
                    <button
                      onClick={() => { removeItem(item.id); toast.success('Item dihapus'); }}
                      className="p-2 text-[#9ca3af] hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="font-bold text-[#00704A] text-sm md:text-base whitespace-nowrap flex-shrink-0">
                  {formatPrice(item.product?.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-[#d1e7dd] sticky top-24">
              <h3 className="font-bold text-[#1E3932] text-lg mb-6">Ringkasan</h3>

              {/* Coupon */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#374151] mb-2">Kode Kupon</label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <FiTag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] w-4 h-4" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Masukkan kupon"
                      className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#d1e7dd] bg-white text-[#1E3932] text-sm focus:ring-2 focus:ring-[#00704A]/30 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2.5 bg-[#00704A] text-white rounded-full text-sm font-semibold hover:bg-[#004E31] transition-colors whitespace-nowrap"
                  >
                    Pakai
                  </button>
                </div>
                {discount && (
                  <p className="text-xs text-[#00704A] font-medium mt-2">✓ Kupon {discount.code} aktif — diskon {discount.discount}%</p>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-3 text-sm border-t border-[#d1e7dd] pt-4">
                <div className="flex justify-between text-[#6b7280]">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#1E3932]">{formatPrice(totalPrice)}</span>
                </div>
                {discount && (
                  <div className="flex justify-between text-[#00704A] font-semibold">
                    <span>Diskon ({discount.code})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#6b7280]">
                  <span>Ongkir</span>
                  <span className="font-semibold text-[#00704A]">Gratis</span>
                </div>
                <div className="border-t border-[#d1e7dd] pt-3 flex justify-between font-bold text-[#1E3932]">
                  <span>Total</span>
                  <span className="text-lg text-[#00704A]">{formatPrice(finalPrice)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout', { state: { discount } })}
                className="w-full mt-6 py-3.5 bg-[#00704A] text-white rounded-full font-bold hover:bg-[#004E31] transition-all flex items-center justify-center gap-2 text-sm shadow-md shadow-[#00704A]/20"
              >
                Lanjut ke Checkout <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
