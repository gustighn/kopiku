import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import useAuthStore from '../store/useAuthStore';

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuthStore();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await registerUser({ name: data.name, email: data.email, password: data.password });
      toast.success(res.message);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Panel */}
      <div className="hidden lg:flex w-[420px] xl:w-[480px] flex-shrink-0 flex-col justify-between relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #00704A 0%, #004E31 50%, #1E3932 100%)' }}>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L30 60M0 30L60 30' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }} />
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-white/3 blur-3xl" />
        <div className="relative z-10 p-10 pt-14">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors mb-14">
            <FiArrowLeft className="w-4 h-4" /> Kembali ke Toko
          </Link>
          <img src="/logo.png" alt="Kopiku" className="h-10 w-auto mb-10 brightness-200" />
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight tracking-tight" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
            Mulai<br />Perjalananmu
          </h2>
          <p className="text-white/60 text-base leading-relaxed max-w-xs">
            Daftar sekarang dan nikmati kopi premium dari seluruh Nusantara langsung di rumah Anda.
          </p>
        </div>
        <div className="relative z-10 p-10">
          <div className="border border-white/10 bg-white/5 rounded-2xl p-6 backdrop-blur-sm">
            <p className="text-white/90 text-sm font-medium leading-relaxed mb-3">
              "Kopi terbaik dengan kualitas premium dan pengiriman super cepat."
            </p>
            <p className="text-white/40 text-xs">— Kopiku Team</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-5 py-12" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #f0fdf4 100%)' }}>
        <div className="w-full max-w-sm animate-fade-in">
          {/* Mobile: back link */}
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 text-[#6b7280] hover:text-[#00704A] text-sm mb-8 transition-colors">
            <FiArrowLeft className="w-4 h-4" /> Kembali
          </Link>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-[#1E3932] mb-3 tracking-tight">Buat Akun Baru</h1>
            <p className="text-[#6b7280] text-sm">Isi data berikut untuk mendaftar.</p>
          </div>

          <div className="bg-white rounded-3xl border border-[#d1e7dd] p-10 shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">Nama Lengkap</label>
                <input
                  {...register('name', { required: 'Nama wajib diisi' })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d1e7dd] bg-white text-[#1E3932] focus:ring-2 focus:ring-[#00704A]/30 focus:border-[#00704A]/40 focus:outline-none transition-all placeholder:text-[#9ca3af] text-sm"
                  placeholder="Nama lengkap kamu"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">Email</label>
                <input
                  type="email"
                  {...register('email', { required: 'Email wajib diisi', pattern: { value: /^\S+@\S+$/i, message: 'Email tidak valid' } })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d1e7dd] bg-white text-[#1E3932] focus:ring-2 focus:ring-[#00704A]/30 focus:border-[#00704A]/40 focus:outline-none transition-all placeholder:text-[#9ca3af] text-sm"
                  placeholder="nama@email.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    {...register('password', { required: 'Password wajib diisi', minLength: { value: 6, message: 'Password minimal 6 karakter' } })}
                    className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-[#d1e7dd] bg-white text-[#1E3932] focus:ring-2 focus:ring-[#00704A]/30 focus:border-[#00704A]/40 focus:outline-none transition-all placeholder:text-[#9ca3af] text-sm"
                    placeholder="Buat password (min. 6 karakter)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#00704A] transition-colors"
                  >
                    {showPass ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">Konfirmasi Password</label>
                <input
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Konfirmasi password wajib diisi',
                    validate: (val) => val === watch('password') || 'Password tidak cocok'
                  })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d1e7dd] bg-white text-[#1E3932] focus:ring-2 focus:ring-[#00704A]/30 focus:border-[#00704A]/40 focus:outline-none transition-all placeholder:text-[#9ca3af] text-sm"
                  placeholder="Ulangi password"
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5">{errors.confirmPassword.message}</p>}
              </div>

              <div className="flex items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 mt-0.5 rounded border-[#d1e7dd] text-[#00704A] focus:ring-[#00704A] flex-shrink-0"
                  required
                />
                <label htmlFor="terms" className="text-xs text-[#6b7280] leading-relaxed">
                  Saya setuju dengan{' '}
                  <a href="#" className="font-semibold text-[#00704A] hover:underline">Syarat & Ketentuan</a>
                  {' '}dan{' '}
                  <a href="#" className="font-semibold text-[#00704A] hover:underline">Kebijakan Privasi</a>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#00704A] text-white rounded-xl font-semibold hover:bg-[#004E31] transition-all disabled:opacity-50 text-sm flex items-center justify-center mt-2 shadow-md shadow-[#00704A]/20"
              >
                {loading ? 'Memproses...' : 'Buat Akun'}
              </button>
            </form>
          </div>

          <p className="text-center text-[#6b7280] mt-6 text-sm">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-[#00704A] font-semibold hover:underline">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
