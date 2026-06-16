import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiMail, FiHeart } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="text-white/80" style={{ background: 'linear-gradient(180deg, #1E3932 0%, #152c27 100%)' }}>
      <div className="container-page py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <img src="/logo.png" alt="Kopiku" className="h-9 w-auto mb-5 brightness-200" />
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
              Nikmati kopi premium pilihan terbaik dari seluruh Nusantara. Dibuat dengan dedikasi untuk para pecinta kopi sejati.
            </p>
            <div className="flex gap-2">
              {[FiInstagram, FiTwitter, FiFacebook].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-[#00704A] hover:text-white transition-all duration-300">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-extrabold mb-5 text-xs uppercase tracking-widest text-[#a1c4b5]">Menu</h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Beranda' },
                { to: '/products', label: 'Semua Produk' },
                { to: '/products?category=Espresso', label: 'Espresso' },
                { to: '/products?category=Latte', label: 'Latte' },
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="text-white/50 hover:text-[#00704A] text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold mb-5 text-xs uppercase tracking-widest text-[#a1c4b5]">Layanan</h4>
            <ul className="space-y-3">
              {['Tentang Kami', 'Kontak', 'FAQ', 'Kebijakan Privasi'].map(item => (
                <li key={item}>
                  <a href="#" className="text-white/50 hover:text-[#00704A] text-sm transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-extrabold mb-5 text-xs uppercase tracking-widest text-[#a1c4b5]">Newsletter</h4>
            <p className="text-white/50 text-sm mb-4 leading-relaxed">Dapatkan info promo dan produk terbaru.</p>
            <div className="flex flex-col gap-2">
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
                <input
                  type="email"
                  placeholder="Email kamu..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:ring-2 focus:ring-[#00704A]/50 focus:border-[#00704A]/30"
                />
              </div>
              <button className="w-full py-2.5 bg-[#00704A] text-white rounded-full text-sm font-semibold hover:bg-[#1E9E6E] transition-all duration-300 hover:shadow-lg hover:shadow-[#00704A]/20">
                Kirim
              </button>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs">
            &copy; {new Date().getFullYear()} Kopiku. Hak cipta dilindungi.
          </p>
          <p className="text-white/15 text-xs">Dibuat dengan <FiHeart className="inline w-3.5 h-3.5 text-[#00704A] mx-1" /> untuk pecinta kopi</p>
        </div>
      </div>
    </footer>
  );
}
