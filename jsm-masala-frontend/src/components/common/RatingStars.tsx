import { Star } from 'lucide-react';
import { cn } from '@/utils/helpers.ts';

type RatingStarsProps = {
  rating: number;
  className?: string;
  starSize?: number;
};

/**
 * Displays a 5-star rating, handling full, half, and empty stars.
 */
export function RatingStars({
  rating,
  className,
  starSize = 16,
}: RatingStarsProps) {
  const stars = Array.from({ length: 5 }, (_, index) => {
    const starValue = index + 1;
    let fillPercent = 0;

    if (rating >= starValue) {
      fillPercent = 100; // Full star
    } else if (rating > index && rating < starValue) {
      fillPercent = (rating - index) * 100; // Partial star
    }

    return (
      <div key={index} className="relative" style={{ width: starSize, height: starSize }}>
        {/* Background (empty) star */}
        <Star
          className="text-gray-300"
          fill="currentColor"
          style={{ width: starSize, height: starSize }}
        />
        {/* Foreground (filled) star */}
        <div
          className="absolute top-0 left-0 h-full overflow-hidden"
          style={{ width: `${fillPercent}%` }}
        >
          <Star
            className="text-yellow-400"
            fill="currentColor"
            style={{ width: starSize, height: starSize }}
          />
        </div>
      </div>
    );
  });

  return (
    <div className={cn('flex items-center gap-0.5', className)}>{stars}</div>
  );
}