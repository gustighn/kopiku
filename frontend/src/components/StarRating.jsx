import { FaStar } from 'react-icons/fa';

export default function StarRating({ rating = 0, onRate, size = 'md' }) {
  const sizes = { sm: 'w-3 h-3', md: 'w-5 h-5', lg: 'w-7 h-7' };
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onRate?.(star)} className={onRate ? 'cursor-pointer hover:scale-125 transition-transform' : 'cursor-default'}>
          <FaStar className={`${sizes[size]} ${star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
        </button>
      ))}
    </div>
  );
}
