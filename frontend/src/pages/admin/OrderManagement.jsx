import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiEye } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';

const formatPrice = (p) => 'Rp ' + Number(p).toLocaleString('id-ID');
const statusConfig = {
  pending: { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'Diproses', color: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'Dikirim', color: 'bg-purple-100 text-purple-800' },
  completed: { label: 'Selesai', color: 'bg-green-100 text-green-800' },
};

export default function OrderManagement() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [detailOrder, setDetailOrder] = useState(null);

  const { data, isLoading } = useQuery({ queryKey: ['admin-orders', page, statusFilter], queryFn: () => getAllOrders({ page, limit: 10, status: statusFilter || undefined }) });
  const orders = data?.data?.data || [];
  const pagination = data?.data?.pagination || {};

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: () => { toast.success('Status pesanan diperbarui!'); queryClient.invalidateQueries(['admin-orders']); },
    onError: (err) => toast.error(err.response?.data?.message || 'Gagal mengubah status')
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark-brown dark:text-cream mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>Manajemen Pesanan</h1>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[{ value: '', label: 'Semua' }, ...Object.entries(statusConfig).map(([k, v]) => ({ value: k, label: v.label }))].map(tab => (
          <button key={tab.value} onClick={() => { setStatusFilter(tab.value); setPage(1); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${statusFilter === tab.value ? 'bg-coffee text-white' : 'bg-cream dark:bg-coffee/20 text-dark-brown dark:text-cream hover:bg-coffee/10'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-dark-brown/50 rounded-2xl border border-cream-dark/30 dark:border-coffee/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream/50 dark:bg-coffee/10">
              <tr>{['ID', 'Pelanggan', 'Total', 'Status', 'Tanggal', 'Aksi'].map(h => (<th key={h} className="px-6 py-4 text-left text-xs font-semibold text-dark-brown/70 dark:text-cream/70 uppercase tracking-wider">{h}</th>))}</tr>
            </thead>
            <tbody className="divide-y divide-cream-dark/20 dark:divide-coffee/10">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-cream/30 dark:hover:bg-coffee/5">
                  <td className="px-6 py-4 text-sm font-medium text-dark-brown dark:text-cream">#{order.id}</td>
                  <td className="px-6 py-4 text-sm text-dark-brown dark:text-cream">{order.user?.name}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-coffee">{formatPrice(order.total_price)}</td>
                  <td className="px-6 py-4">
                    <select value={order.status} onChange={e => statusMutation.mutate({ id: order.id, status: e.target.value })}
                      className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${statusConfig[order.status]?.color}`}>
                      {Object.entries(statusConfig).map(([k, v]) => (<option key={k} value={k}>{v.label}</option>))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-dark-brown/60 dark:text-cream/60">{new Date(order.created_at).toLocaleDateString('id-ID')}</td>
                  <td className="px-6 py-4"><button onClick={() => setDetailOrder(order)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><FiEye className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(pagination.totalPages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-full text-sm ${page === i + 1 ? 'bg-coffee text-white' : 'bg-cream dark:bg-coffee/20'}`}>{i + 1}</button>
          ))}
        </div>
      )}

      <Modal isOpen={!!detailOrder} onClose={() => setDetailOrder(null)} title={`Detail Pesanan #${detailOrder?.id}`} size="lg">
        {detailOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-dark-brown/50 dark:text-cream/50">Pelanggan:</span> <strong className="text-dark-brown dark:text-cream ml-2">{detailOrder.user?.name}</strong></div>
              <div><span className="text-dark-brown/50 dark:text-cream/50">Email:</span> <strong className="text-dark-brown dark:text-cream ml-2">{detailOrder.user?.email}</strong></div>
              <div><span className="text-dark-brown/50 dark:text-cream/50">Telepon:</span> <strong className="text-dark-brown dark:text-cream ml-2">{detailOrder.phone}</strong></div>
              <div><span className="text-dark-brown/50 dark:text-cream/50">Pembayaran:</span> <strong className="text-dark-brown dark:text-cream ml-2 capitalize">{detailOrder.payment_method?.replace('_', ' ')}</strong></div>
              <div className="col-span-2"><span className="text-dark-brown/50 dark:text-cream/50">Alamat:</span> <strong className="text-dark-brown dark:text-cream ml-2">{detailOrder.address}</strong></div>
            </div>
            <div className="border-t border-cream-dark/30 dark:border-coffee/20 pt-4 space-y-3">
              {detailOrder.items?.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <img src={`/uploads/products/${item.product?.image}`} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1"><p className="text-sm font-medium text-dark-brown dark:text-cream">{item.product?.name}</p><p className="text-xs text-dark-brown/50 dark:text-cream/50">x{item.quantity}</p></div>
                  <p className="font-semibold text-dark-brown dark:text-cream text-sm">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-cream-dark/30 dark:border-coffee/20 pt-4 text-right">
              <p className="text-2xl font-bold text-coffee">{formatPrice(detailOrder.total_price)}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
