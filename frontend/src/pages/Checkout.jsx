import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { FiCreditCard, FiSmartphone, FiTruck, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import useCartStore from '../store/useCartStore';
import { createOrder } from '../services/orderService';

const formatPrice = (p) => 'Rp ' + Number(p).toLocaleString('id-ID');

const paymentMethods = [
  { value: 'transfer_bank', label: 'Transfer Bank', icon: FiCreditCard, desc: 'BCA, Mandiri, BNI, BRI' },
  { value: 'qris', label: 'QRIS', icon: FiSmartphone, desc: 'Scan & bayar instan' },
  { value: 'cod', label: 'COD', icon: FiTruck, desc: 'Bayar saat terima' },
];

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const discount = location.state?.discount;
  const { items, totalPrice, fetchCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState('transfer_bank');
  const [successOrder, setSuccessOrder] = useState(null);

  const { isLoading } = useQuery({ queryKey: ['cart-checkout'], queryFn: fetchCart });
  const { register, handleSubmit, formState: { errors } } = useForm();

  const discountAmount = discount ? totalPrice * (parseFloat(discount.discount) / 100) : 0;
  const finalPrice = totalPrice - discountAmount;

  const orderMutation = useMutation({
    mutationFn: (data) => createOrder(data),
    onSuccess: (res) => {
      setSuccessOrder(res.data.data);
      fetchCart();
      toast.success('Pesanan berhasil dibuat!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Gagal membuat pesanan')
  });

  const onSubmit = (data) => {
    orderMutation.mutate({
      address: `${data.address}, ${data.city}, ${data.postalCode}`,
      phone: data.phone,
      payment_method: paymentMethod,
      coupon_code: discount?.code || null
    });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #f0fdf4 100%)' }}>
      <div className="container-page page-top pb-20 md:pb-28">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="inline-flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#00704A] transition-colors mb-4"
          >
            <FiArrowLeft className="w-4 h-4" /> Kembali ke Keranjang
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1E3932] tracking-tight">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {/* Shipping */}
            <div className="bg-white rounded-2xl p-6 border border-[#d1e7dd]">
              <h3 className="font-bold text-[#1E3932] text-base mb-5">Alamat Pengiriman</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#374151] mb-2">Alamat Lengkap</label>
                  <textarea
                    {...register('address', { required: 'Alamat wajib diisi' })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-[#d1e7dd] bg-white text-[#1E3932] text-sm focus:ring-2 focus:ring-[#00704A]/30 focus:outline-none resize-none"
                    placeholder="Jl. Contoh No. 123, Kelurahan, Kecamatan"
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1.5">{errors.address.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">Kota</label>
                  <input
                    {...register('city', { required: 'Kota wajib diisi' })}
                    className="w-full px-4 py-3 rounded-xl border border-[#d1e7dd] bg-white text-[#1E3932] text-sm focus:ring-2 focus:ring-[#00704A]/30 focus:outline-none"
                    placeholder="Jakarta"
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1.5">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">Kode Pos</label>
                  <input
                    {...register('postalCode', { required: 'Kode pos wajib diisi' })}
                    className="w-full px-4 py-3 rounded-xl border border-[#d1e7dd] bg-white text-[#1E3932] text-sm focus:ring-2 focus:ring-[#00704A]/30 focus:outline-none"
                    placeholder="12345"
                  />
                  {errors.postalCode && <p className="text-red-500 text-xs mt-1.5">{errors.postalCode.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#374151] mb-2">Nomor Telepon</label>
                  <input
                    {...register('phone', {
                      required: 'Nomor telepon wajib diisi',
                      pattern: { value: /^[0-9+\-\s]+$/, message: 'Nomor telepon tidak valid' }
                    })}
                    className="w-full px-4 py-3 rounded-xl border border-[#d1e7dd] bg-white text-[#1E3932] text-sm focus:ring-2 focus:ring-[#00704A]/30 focus:outline-none"
                    placeholder="081234567890"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1.5">{errors.phone.message}</p>}
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl p-6 border border-[#d1e7dd]">
              <h3 className="font-bold text-[#1E3932] text-base mb-5">Metode Pembayaran</h3>
              <div className="space-y-3">
                {paymentMethods.map(method => (
                  <label
                    key={method.value}
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === method.value
                      ? 'border-[#00704A] bg-[#f1f8f5]'
                      : 'border-[#d1e7dd] hover:border-[#00704A]/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={() => setPaymentMethod(method.value)}
                      className="hidden"
                    />
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${paymentMethod === method.value ? 'bg-[#00704A] text-white' : 'bg-[#f1f8f5] text-[#374151]'}`}>
                      <method.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1E3932] text-sm">{method.label}</p>
                      <p className="text-[#6b7280] text-xs">{method.desc}</p>
                    </div>
                    {paymentMethod === method.value && (
                      <div className="ml-auto w-5 h-5 rounded-full border-2 border-[#00704A] flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-[#00704A]" />
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-[#d1e7dd] sticky top-24">
              <h3 className="font-bold text-[#1E3932] text-base mb-5">Ringkasan Pesanan</h3>

              <div className="space-y-3 mb-5 max-h-48 overflow-y-auto pr-1">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={`/uploads/products/${item.product?.image}`}
                      alt=""
                      className="w-11 h-11 rounded-xl object-cover flex-shrink-0 bg-[#f1f8f5]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1E3932] truncate">{item.product?.name}</p>
                      <p className="text-xs text-[#6b7280]">x{item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-[#1E3932] whitespace-nowrap">
                      {formatPrice(item.product?.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5 text-sm border-t border-[#d1e7dd] pt-4">
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
                type="submit"
                disabled={orderMutation.isPending}
                className="w-full mt-6 py-3.5 bg-[#00704A] text-white rounded-full font-bold hover:bg-[#004E31] transition-all disabled:opacity-50 text-sm flex items-center justify-center shadow-md shadow-[#00704A]/20"
              >
                {orderMutation.isPending ? 'Memproses...' : 'Buat Pesanan'}
              </button>

              <p className="text-center text-xs text-[#9ca3af] mt-3">
                🔒 Pembayaran aman & terenkripsi
              </p>
            </div>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <Modal isOpen={!!successOrder} onClose={() => navigate('/orders')} title="Pesanan Berhasil! 🎉">
        <div className="text-center py-4">
          <div className="text-5xl mb-5">✅</div>
          <h3 className="text-xl font-bold text-[#1E3932] mb-2">Terima Kasih!</h3>
          <p className="text-[#6b7280] text-sm mb-2">Pesanan #{successOrder?.id} berhasil dibuat.</p>
          <p className="text-2xl font-bold text-[#00704A] mb-6">{formatPrice(successOrder?.total_price)}</p>
          <button
            onClick={() => navigate('/orders')}
            className="px-8 py-3 bg-[#00704A] text-white rounded-full font-semibold hover:bg-[#004E31] transition-colors text-sm shadow-md shadow-[#00704A]/20"
          >
            Lihat Pesanan
          </button>
        </div>
      </Modal>
    </div>
  );
}
