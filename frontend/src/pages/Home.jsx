import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiArrowRight, FiCoffee, FiStar, FiDroplet, FiAward, FiZap, FiPackage, FiTruck, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/productService';
import { getImageUrl } from '../services/api';

const categories = [
  { name: 'Espresso', icon: <FiCoffee />, desc: 'Kopi pekat dan intens' },
  { name: 'Latte', icon: <FiDroplet />, desc: 'Kopi susu creamy' },
  { name: 'Specialty', icon: <FiStar />, desc: 'Kreasi unik pilihan' },
  { name: 'Signature', icon: <FiAward />, desc: 'Menu andalan kami' },
];

const testimonials = [
  { name: 'Akmal Adi Zero', text: 'Kopi Susu Gula Aren-nya juara! Manisnya pas, kopinya nendang. Pasti order lagi!', rating: 5 },
  { name: 'Hafiz Ilmu', text: 'Avocado Coffee ini unik banget. Perpaduan alpukat dan kopi yang sempurna. Recommended!', rating: 5 },
  { name: 'Zuanda Bekasi', text: 'Pengirimannya cepat, packagingnya rapi. Kopi Pandan Latte-nya harum dan enak banget.', rating: 4 },
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
      <section className="relative pt-40 md:pt-56 pb-20 md:pb-32 overflow-hidden bg-gray-50">
        <div className="container-page relative z-10">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Text content */}
            <div className="animate-fade-in text-center md:text-left flex flex-col items-center md:items-start">
              {/* Rewards Badge */}
              <div className="rewards-badge mb-6 inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-semibold">
                <FiStar className="w-4 h-4 text-green-700" />
                <span>KOPIKU REWARDS</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                Nikmati Kopi<br />Terbaik Hari Ini
              </h1>
              <p className="text-gray-500 text-base md:text-lg mb-10 max-w-md leading-relaxed">
                Pesan kopi favoritmu dengan mudah. Kualitas premium, rasa autentik, dan pengiriman cepat.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link to="/products" className="inline-flex items-center justify-center px-8 py-3.5 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors">
                  Belanja Sekarang
                </Link>
                <Link to="/products" className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-gray-900 border border-gray-200 rounded-full font-medium hover:bg-gray-50 transition-colors">
                  Lihat Menu
                </Link>
              </div>
            </div>

            {/* Right: Featured Product Spotlight */}
            <div className="hidden md:flex justify-center animate-slide-up relative">
              {featuredProduct ? (
                <div className="relative z-10 w-72 lg:w-80">
                  {/* Featured Item without background */}
                  <div className="p-4 lg:p-6 flex flex-col items-center text-center">
                    <div className="relative z-10 w-full">
                      {/* Navigation Arrows */}
                      {products.length > 1 && (
                        <div className="flex items-center justify-between mb-4">
                          <button
                            onClick={() => setFeaturedIdx(prev => prev === 0 ? products.length - 1 : prev - 1)}
                            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors shadow-sm"
                          >
                            <FiChevronLeft className="w-5 h-5 text-gray-700" />
                          </button>
                          <button
                            onClick={() => setFeaturedIdx(prev => (prev + 1) % products.length)}
                            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors shadow-sm"
                          >
                            <FiChevronRight className="w-5 h-5 text-gray-700" />
                          </button>
                        </div>
                      )}

                      {/* Product Image */}
                      <div className="flex justify-center mb-6">
                        <img
                          src={getImageUrl(featuredProduct.image)}
                          alt={featuredProduct.name}
                          className="w-56 h-56 lg:w-64 lg:h-64 object-contain transition-all duration-500"
                          style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))' }}
                        />
                      </div>

                      {/* Product Info */}
                      <h3 className="text-2xl lg:text-3xl font-bold text-[#1E3932] mb-3 leading-tight">{featuredProduct.name}</h3>

                      {/* Category Badge */}
                      <span className="inline-block px-4 py-1.5 rounded-full bg-[#00704A]/10 text-[#00704A] text-xs font-bold mb-5 tracking-wide uppercase">
                        {featuredProduct.category}
                      </span>

                      {/* Price */}
                      <div className="flex items-center justify-center gap-6 mb-6">
                        <span className="text-xl font-bold text-[#1E3932]">{formatPrice(featuredProduct.price)}</span>
                        <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                          <FaStar className="w-4 h-4 text-amber-400" />
                          <span className="text-amber-700 text-sm font-bold">{Number(featuredProduct.rating || 5).toFixed(1)}</span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Link
                        to={`/products/${featuredProduct.id}`}
                        className="block w-full text-center py-3.5 bg-[#00704A] text-white rounded-full font-bold text-sm hover:bg-[#004E31] transition-all shadow-lg shadow-[#00704A]/20 uppercase tracking-wider"
                      >
                        Lihat Detail
                      </Link>

                      {/* Dot indicators */}
                      {products.length > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                          {products.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setFeaturedIdx(i)}
                              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === featuredIdx ? 'bg-[#00704A] w-8' : 'bg-gray-300 hover:bg-gray-400'}`}
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
      <section className="bg-white py-16 md:py-24 border-b border-gray-100">
        <div className="container-page">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {features.map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-4 group">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-900 group-hover:bg-gray-100 transition-colors">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-gray-500 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="bg-gray-50 py-20 md:py-32">
        <div className="container-page">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Produk Populer</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Pilihan terbaik yang paling sering dipesan oleh pelanggan kami.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.slice(0, 4).map(product => <ProductCard key={product.id} product={product} />)}
          </div>
          <div className="mt-12 text-center">
            <Link to="/products" className="inline-flex items-center gap-2 px-8 py-3 border border-gray-200 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-50 transition-colors">
              Lihat Semua Produk <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="bg-white py-20 md:py-32">
        <div className="container-page">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Kategori Pilihan</h2>
            <p className="text-gray-500">Temukan kopi sesuai dengan seleramu.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map(cat => (
              <Link
                key={cat.name}
                to={`/products?category=${cat.name}`}
                className="bg-gray-50 rounded-3xl p-10 flex flex-col items-center justify-center text-center group hover:bg-[#f1f8f5] border border-transparent hover:border-[#d1e7dd] transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-white text-gray-900 mb-6 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  {cat.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{cat.name}</h3>
                <p className="text-gray-500 text-sm">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Promo Banner ── */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="container-page">
          <div className="rounded-3xl p-10 md:p-16 bg-gray-900 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Diskon 20% untuk Pesanan Pertamamu
            </h2>
            <p className="text-gray-400 mb-10 max-w-lg mx-auto text-lg">
              Gunakan kode promo di bawah ini saat checkout dan nikmati potongan harga spesial.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="bg-white/10 px-8 py-4 rounded-xl border border-white/20">
                <span className="text-2xl font-mono font-bold tracking-widest">KOPIKU17</span>
              </div>
              <Link to="/products" className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                Belanja Sekarang
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-white py-20 md:py-32">
        <div className="container-page">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Kata Mereka</h2>
            <p className="text-gray-500">Apa kata pelanggan tentang kopi kami.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-8 flex flex-col items-center text-center">
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <FaStar key={j} className={`w-4 h-4 ${j < t.rating ? 'text-gray-900' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-gray-600 mb-8 italic">"{t.text}"</p>
                <div className="mt-auto flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-900 font-medium mb-3">
                    {t.name.charAt(0)}
                  </div>
                  <p className="font-semibold text-gray-900">{t.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-gray-50 py-24 md:py-40 border-t border-gray-100">
        <div className="container-page">
          <div className="max-w-2xl mx-auto flex flex-col items-center justify-center text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[#1E3932] tracking-tight">
              Siap Menikmati Kopi Terbaik?
            </h2>
            <p className="text-gray-500 text-lg mb-10 max-w-lg mx-auto">
              Pesan sekarang dan rasakan kenikmatan kopi premium langsung di rumah Anda.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              Pesan Sekarang
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
