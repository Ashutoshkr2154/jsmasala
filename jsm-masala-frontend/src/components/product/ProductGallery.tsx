import { useState } from 'react';
import { cn } from '@/utils/helpers';
import { SkeletonLoader } from '../common/SkeletonLoader';

type ProductGalleryProps = {
  images: string[];
  productName: string;
};

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  if (!images || images.length === 0) {
    return <SkeletonLoader className="w-full h-96 rounded-lg" />;
  }

  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pr-2">
        {images.map((image, index) => (
          <button
            key={index}
            className={cn(
              'h-20 w-20 flex-shrink-0 rounded-lg border overflow-hidden transition-all',
              mainImage === image
                ? 'border-brand-primary ring-2 ring-brand-primary'
                : 'border-gray-200 hover:border-gray-400',
            )}
            onClick={() => setMainImage(image)}
            aria-label={`View image ${index + 1} of ${productName}`}
          >
            <img
              src={image}
              alt={`${productName} thumbnail ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1">
        <img
          src={mainImage}
          alt={productName}
          className="h-auto w-full max-h-[500px] object-contain rounded-lg shadow-md"
        />
      </div>
    </div>
  );
}