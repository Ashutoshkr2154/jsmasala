// src/pages/WishlistPage.tsx
import { Link } from 'react-router-dom';
import { Seo } from '@/components/common/Seo.tsx';
import { Button } from '@/components/common/Button.tsx';
import { ProductCard } from '@/components/product/ProductCard.tsx';
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton.tsx';
import { useWishlist } from '@/hooks/useWishlist.ts'; // 1. Import the hook
import { Loader2, XCircle, Heart } from 'lucide-react'; // Import icons

export default function WishlistPage() {
  // 2. Fetch wishlist data using the hook
  const { data: wishlistData, isLoading, isError, error } = useWishlist();

  // Get the products array (it's inside wishlistData.products)
  const products = wishlistData?.products || [];

  return (
    <>
      <Seo
        title="Your Wishlist"
        description="View and manage the products you've saved for later."
      />
      <div className="container py-12">
        <h1 className="text-3xl lg:text-4xl font-extrabold font-heading mb-8">
          Your Wishlist
        </h1>

        {/* 3. Handle Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[400px]">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* 4. Handle Error State */}
        {isError && !isLoading && (
          <div className="text-center py-20 text-red-600 min-h-[400px]">
            <XCircle className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold">Error Loading Wishlist</h1>
            <p className="mt-2 text-lg">Could not fetch your wishlist. Please try refreshing.</p>
            {import.meta.env.DEV && <pre className="mt-4 text-xs text-left">{error?.message}</pre>}
          </div>
        )}

        {/* 5. Handle Empty State */}
        {!isLoading && !isError && products.length === 0 && (
          <div className="text-center py-20 rounded-lg border bg-white min-h-[400px] flex flex-col justify-center items-center">
            <Heart className="h-20 w-20 mx-auto text-gray-300 mb-4" />
            <h2 className="mt-6 text-2xl font-semibold">Your wishlist is empty</h2>
            <p className="mt-2 text-gray-500">
              See a spice you like? Click the heart icon to save it for later.
            </p>
            <Button to="/shop" className="mt-8">
              Discover Spices
            </Button>
          </div>
        )}

        {/* 6. Display Wishlist Items */}
        {!isLoading && !isError && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              // The ProductCard itself handles the remove (toggle) functionality
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}