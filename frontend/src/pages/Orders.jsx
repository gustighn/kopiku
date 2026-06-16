import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FiPackage, FiChevronDown, FiChevronUp, FiArrowLeft } from 'react-icons/fi';
import { useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { getOrders } from '../services/orderService';
import { getImageUrl } from '../services/api';

const formatPrice = (p) => 'Rp ' + Number(p).toLocaleString('id-ID');

const statusConfig = {
  pending: { label: 'Menunggu Pembayaran', color: 'bg-amber-50 text-amber-700 border border-amber-200' },
  processing: { label: 'Diproses', color: 'bg-blue-50 text-blue-700 border border-blue-200' },
  shipped: { label: 'Dikirim', color: 'bg-purple-50 text-purple-700 border border-purple-200' },
  completed: { label: 'Selesai', color: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  cancelled: { label: 'Dibatalkan', color: 'bg-red-50 text-red-700 border border-red-200' },
};

export default function Orders() {
  const { data, isLoading } = useQuery({ queryKey: ['orders'], queryFn: getOrders });
  const orders = data?.data?.data || [];
  const [expanded, setExpanded] = useState(null);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #f0fdf4 100%)' }}>
      <div className="container-page page-top pb-32 md:pb-40">
        {/* Header */}
        <div className="mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#00704A] transition-colors mb-4">
            <FiArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1E3932] tracking-tight">Riwayat Pesanan</h1>
          {orders.length > 0 && (
            <p className="text-[#6b7280] text-sm mt-1">{orders.length} pesanan ditemukan</p>
          )}
        </div>

        <div className="max-w-3xl">
          {orders.length === 0 ? (
            <div className="text-center py-16 bg-white border border-[#d1e7dd] rounded-2xl">
              <FiPackage className="w-14 h-14 text-[#00704A]/15 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[#1E3932] mb-2">Belum Ada Pesanan</h3>
              <p className="text-[#6b7280] text-sm mb-6">Yuk, mulai belanja kopi!</p>
              <Link
                to="/products"
                className="inline-flex px-6 py-2.5 bg-[#00704A] text-white rounded-full font-semibold text-sm hover:bg-[#004E31] transition-colors shadow-md shadow-[#00704A]/20"
              >
                Belanja Sekarang
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map(order => (
                <div key={order.id} className="bg-white rounded-3xl border border-[#d1e7dd] overflow-hidden">
                  <button
                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    className="w-full p-6 md:p-8 flex items-center justify-between hover:bg-[#f1f8f5] transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#f1f8f5] flex items-center justify-center flex-shrink-0">
                        <FiPackage className="w-5 h-5 text-[#00704A]" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-[#1E3932] text-sm">Pesanan #{order.id}</p>
                        <p className="text-xs text-[#9ca3af] mt-0.5">
                          {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig[order.status]?.color}`}>
                        {statusConfig[order.status]?.label}
                      </span>
                      <p className="font-bold text-[#00704A] text-sm hidden sm:block">{formatPrice(order.total_price)}</p>
                      {expanded === order.id
                        ? <FiChevronUp className="w-4 h-4 text-[#9ca3af] flex-shrink-0" />
                        : <FiChevronDown className="w-4 h-4 text-[#9ca3af] flex-shrink-0" />
                      }
                    </div>
                  </button>

                  {expanded === order.id && (
                    <div className="px-6 pb-6 md:px-8 md:pb-8 border-t border-[#d1e7dd] animate-slide-down">
                      <div className="space-y-3 mt-4">
                        {order.items?.map(item => (
                          <div key={item.id} className="flex items-center gap-3">
                            <img
                              src={getImageUrl(item.product?.image)}
                              alt=""
                              className="w-11 h-11 rounded-xl object-cover flex-shrink-0 bg-[#f1f8f5]"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[#1E3932] truncate">{item.product?.name}</p>
                              <p className="text-xs text-[#9ca3af]">x{item.quantity} × {formatPrice(item.price)}</p>
                            </div>
                            <p className="font-semibold text-[#1E3932] text-sm flex-shrink-0">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 pt-4 border-t border-[#d1e7dd] space-y-2 text-sm">
                        <div className="flex justify-between text-[#6b7280]">
                          <span>Alamat</span>
                          <span className="text-right max-w-[60%] text-[#374151]">{order.address}</span>
                        </div>
                        <div className="flex justify-between text-[#6b7280]">
                          <span>Telepon</span>
                          <span className="text-[#374151]">{order.phone}</span>
                        </div>
                        <div className="flex justify-between text-[#6b7280]">
                          <span>Pembayaran</span>
                          <span className="capitalize text-[#374151]">{order.payment_method?.replace('_', ' ')}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-[#00704A] font-semibold">
                            <span>Diskon</span>
                            <span>-{formatPrice(order.discount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-[#1E3932] text-base pt-2 border-t border-[#d1e7dd]">
                          <span>Total</span>
                          <span className="text-[#00704A]">{formatPrice(order.total_price)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
