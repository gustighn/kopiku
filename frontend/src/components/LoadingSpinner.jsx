export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-[#d1e7dd]"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#00704A] animate-spin"></div>
      </div>
      <p className="text-[#1E3932]/60 text-sm animate-pulse">Memuat...</p>
    </div>
  );
}
