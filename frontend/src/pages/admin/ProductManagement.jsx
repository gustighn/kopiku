import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiStar, FiAlertTriangle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService';

const formatPrice = (p) => 'Rp ' + Number(p).toLocaleString('id-ID');

export default function ProductManagement() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category: 'Latte', image: null });

  const { data, isLoading } = useQuery({ queryKey: ['admin-products', search, page], queryFn: () => getProducts({ search, page, limit: 10 }) });
  const products = data?.data?.data || [];
  const pagination = data?.data?.pagination || {};

  const createMutation = useMutation({
    mutationFn: (formData) => createProduct(formData),
    onSuccess: () => { toast.success('Produk berhasil ditambahkan!'); queryClient.invalidateQueries(['admin-products']); closeModal(); },
    onError: (err) => toast.error(err.response?.data?.message || 'Gagal menambahkan produk')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }) => updateProduct(id, formData),
    onSuccess: () => { toast.success('Produk berhasil diperbarui!'); queryClient.invalidateQueries(['admin-products']); closeModal(); },
    onError: (err) => toast.error(err.response?.data?.message || 'Gagal memperbarui produk')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteProduct(id),
    onSuccess: () => { toast.success('Produk berhasil dihapus!'); queryClient.invalidateQueries(['admin-products']); setDeleteModal(null); },
    onError: (err) => toast.error(err.response?.data?.message || 'Gagal menghapus produk')
  });

  const openAddModal = () => { setEditProduct(null); setForm({ name: '', description: '', price: '', stock: '', category: 'Latte', image: null }); setModalOpen(true); };
  const openEditModal = (p) => { setEditProduct(p); setForm({ name: p.name, description: p.description || '', price: p.price, stock: p.stock, category: p.category, image: null }); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditProduct(null); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => { if (val !== null) formData.append(key, val); });
    if (editProduct) updateMutation.mutate({ id: editProduct.id, formData });
    else createMutation.mutate(formData);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-dark-brown dark:text-cream" style={{ fontFamily: "'Playfair Display', serif" }}>Manajemen Produk</h1>
        <button onClick={openAddModal} className="flex items-center gap-2 px-6 py-3 bg-green-accent text-white rounded-xl font-medium hover:bg-green-dark transition-colors">
          <FiPlus /> Tambah Produk
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-brown/40 dark:text-cream/40" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari produk..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-cream-dark dark:border-coffee/30 bg-white dark:bg-dark-brown text-dark-brown dark:text-cream focus:ring-2 focus:ring-coffee focus:outline-none" />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-dark-brown/50 rounded-2xl border border-cream-dark/30 dark:border-coffee/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream/50 dark:bg-coffee/10">
              <tr>
                {['Produk', 'Harga', 'Stok', 'Kategori', 'Rating', 'Aksi'].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-dark-brown/70 dark:text-cream/70 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark/20 dark:divide-coffee/10">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-cream/30 dark:hover:bg-coffee/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={`/uploads/products/${product.image}`} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <span className="font-medium text-dark-brown dark:text-cream text-sm">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-coffee font-semibold">{formatPrice(product.price)}</td>
                  <td className="px-6 py-4 text-sm text-dark-brown dark:text-cream">{product.stock}</td>
                  <td className="px-6 py-4"><span className="px-3 py-1 bg-coffee/10 text-coffee rounded-full text-xs font-medium">{product.category}</span></td>
                  <td className="px-6 py-4 text-sm text-dark-brown dark:text-cream flex items-center gap-2">{Number(product.rating).toFixed(1)} <FiStar className="w-4 h-4 text-amber-400" /></td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEditModal(product)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><FiEdit2 className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteModal(product)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><FiTrash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(pagination.totalPages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-full text-sm ${page === i + 1 ? 'bg-coffee text-white' : 'bg-cream dark:bg-coffee/20 text-dark-brown dark:text-cream'}`}>{i + 1}</button>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={editProduct ? 'Edit Produk' : 'Tambah Produk'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-brown/70 dark:text-cream/70 mb-1">Nama Produk</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
              className="w-full px-4 py-3 rounded-xl border border-cream-dark dark:border-coffee/30 bg-white dark:bg-dark-brown text-dark-brown dark:text-cream focus:ring-2 focus:ring-coffee focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-brown/70 dark:text-cream/70 mb-1">Deskripsi</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
              className="w-full px-4 py-3 rounded-xl border border-cream-dark dark:border-coffee/30 bg-white dark:bg-dark-brown text-dark-brown dark:text-cream focus:ring-2 focus:ring-coffee focus:outline-none resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-brown/70 dark:text-cream/70 mb-1">Harga (IDR)</label>
              <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required
                className="w-full px-4 py-3 rounded-xl border border-cream-dark dark:border-coffee/30 bg-white dark:bg-dark-brown text-dark-brown dark:text-cream focus:ring-2 focus:ring-coffee focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-brown/70 dark:text-cream/70 mb-1">Stok</label>
              <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required
                className="w-full px-4 py-3 rounded-xl border border-cream-dark dark:border-coffee/30 bg-white dark:bg-dark-brown text-dark-brown dark:text-cream focus:ring-2 focus:ring-coffee focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-brown/70 dark:text-cream/70 mb-1">Kategori</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-cream-dark dark:border-coffee/30 bg-white dark:bg-dark-brown text-dark-brown dark:text-cream focus:ring-2 focus:ring-coffee focus:outline-none">
              {['Espresso', 'Latte', 'Specialty', 'Signature'].map(c => (<option key={c} value={c}>{c}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-brown/70 dark:text-cream/70 mb-1">Gambar Produk</label>
            <input type="file" accept="image/*" onChange={e => setForm({ ...form, image: e.target.files[0] })}
              className="w-full px-4 py-3 rounded-xl border border-cream-dark dark:border-coffee/30 bg-white dark:bg-dark-brown text-dark-brown dark:text-cream" />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={closeModal} className="flex-1 py-3 border border-cream-dark dark:border-coffee/30 rounded-xl text-dark-brown dark:text-cream hover:bg-cream dark:hover:bg-coffee/10">Batal</button>
            <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}
              className="flex-1 py-3 bg-coffee text-white rounded-xl font-medium hover:bg-coffee-light disabled:opacity-50">{editProduct ? 'Simpan' : 'Tambah'}</button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Hapus Produk" size="sm">
        <div className="text-center">
          <div className="text-5xl mb-4"><FiAlertTriangle className="w-12 h-12 text-amber-500 mx-auto" /></div>
          <p className="text-dark-brown/70 dark:text-cream/70 mb-6">Apakah Anda yakin ingin menghapus <strong>{deleteModal?.name}</strong>?</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteModal(null)} className="flex-1 py-3 border border-cream-dark dark:border-coffee/30 rounded-xl text-dark-brown dark:text-cream">Batal</button>
            <button onClick={() => deleteMutation.mutate(deleteModal.id)} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700">Hapus</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
