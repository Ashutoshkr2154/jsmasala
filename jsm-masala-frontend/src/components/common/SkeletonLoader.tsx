import { cn } from '@/utils/helpers';

type SkeletonLoaderProps = {
  className?: string;
};

/**
 * A simple, reusable skeleton loader component
 * with a pulsing animation.
 */
export function SkeletonLoader({ className }: SkeletonLoaderProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-gray-200',
        className,
      )}
    />
  );
}