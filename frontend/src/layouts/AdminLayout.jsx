import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiTag, FiMenu, FiArrowLeft, FiLogOut, FiX } from 'react-icons/fi';
import useAuthStore from '../store/useAuthStore';

const menuItems = [
  { to: '/admin', icon: FiGrid, label: 'Dashboard' },
  { to: '/admin/products', icon: FiPackage, label: 'Produk' },
  { to: '/admin/orders', icon: FiShoppingBag, label: 'Pesanan' },
  { to: '/admin/users', icon: FiUsers, label: 'Pengguna' },
  { to: '/admin/coupons', icon: FiTag, label: 'Kupon' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => { await logout(); navigate('/'); };

  const SidebarContent = ({ compact = false, onClose }) => (
    <>
      {/* Logo area */}
      <div className={`flex items-center border-b border-surface-strong ${compact ? 'p-4 justify-center' : 'p-5 gap-3'}`}>
        {!compact && (
          <span className="font-bold text-lg tracking-tight text-ink flex-1">Kopiku Admin</span>
        )}
        <button
          onClick={onClose || (() => setSidebarOpen(!sidebarOpen))}
          className="p-2 rounded-xl hover:bg-[#f1f8f5] transition-colors flex-shrink-0"
        >
          {onClose ? <FiX className="w-5 h-5 text-[#1E3932]" /> : <FiMenu className="w-5 h-5 text-[#1E3932]" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map(item => {
          const isActive = location.pathname === item.to ||
            (item.to !== '/admin' && location.pathname.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                ? 'bg-[#00704A] text-white shadow-md shadow-[#00704A]/20'
                : 'text-[#6b7280] hover:bg-[#f1f8f5] hover:text-[#00704A]'
              } ${compact ? 'justify-center' : ''}`}
              title={compact ? item.label : undefined}
            >
              <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
              {!compact && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className={`px-3 py-4 border-t border-[#d1e7dd] space-y-1`}>
        <Link
          to="/"
          onClick={onClose}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-[#6b7280] hover:bg-[#f1f8f5] hover:text-[#00704A] transition-colors ${compact ? 'justify-center' : ''}`}
          title={compact ? 'Kembali ke Toko' : undefined}
        >
          <FiArrowLeft className="w-4.5 h-4.5 flex-shrink-0" />
          {!compact && 'Kembali ke Toko'}
        </Link>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 w-full transition-colors ${compact ? 'justify-center' : ''}`}
          title={compact ? 'Keluar' : undefined}
        >
          <FiLogOut className="w-4.5 h-4.5 flex-shrink-0" />
          {!compact && 'Keluar'}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #f8faf9 50%, #f0fdf4 100%)' }}>
      {/* Desktop Sidebar */}
      <aside className={`
        hidden lg:flex flex-col fixed h-full z-40 bg-white border-r border-[#d1e7dd]
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'w-56 xl:w-64' : 'w-16'}
      `}>
        <SidebarContent compact={!sidebarOpen} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50" onClick={() => setMobileSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <aside
            className="absolute left-0 top-0 bottom-0 w-64 bg-white flex flex-col animate-slide-up shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <SidebarContent onClose={() => setMobileSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:ml-56 xl:ml-64' : 'lg:ml-16'}`}>
        {/* Topbar */}
        <header className="bg-white/90 backdrop-blur-md border-b border-[#d1e7dd] px-5 md:px-8 h-14 md:h-16 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-[#f1f8f5] transition-colors"
            >
              <FiMenu className="w-5 h-5 text-ink" />
            </button>
            <span className="text-sm font-semibold text-[#374151] hidden sm:block">
              {menuItems.find(m => m.to === location.pathname || (m.to !== '/admin' && location.pathname.startsWith(m.to)))?.label || 'Dashboard'}
            </span>
          </div>

          {/* User */}
          <div className="flex items-center gap-2.5">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-[#1E3932] leading-none">{user?.name}</p>
              <p className="text-xs text-[#9ca3af] mt-0.5">Admin</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-white text-xs font-bold">{user?.name?.charAt(0)}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 md:p-8 page-enter">
          <div className="max-w-screen-2xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
