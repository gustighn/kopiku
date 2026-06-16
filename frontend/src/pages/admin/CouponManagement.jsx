import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getCoupons, createCoupon, deleteCoupon } from '../../services/couponService';

export default function CouponManagement() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [form, setForm] = useState({ code: '', discount: '', expired_at: '' });

  const { data, isLoading } = useQuery({ queryKey: ['admin-coupons'], queryFn: getCoupons });
  const coupons = data?.data?.data || [];

  const createMutation = useMutation({
    mutationFn: (data) => createCoupon(data),
    onSuccess: () => { toast.success('Kupon berhasil dibuat!'); queryClient.invalidateQueries(['admin-coupons']); setModalOpen(false); setForm({ code: '', discount: '', expired_at: '' }); },
    onError: (err) => toast.error(err.response?.data?.message || 'Gagal membuat kupon')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteCoupon(id),
    onSuccess: () => { toast.success('Kupon berhasil dihapus!'); queryClient.invalidateQueries(['admin-coupons']); setDeleteModal(null); }
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-dark-brown dark:text-cream" style={{ fontFamily: "'Playfair Display', serif" }}>Manajemen Kupon</h1>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-white text-green-accent rounded-xl shadow-sm font-medium hover:bg-green-dark"><FiPlus /> Tambah Kupon</button>
      </div>

      <div className="bg-white dark:bg-dark-brown/50 rounded-2xl border border-cream-dark/30 dark:border-coffee/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream/50 dark:bg-coffee/10">
              <tr>{['Kode', 'Diskon', 'Berlaku Hingga', 'Status', 'Aksi'].map(h => (<th key={h} className="px-6 py-4 text-left text-xs font-semibold text-dark-brown/70 dark:text-cream/70 uppercase tracking-wider">{h}</th>))}</tr>
            </thead>
            <tbody className="divide-y divide-cream-dark/20 dark:divide-coffee/10">
              {coupons.map(coupon => {
                const expired = new Date(coupon.expired_at) < new Date();
                return (
                  <tr key={coupon.id} className="hover:bg-cream/30 dark:hover:bg-coffee/5">
                    <td className="px-6 py-4 font-mono font-bold text-dark-brown dark:text-cream">{coupon.code}</td>
                    <td className="px-6 py-4 text-sm text-green-accent font-semibold">{coupon.discount}%</td>
                    <td className="px-6 py-4 text-sm text-dark-brown/70 dark:text-cream/70">{new Date(coupon.expired_at).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${expired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{expired ? 'Kedaluwarsa' : 'Aktif'}</span></td>
                    <td className="px-6 py-4"><button onClick={() => setDeleteModal(coupon)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><FiTrash2 className="w-4 h-4" /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Tambah Kupon" size="md">
        <form onSubmit={e => { e.preventDefault(); createMutation.mutate(form); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-brown/70 dark:text-cream/70 mb-1">Kode Kupon</label>
            <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} required placeholder="Contoh: KOPIKU50"
              className="w-full px-4 py-3 rounded-xl border border-cream-dark dark:border-coffee/30 bg-white dark:bg-dark-brown text-dark-brown dark:text-cream focus:ring-2 focus:ring-coffee focus:outline-none font-mono" />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-brown/70 dark:text-cream/70 mb-1">Diskon (%)</label>
            <input type="number" min="1" max="100" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} required
              className="w-full px-4 py-3 rounded-xl border border-cream-dark dark:border-coffee/30 bg-white dark:bg-dark-brown text-dark-brown dark:text-cream focus:ring-2 focus:ring-coffee focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-brown/70 dark:text-cream/70 mb-1">Berlaku Hingga</label>
            <input type="date" value={form.expired_at} onChange={e => setForm({ ...form, expired_at: e.target.value })} required
              className="w-full px-4 py-3 rounded-xl border border-cream-dark dark:border-coffee/30 bg-white dark:bg-dark-brown text-dark-brown dark:text-cream focus:ring-2 focus:ring-coffee focus:outline-none" />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 border border-cream-dark dark:border-coffee/30 rounded-xl">Batal</button>
            <button type="submit" disabled={createMutation.isPending} className="flex-1 py-3 bg-coffee text-white rounded-xl font-medium disabled:opacity-50">Buat Kupon</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Hapus Kupon" size="sm">
        <div className="text-center">
          <p className="text-dark-brown/70 dark:text-cream/70 mb-6">Yakin ingin menghapus kupon <strong>{deleteModal?.code}</strong>?</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteModal(null)} className="flex-1 py-3 border border-cream-dark dark:border-coffee/30 rounded-xl">Batal</button>
            <button onClick={() => deleteMutation.mutate(deleteModal.id)} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium">Hapus</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
