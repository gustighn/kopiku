import { useQuery } from '@tanstack/react-query';
import { FiPackage, FiUsers, FiShoppingBag, FiTrendingUp } from 'react-icons/fi';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getDashboard, getAnalytics } from '../../services/adminService';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const formatPrice = (p) => 'Rp ' + Number(p).toLocaleString('id-ID');

export default function Dashboard() {
  const { data: dashData, isLoading: dashLoading } = useQuery({ queryKey: ['admin-dashboard'], queryFn: getDashboard });
  const { data: analyticsData } = useQuery({ queryKey: ['admin-analytics'], queryFn: getAnalytics });

  const stats = dashData?.data?.data || {};
  const analytics = analyticsData?.data?.data || {};

  if (dashLoading) return <LoadingSpinner />;

  const statCards = [
    { icon: FiPackage, label: 'Total Produk', value: stats.totalProducts || 0, bg: 'bg-blue-50', iconColor: 'text-blue-600', border: 'border-blue-100' },
    { icon: FiUsers, label: 'Total Pengguna', value: stats.totalUsers || 0, bg: 'bg-purple-50', iconColor: 'text-purple-600', border: 'border-purple-100' },
    { icon: FiShoppingBag, label: 'Total Transaksi', value: stats.totalOrders || 0, bg: 'bg-amber-50', iconColor: 'text-amber-600', border: 'border-amber-100' },
    { icon: FiTrendingUp, label: 'Total Pendapatan', value: formatPrice(stats.totalRevenue || 0), bg: 'bg-green-50', iconColor: 'text-green-600', border: 'border-green-100' },
  ];

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#111111', titleColor: '#fff', bodyColor: '#a1a1aa', cornerRadius: 8 }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#f3f4f6' }, ticks: { color: '#9ca3af', font: { size: 11 } } },
      x: { grid: { display: false }, ticks: { color: '#9ca3af', font: { size: 11 } } }
    }
  };

  const dailySalesChart = {
    labels: (analytics.dailySales || []).map(d => new Date(d.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })),
    datasets: [{
      label: 'Pendapatan', data: (analytics.dailySales || []).map(d => d.revenue), fill: true,
      borderColor: '#111111', backgroundColor: 'rgba(17,17,17,0.05)', tension: 0.4, borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#111111'
    }]
  };

  const topProductsChart = {
    labels: (analytics.topProducts || []).map(p => p.product?.name || 'Unknown'),
    datasets: [{
      label: 'Terjual', data: (analytics.topProducts || []).map(p => p.total_sold),
      backgroundColor: '#111111', borderRadius: 6, barThickness: 20
    }]
  };

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const monthlyRevenueChart = {
    labels: (analytics.monthlyRevenue || []).map(m => monthNames[(m.month || 1) - 1]),
    datasets: [{
      label: 'Pendapatan', data: (analytics.monthlyRevenue || []).map(m => m.revenue),
      backgroundColor: '#111111', borderRadius: 6, barThickness: 24
    }]
  };

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-[#111111] tracking-tight">Dashboard</h1>
        <p className="text-[#6b7280] text-sm mt-1">Ringkasan performa toko Anda</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {statCards.map((card, i) => (
          <div key={i} className={`bg-white rounded-2xl p-5 border border-[#e5e7eb]`}>
            <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.border} border flex items-center justify-center mb-4`}>
              <card.icon className={`w-5 h-5 ${card.iconColor}`} />
            </div>
            <p className="text-xl font-bold text-[#111111] leading-none mb-1">{card.value}</p>
            <p className="text-[#9ca3af] text-xs font-medium">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb]">
          <h3 className="font-semibold text-[#111111] mb-5 text-sm">Penjualan 30 Hari Terakhir</h3>
          <Line data={dailySalesChart} options={chartOptions} />
        </div>
        <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb]">
          <h3 className="font-semibold text-[#111111] mb-5 text-sm">Produk Terlaris</h3>
          <Bar data={topProductsChart} options={chartOptions} />
        </div>
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#e5e7eb]">
          <h3 className="font-semibold text-[#111111] mb-5 text-sm">Pendapatan Bulanan</h3>
          <Bar data={monthlyRevenueChart} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
