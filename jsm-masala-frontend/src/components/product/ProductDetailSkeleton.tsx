// src/components/product/ProductDetailSkeleton.tsx
import { SkeletonLoader } from '@/components/common/SkeletonLoader.tsx';

/**
 * A skeleton loader that mimics the Product Detail Page layout
 * for a better loading experience.
 */
export function ProductDetailSkeleton() {
  return (
    <div className="container py-12">
      {/* Breadcrumbs Skeleton */}
      <SkeletonLoader className="h-5 w-1/3 mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Left Column (Gallery) */}
        <div className="flex flex-col-reverse md:flex-row gap-4">
          <div className="flex md:flex-col gap-3">
            <SkeletonLoader className="h-20 w-20 rounded-lg flex-shrink-0" />
            <SkeletonLoader className="h-20 w-20 rounded-lg flex-shrink-0" />
            <SkeletonLoader className="h-20 w-20 rounded-lg flex-shrink-0" />
          </div>
          <div className="flex-1">
            {/* Main image */}
            <SkeletonLoader className="w-full h-96 max-h-[500px] rounded-lg" />
          </div>
        </div>

        {/* Right Column (Info) */}
        <div className="flex flex-col">
          <SkeletonLoader className="h-10 w-4/5 mb-3" /> {/* Name */}
          <SkeletonLoader className="h-6 w-1/3 mb-4" /> {/* Rating */}
          <SkeletonLoader className="h-5 w-3/4 mb-6" /> {/* Short Desc */}

          <SkeletonLoader className="h-5 w-1/4 mb-2" /> {/* Variant Title */}
          <div className="flex gap-3 mb-6">
            <SkeletonLoader className="h-16 w-20 rounded-lg" />
            <SkeletonLoader className="h-16 w-20 rounded-lg" />
            <SkeletonLoader className="h-16 w-20 rounded-lg" />
          </div>

          <SkeletonLoader className="h-10 w-1/3 mb-6" /> {/* Price */}

          {/* Stepper & Add to Cart Button */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <SkeletonLoader className="h-12 w-32 rounded-lg" /> {/* Stepper */}
            <SkeletonLoader className="h-12 flex-1 w-full sm:w-auto rounded-lg" /> {/* Button */}
          </div>

          {/* Wishlist Button Skeleton */}
          <SkeletonLoader className="h-12 w-full sm:w-auto rounded-lg mt-4 max-w-[200px]" />

          {/* Trust Badges Skeleton */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border space-y-3">
             <SkeletonLoader className="h-6 w-3/4" />
             <SkeletonLoader className="h-6 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}