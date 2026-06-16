import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiUser, FiMenu, FiX, FiSearch, FiLogOut, FiSettings } from 'react-icons/fi';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, logout } = useAuthStore();
  const { totalItems } = useCartStore();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setUserMenuOpen(false); setSearchOpen(false); }, [location]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuOpen && !e.target.closest('[data-user-menu]')) setUserMenuOpen(false);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [userMenuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) { navigate(`/products?search=${searchQuery}`); setSearchOpen(false); setSearchQuery(''); }
  };

  const handleLogout = async () => { await logout(); navigate('/'); };

  const navLinks = [
    { to: '/', label: 'Beranda' },
    { to: '/products', label: 'Menu' },
    { to: '/products?category=Espresso', label: 'Espresso' },
    { to: '/products?category=Latte', label: 'Latte' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-md border-b border-[#e5e7eb]' : 'bg-white/80 backdrop-blur-md'}`}>
      <div className="container-page">
        <div className="flex items-center justify-between h-16 md:h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <img src="/logo.png" alt="Kopiku" className="h-10 w-auto transition-transform group-hover:scale-105" />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {navLinks.map(link => (
              <Link key={link.to + link.label} to={link.to}
                className={`px-6 py-2 rounded-full text-sm font-semibold tracking-wide uppercase transition-all duration-300 ${
                  (location.pathname === link.to || (location.pathname + location.search === link.to))
                    ? 'text-[#00704A] bg-[#00704A]/8'
                    : 'text-[#1E3932]/70 hover:text-[#00704A] hover:bg-[#00704A]/5'
                }`}
                style={{ letterSpacing: '0.12em', fontSize: '12px' }}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search Bar (centered) */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs mx-6">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari kopi..."
                className="w-full pl-4 pr-10 py-2 rounded-full border border-[#d1e7dd] bg-[#f1f8f5] text-[#1E3932] text-sm focus:outline-none focus:ring-2 focus:ring-[#00704A]/30 focus:border-[#00704A]/40 placeholder:text-[#6b7280] transition-all"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#00704A] hover:text-[#004E31] transition-colors">
                <FiSearch className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            {/* Mobile Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-[#00704A]/5 transition-colors text-[#1E3932]"
              aria-label="Cari produk"
            >
              <FiSearch className="w-[18px] h-[18px]" />
            </button>

            {/* Wishlist */}
            {isAuthenticated && (
              <Link to="/wishlist" className="p-2 rounded-full hover:bg-[#00704A]/5 transition-colors text-[#1E3932]" aria-label="Wishlist">
                <FiHeart className="w-[18px] h-[18px]" />
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="p-2 rounded-full hover:bg-[#00704A]/5 transition-colors relative text-[#1E3932] flex items-center gap-2" aria-label="Keranjang">
              <FiShoppingCart className="w-[18px] h-[18px]" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#00704A] text-white text-[10px] w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold animate-bounce-in">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Hamburger icon (visible on small screens) */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-[#00704A]/5 transition-colors text-[#1E3932] ml-1"
              aria-label="Menu"
            >
              {menuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative ml-1" data-user-menu>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-[#00704A]/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00704A] to-[#1E9E6E] flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-white text-xs font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
                  </div>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#e5e7eb] py-1.5 animate-slide-down z-50">
                    <div className="px-4 py-3 border-b border-[#e5e7eb]">
                      <p className="text-sm font-semibold text-[#1E3932] truncate">{user?.name}</p>
                      <p className="text-xs text-[#6b7280] truncate">{user?.email}</p>
                    </div>
                    <Link to="/orders" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-[#f1f8f5] text-[#374151] transition-colors">
                      <FiShoppingCart className="w-4 h-4 flex-shrink-0" /> Pesanan Saya
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-[#f1f8f5] text-[#374151] transition-colors">
                        <FiSettings className="w-4 h-4 flex-shrink-0" /> Dashboard Admin
                      </Link>
                    )}
                    <div className="border-t border-[#e5e7eb] mt-1 pt-1">
                      <button onClick={handleLogout} className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-red-50 text-red-600 w-full transition-colors">
                        <FiLogOut className="w-4 h-4 flex-shrink-0" /> Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-2 ml-2 px-5 py-2 bg-gradient-to-r from-[#00704A] to-[#1E9E6E] text-white rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-[#00704A]/20 transition-all duration-300 hover:scale-[1.02]"
              >
                <FiUser className="w-4 h-4" /> Masuk
              </Link>
            )}
          </div>
        </div>

        {/* Search Bar (Mobile) */}
        {searchOpen && (
          <div className="lg:hidden pb-3 animate-slide-down">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari kopi favorit..."
                autoFocus
                className="flex-1 px-4 py-2.5 rounded-full border border-[#d1e7dd] bg-[#f1f8f5] text-[#1E3932] text-sm focus:outline-none focus:ring-2 focus:ring-[#00704A]/30"
              />
              <button type="submit" className="px-5 py-2.5 bg-[#00704A] text-white rounded-full text-sm font-semibold hover:bg-[#004E31] transition-colors">
                Cari
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#e5e7eb] animate-slide-down">
          <div className="container-page py-4 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.to + link.label}
                to={link.to}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  (location.pathname === link.to || (location.pathname + location.search === link.to))
                    ? 'bg-[#00704A]/8 text-[#00704A] font-semibold'
                    : 'text-[#374151] hover:bg-[#f1f8f5]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="pt-2">
                <Link to="/login" className="block px-4 py-3 rounded-xl text-sm font-semibold bg-[#00704A] text-white text-center hover:bg-[#004E31] transition-colors">
                  Masuk
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
