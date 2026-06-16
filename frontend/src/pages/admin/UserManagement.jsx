import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiTrash2, FiSearch } from 'react-icons/fi';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getUsers, updateUserRole, deleteUser } from '../../services/adminService';

export default function UserManagement() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState(null);

  const { data, isLoading } = useQuery({ queryKey: ['admin-users'], queryFn: getUsers });
  const users = (data?.data?.data || []).filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  const roleMutation = useMutation({
    mutationFn: ({ id, role }) => updateUserRole(id, role),
    onSuccess: () => { toast.success('Role user diperbarui!'); queryClient.invalidateQueries(['admin-users']); },
    onError: (err) => toast.error(err.response?.data?.message || 'Gagal mengubah role')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteUser(id),
    onSuccess: () => { toast.success('User berhasil dihapus!'); queryClient.invalidateQueries(['admin-users']); setDeleteModal(null); },
    onError: (err) => toast.error(err.response?.data?.message || 'Gagal menghapus user')
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark-brown dark:text-cream mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>Manajemen Pengguna</h1>
      <div className="relative mb-6 max-w-md">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-brown/40 dark:text-cream/40" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari pengguna..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-cream-dark dark:border-coffee/30 bg-white dark:bg-dark-brown text-dark-brown dark:text-cream focus:ring-2 focus:ring-coffee focus:outline-none" />
      </div>
      <div className="bg-white dark:bg-dark-brown/50 rounded-2xl border border-cream-dark/30 dark:border-coffee/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream/50 dark:bg-coffee/10">
              <tr>{['Nama', 'Email', 'Role', 'Bergabung', 'Aksi'].map(h => (<th key={h} className="px-6 py-4 text-left text-xs font-semibold text-dark-brown/70 dark:text-cream/70 uppercase tracking-wider">{h}</th>))}</tr>
            </thead>
            <tbody className="divide-y divide-cream-dark/20 dark:divide-coffee/10">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-cream/30 dark:hover:bg-coffee/5">
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-coffee flex items-center justify-center text-white font-bold text-sm">{user.name?.charAt(0)}</div><span className="font-medium text-dark-brown dark:text-cream text-sm">{user.name}</span></div></td>
                  <td className="px-6 py-4 text-sm text-dark-brown/70 dark:text-cream/70">{user.email}</td>
                  <td className="px-6 py-4">
                    <select value={user.role} onChange={e => roleMutation.mutate({ id: user.id, role: e.target.value })}
                      className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-dark-brown/60 dark:text-cream/60">{new Date(user.created_at).toLocaleDateString('id-ID')}</td>
                  <td className="px-6 py-4">
                    {user.role !== 'admin' && (
                      <button onClick={() => setDeleteModal(user)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><FiTrash2 className="w-4 h-4" /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Hapus Pengguna" size="sm">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-dark-brown/70 dark:text-cream/70 mb-6">Yakin ingin menghapus <strong>{deleteModal?.name}</strong>?</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteModal(null)} className="flex-1 py-3 border border-cream-dark dark:border-coffee/30 rounded-xl">Batal</button>
            <button onClick={() => deleteMutation.mutate(deleteModal.id)} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium">Hapus</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
