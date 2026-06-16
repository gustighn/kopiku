import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiArrowRight, FiCoffee, FiStar, FiDroplet, FiAward, FiZap, FiPackage, FiTruck, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/productService';

const categories = [
  { name: 'Espresso', icon: <FiCoffee />, desc: 'Kopi pekat dan intens' },
  { name: 'Latte', icon: <FiDroplet />, desc: 'Kopi susu creamy' },
  { name: 'Specialty', icon: <FiStar />, desc: 'Kreasi unik pilihan' },
  { name: 'Signature', icon: <FiAward />, desc: 'Menu andalan kami' },
];

const testimonials = [
  { name: 'Rina Pratiwi', text: 'Kopi Susu Gula Aren-nya juara! Manisnya pas, kopinya nendang. Pasti order lagi!', rating: 5 },
  { name: 'Budi Santoso', text: 'Avocado Coffee ini unik banget. Perpaduan alpukat dan kopi yang sempurna. Recommended!', rating: 5 },
  { name: 'Dewi Ayu', text: 'Pengirimannya cepat, packagingnya rapi. Kopi Pandan Latte-nya harum dan enak banget.', rating: 4 },
];

const features = [
  { icon: <FiCoffee className="w-5 h-5" />, title: 'Kualitas Tinggi', desc: 'Biji kopi premium' },
  { icon: <FiZap className="w-5 h-5" />, title: 'Baru Disangrai', desc: 'Rasa terbaik' },
  { icon: <FiPackage className="w-5 h-5" />, title: 'Kemasan Aman', desc: 'Tetap segar' },
  { icon: <FiTruck className="w-5 h-5" />, title: 'Pengiriman Cepat', desc: 'Sampai di pintu' },
];

export default function Home() {
  const { data: productsData } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => getProducts({ sort: 'rating', limit: 5 })
  });
  const products = productsData?.data?.data || [];
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const featuredProduct = products[featuredIdx] || null;

  // Auto-rotate featured product
  useEffect(() => {
    if (products.length <= 1) return;
    const timer = setInterval(() => {
      setFeaturedIdx(prev => (prev + 1) % products.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [products.length]);

  const formatPrice = (price) => 'Rp ' + Number(price).toLocaleString('id-ID');

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative hero-top pb-24 md:pb-32 overflow-hidden" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #e8f5ee 30%, #ffffff 70%, #f0fdf4 100%)' }}>
        {/* Decorative Circles */}
        <div className="hero-circle hero-circle-lg" style={{ top: '-100px', right: '-100px', background: 'rgba(0,112,74,0.05)' }} />
        <div className="hero-circle hero-circle-md" style={{ bottom: '-50px', left: '10%', background: 'rgba(0,112,74,0.04)' }} />
        <div className="hero-circle hero-circle-sm" style={{ top: '20%', left: '5%', background: 'rgba(0,112,74,0.03)' }} />
        <div className="hero-circle" style={{ width: '400px', height: '400px', top: '10%', right: '15%', background: 'rgba(0,112,74,0.04)' }} />

        <div className="container-page relative z-10">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: Text content */}
            <div className="animate-fade-in text-center md:text-left">
              {/* Rewards Badge */}
              <div className="rewards-badge mb-6 inline-flex">
                <FiStar className="w-4 h-4 text-[#00704A]" />
                <span>KOPIKU REWARDS</span>
              </div>

              <h1 className="heading-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-5 leading-[1.05] tracking-tight">
                Waktu Paling<br />Nikmat dalam<br />Tahun Ini
              </h1>
              <p className="text-[#6b7280] text-base md:text-lg mb-8 max-w-md mx-auto md:mx-0 leading-relaxed">
                Daftar untuk akses eksklusif promo minuman di musim ini. Nikmati kopi terbaik untuk momen spesialmu.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Link to="/products" className="btn-primary-green inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm">
                  Belanja Sekarang <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/products" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-[#00704A] border-2 border-[#00704A]/20 rounded-xl font-semibold text-sm hover:bg-[#f1f8f5] hover:border-[#00704A]/40 transition-all">
                  Lihat Menu
                </Link>
              </div>
            </div>

            {/* Right: Featured Product Spotlight */}
            <div className="hidden md:flex justify-center animate-slide-up relative">
              {/* Background decorative circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] lg:w-[440px] lg:h-[440px] rounded-full" style={{ background: 'rgba(0,112,74,0.06)' }} />

              {featuredProduct ? (
                <div className="relative z-10 w-72 lg:w-80">
                  {/* Featured Card */}
                  <div className="product-card-featured p-6 lg:p-8 shadow-2xl shadow-[#00704A]/20">
                    <div className="relative z-10">
                      {/* Navigation Arrows */}
                      {products.length > 1 && (
                        <div className="flex items-center justify-between mb-4">
                          <button
                            onClick={() => setFeaturedIdx(prev => prev === 0 ? products.length - 1 : prev - 1)}
                            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                          >
                            <FiChevronLeft className="w-5 h-5 text-white" />
                          </button>
                          <button
                            onClick={() => setFeaturedIdx(prev => (prev + 1) % products.length)}
                            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                          >
                            <FiChevronRight className="w-5 h-5 text-white" />
                          </button>
                        </div>
                      )}

                      {/* Product Image */}
                      <div className="flex justify-center mb-5">
                        <img
                          src={`/uploads/products/${featuredProduct.image}`}
                          alt={featuredProduct.name}
                          className="w-44 h-44 lg:w-52 lg:h-52 object-contain drop-shadow-2xl transition-all duration-500"
                          style={{ filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.3))' }}
                        />
                      </div>

                      {/* Product Info */}
                      <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 leading-tight">{featuredProduct.name}</h3>

                      {/* Category Badge */}
                      <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-white/90 text-xs font-medium mb-4">
                        {featuredProduct.category}
                      </span>

                      {/* Price */}
                      <div className="flex items-center justify-between mb-5">
                        <span className="text-lg font-bold text-white">{formatPrice(featuredProduct.price)}</span>
                        <div className="flex items-center gap-1">
                          <FaStar className="w-3.5 h-3.5 text-amber-300" />
                          <span className="text-white/80 text-sm font-medium">{Number(featuredProduct.rating || 5).toFixed(1)}</span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Link
                        to={`/products/${featuredProduct.id}`}
                        className="block w-full text-center py-3 bg-white text-[#00704A] rounded-full font-bold text-sm hover:bg-gray-50 transition-all shadow-lg uppercase tracking-wider"
                      >
                        Lihat Detail
                      </Link>

                      {/* Dot indicators */}
                      {products.length > 1 && (
                        <div className="flex justify-center gap-1.5 mt-4">
                          {products.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setFeaturedIdx(i)}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === featuredIdx ? 'bg-white w-6' : 'bg-white/30 hover:bg-white/50'}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-72 h-96 rounded-3xl bg-[#00704A]/10 animate-pulse" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Bar ── */}
      <section className="bg-white border-y border-[#e5e7eb]">
        <div className="container-page py-14 md:py-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-[#f1f8f5] border border-[#d1e7dd] flex items-center justify-center text-xl flex-shrink-0 text-[#00704A] group-hover:bg-[#00704A] group-hover:text-white group-hover:border-[#00704A] transition-all duration-300">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-extrabold text-[#1E3932] text-sm leading-snug">{feature.title}</h4>
                  <p className="text-[#6b7280] text-xs mt-0.5 font-medium">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="bg-white">
        <div className="container-page py-24 md:py-32 lg:py-36">
          <div className="flex items-end justify-between mb-12 md:mb-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#00704A] mb-2.5">Pilihan Kami</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E3932] tracking-tight">Produk Populer</h2>
            </div>
            <Link to="/products" className="text-sm font-bold text-[#00704A] hover:text-[#004E31] flex items-center gap-1.5 transition-colors whitespace-nowrap">
              Lihat Semua <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {products.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #e8f5ee 50%, #f0fdf4 100%)' }} className="border-y border-[#d1e7dd]">
        <div className="container-page py-24 md:py-32 lg:py-36">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-[#00704A] mb-2.5">Pilihan Rasa</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E3932] tracking-tight">Kategori Produk</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {categories.map(cat => (
              <Link
                key={cat.name}
                to={`/products?category=${cat.name}`}
                className="bg-white border border-[#e5e7eb] rounded-3xl p-8 text-center group hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#00704A]/6 hover:border-[#00704A]/25 transition-all duration-450"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#f1f8f5] border border-[#d1e7dd]/60 text-[#00704A] text-2.5xl mb-5 flex items-center justify-center group-hover:bg-[#00704A] group-hover:text-white group-hover:border-[#00704A] group-hover:scale-105 transition-all duration-300">
                  {cat.icon}
                </div>
                <h3 className="text-base font-extrabold mb-1.5 text-[#1E3932]">{cat.name}</h3>
                <p className="text-[#6b7280] text-xs font-medium leading-relaxed">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Promo Banner ── */}
      <section className="bg-white">
        <div className="container-page py-24 md:py-32 lg:py-36">
          <div className="rounded-3xl p-8 md:p-12 lg:p-16 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #00704A 0%, #004E31 50%, #1E3932 100%)' }}>
            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L30 60M0 30L60 30' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat'
            }} />
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/3 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-xl">
              <span className="inline-flex bg-white/10 border border-white/15 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full uppercase tracking-widest mb-5">
                Promo Spesial
              </span>
              <h2 className="heading-serif text-3xl md:text-4xl lg:text-5xl mt-0 mb-3 leading-tight tracking-tight" style={{ color: 'white' }}>
                Diskon 20%<br />untuk Pelanggan Baru!
              </h2>
              <p className="text-white/70 text-base md:text-lg mb-8">Gunakan kode kupon di bawah ini saat checkout:</p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="bg-white border-2 border-dashed border-[#00704A] text-[#00704A] rounded-2xl px-6 py-3 shadow-md flex items-center justify-center">
                  <span className="text-lg md:text-xl font-black tracking-[0.15em] font-mono">WELCOME20</span>
                </div>
                <Link to="/products" className="px-7 py-3.5 bg-white text-[#00704A] rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center">
                  Belanja Sekarang
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #e8f5ee 50%, #f0fdf4 100%)' }} className="border-t border-[#d1e7dd]">
        <div className="container-page py-24 md:py-32 lg:py-36">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-[#00704A] mb-2.5">Testimoni</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E3932] tracking-tight">Kata Mereka</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 md:p-10 border border-[#e5e7eb] flex flex-col items-center hover:shadow-2xl hover:shadow-[#00704A]/5 hover:border-[#00704A]/10 transition-all duration-400 relative overflow-hidden">
                {/* Custom watermark quote icon */}
                <span className="absolute top-4 left-6 text-7xl font-serif text-[#00704A]/5 pointer-events-none select-none">“</span>
                <div className="flex justify-center gap-1 mb-5 relative z-10">
                  {[...Array(5)].map((_, j) => (
                    <FaStar key={j} className={`w-4 h-4 ${j < t.rating ? 'text-amber-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <p className="text-[#374151] text-sm md:text-base leading-relaxed flex-1 mb-6 text-center italic relative z-10 font-medium">"{t.text}"</p>
                <div className="flex flex-col items-center mt-auto relative z-10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00704A] to-[#1E9E6E] flex items-center justify-center text-white text-base font-extrabold flex-shrink-0 mb-3 shadow-md shadow-[#00704A]/15 border-2 border-white">
                    {t.name.charAt(0)}
                  </div>
                  <p className="font-extrabold text-[#1E3932] text-sm">{t.name}</p>
                  <p className="text-[#6b7280] text-[10px] font-bold tracking-wider uppercase mt-1">Pelanggan Setia</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-white border-t border-[#e5e7eb]">
        <div className="container-page py-24 md:py-32 lg:py-36">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="heading-serif text-3xl md:text-4xl lg:text-5xl mb-6 tracking-tight">
              Siap Menikmati Kopi Terbaik?
            </h2>
            <p className="text-[#6b7280] text-base md:text-lg mb-9 max-w-lg mx-auto leading-relaxed">
              Pesan sekarang dan rasakan kenikmatan kopi premium langsung di rumah Anda.
            </p>
            <Link
              to="/products"
              className="btn-primary-green inline-flex items-center gap-2 px-9 py-4 text-sm rounded-full shadow-lg hover:shadow-xl active:scale-[0.98]"
            >
              Pesan Sekarang <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
