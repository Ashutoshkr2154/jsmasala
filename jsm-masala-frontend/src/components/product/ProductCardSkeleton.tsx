import { SkeletonLoader } from '@/components/common/SkeletonLoader';

/**
 * A skeleton loader component that matches the layout of the ProductCard.
 * Used for loading states in product grids.
 */
export function ProductCardSkeleton() {
  return (
    <div className="group block overflow-hidden rounded-lg bg-white shadow-md">
      {/* Image Skeleton */}
      <SkeletonLoader className="h-56 w-full" />
      
      {/* Content Skeleton */}
      <div className="p-4">
        {/* Category Skeleton */}
        <SkeletonLoader className="mb-2 h-4 w-1/4" />
        
        {/* Product Name Skeleton */}
        <SkeletonLoader className="mb-3 h-6 w-3/4" />
        
        {/* Rating Skeleton */}
        <SkeletonLoader className="mb-4 h-5 w-1/2" />
        
        {/* Price & Button Skeleton */}
        <div className="flex items-center justify-between">
          <SkeletonLoader className="h-8 w-1/3" />
          <SkeletonLoader className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}