import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX, FiCoffee, FiChevronDown } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getProducts } from '../services/productService';

const categories = ['Espresso', 'Latte', 'Specialty', 'Signature'];

export default function Products() {
  const [searchParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const search = searchParams.get('search') || '';

  const { data, isLoading } = useQuery({
    queryKey: ['products', { search, category, sort, page }],
    queryFn: () => getProducts({ search, category, sort, page, limit: 12 })
  });

  const products = data?.data?.data || [];
  const pagination = data?.data?.pagination || {};

  const handleCategoryChange = (cat) => {
    setCategory(cat === category ? '' : cat);
    setPage(1);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <div className="pt-36 md:pt-48 pb-16 md:pb-20" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #e8f5ee 50%, #ffffff 100%)' }}>
        <div className="container-page">
          <h1 className="text-3xl md:text-4xl font-bold text-ink tracking-tight">
            {search ? `Hasil Pencarian: "${search}"` : 'Menu Kopi'}
          </h1>
          <p className="text-muted mt-2 text-sm md:text-base">
            {search ? `Menampilkan hasil untuk "${search}"` : 'Temukan kopi favorit kamu'}
          </p>
        </div>
      </div>

      <div className="container-page py-12 md:py-16">
        <div className="flex gap-8 lg:gap-10">
          {/* Filter Sidebar — Desktop */}
          <aside className="hidden lg:block w-56 xl:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              {/* Category */}
              <div>
                <h3 className="font-semibold text-ink mb-4 text-sm uppercase tracking-wider">Kategori</h3>
                <div className="space-y-1.5">
                  <button
                    onClick={() => handleCategoryChange('')}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all font-medium ${!category ? 'bg-primary text-white shadow-md' : 'text-body hover:bg-surface-soft'}`}
                  >
                    Semua
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all font-medium ${category === cat ? 'bg-primary text-white shadow-md' : 'text-body hover:bg-surface-soft'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="font-semibold text-ink mb-4 text-sm uppercase tracking-wider">Urutkan</h3>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={e => { setSort(e.target.value); setPage(1); }}
                    className="w-full px-4 py-2.5 rounded-xl border border-surface-strong bg-white text-ink text-sm font-medium focus:ring-2 focus:ring-primary/30 focus:border-primary/40 focus:outline-none appearance-none pr-8"
                  >
                    <option value="">Terbaru</option>
                    <option value="price_asc">Harga: Rendah ke Tinggi</option>
                    <option value="price_desc">Harga: Tinggi ke Rendah</option>
                    <option value="rating">Rating Tertinggi</option>
                    <option value="name">Nama A-Z</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                </div>
              </div>

              {/* Reset */}
              {(category || sort) && (
                <button
                  onClick={() => { setCategory(''); setSort(''); setPage(1); }}
                  className="flex items-center gap-2 text-sm font-medium text-[#6b7280] hover:text-red-500 transition-colors"
                >
                  <FiX className="w-4 h-4" /> Reset Filter
                </button>
              )}
            </div>
          </aside>

          {/* Mobile Filter FAB */}
          <button
            onClick={() => setFilterOpen(true)}
            className="lg:hidden fixed bottom-6 right-6 z-30 bg-primary text-white px-4 py-3 rounded-full shadow-xl hover:bg-primary-dark transition-all flex items-center gap-2 text-sm font-semibold"
          >
            <FiFilter className="w-4 h-4" /> Filter
          </button>

          {/* Mobile Filter Modal */}
          {filterOpen && (
            <div className="lg:hidden fixed inset-0 z-50" onClick={() => setFilterOpen(false)}>
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
              <div
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[75vh] overflow-y-auto animate-slide-up"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-ink">Filter & Urutkan</h3>
                  <button onClick={() => setFilterOpen(false)} className="p-2 hover:bg-surface-soft rounded-lg transition-colors">
                    <FiX className="w-5 h-5 text-ink" />
                  </button>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-ink text-sm mb-3">Kategori</h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleCategoryChange('')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!category ? 'bg-primary text-white' : 'bg-surface-soft text-body border border-surface-strong'}`}
                    >
                      Semua
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${category === cat ? 'bg-primary text-white' : 'bg-surface-soft text-body border border-surface-strong'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-ink text-sm mb-3">Urutkan</h4>
                  <select
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-surface-strong bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">Terbaru</option>
                    <option value="price_asc">Harga: Rendah ke Tinggi</option>
                    <option value="price_desc">Harga: Tinggi ke Rendah</option>
                    <option value="rating">Rating Tertinggi</option>
                  </select>
                </div>

                <button
                  onClick={() => setFilterOpen(false)}
                  className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm"
                >
                  Terapkan Filter
                </button>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {/* Active filters bar */}
            {(category || sort || search) && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-xs text-muted font-medium">Aktif:</span>
                {category && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-surface-soft border border-surface-strong text-primary text-xs rounded-full font-medium">
                    {category}
                    <button onClick={() => setCategory('')} className="ml-0.5 hover:text-red-500 transition-colors">
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {sort && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-surface-soft border border-surface-strong text-primary text-xs rounded-full font-medium">
                    {sort === 'price_asc' ? 'Harga Terendah' : sort === 'price_desc' ? 'Harga Terendah' : sort === 'rating' ? 'Rating Terbaik' : 'A-Z'}
                    <button onClick={() => setSort('')} className="ml-0.5 hover:text-red-500 transition-colors">
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {isLoading ? (
              <LoadingSpinner />
            ) : products.length === 0 ? (
              <div className="text-center py-20 rounded-2xl border border-[#d1e7dd]" style={{ background: 'linear-gradient(135deg, #f0fdf4, #e8f5ee)' }}>
                <FiCoffee className="w-12 h-12 mx-auto mb-4 text-[#00704A]/30" />
                <h3 className="text-xl font-bold text-[#1E3932] mb-2">Produk Tidak Ditemukan</h3>
                <p className="text-[#6b7280] text-sm">Coba ubah filter pencarian kamu</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted mb-5">{products.length} produk ditemukan</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-5">
                  {products.map(product => <ProductCard key={product.id} product={product} />)}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10">
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <button
                          key={i}
                          onClick={() => setPage(i + 1)}
                          className={`w-9 h-9 rounded-full text-sm font-semibold transition-all ${page === i + 1 ? 'bg-primary text-white shadow-md' : 'bg-surface-soft text-body hover:bg-surface-strong'}`}
                        >
                          {i + 1}
                        </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
