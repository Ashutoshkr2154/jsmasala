// src/components/product/ProductCard.tsx
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Loader2 } from 'lucide-react';
import { Product } from '@/types/index.ts';
import { cn, formatPrice } from '@/utils/helpers.ts';
import { Button } from '@/components/common/Button.tsx';
import { RatingStars } from '@/components/common/RatingStars.tsx';

// Import React Query mutation hooks
import { useAddToCart } from '@/hooks/useCart.ts';
import { useToggleWishlist } from '@/hooks/useWishlist.ts';

// Import Zustand stores (for reading state or UI actions)
import { useCartStore } from '@/store/useCartStore.ts';
import { useWishlistStore } from '@/store/useWishlistStore.ts';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const addToCartMutation = useAddToCart();
  const openCartDrawer = useCartStore((state) => state.openCart);

  // Read state from the synced store
  const { isInWishlist } = useWishlistStore();
  const toggleWishlistMutation = useToggleWishlist();
  const isWishlisted = isInWishlist(product._id);

  // Safely access the first variant (backend should ensure array exists)
  const defaultVariant = product.variants?.[0]; 
  const isOutOfStock = !defaultVariant || defaultVariant.stock <= 0;

  // Add to Cart handler
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock || addToCartMutation.isPending || !defaultVariant) return; // Add check for defaultVariant

    addToCartMutation.mutate(
      { 
        productId: product._id, 
        variantId: defaultVariant._id, // Use the correct Mongoose subdoc ID
        quantity: 1 
      },
      { 
        onSuccess: () => openCartDrawer(),
        onError: (error) => {
            console.error("Failed to add item:", error);
            // This is where you would show a toast if the backend returned a 401
        }
      }
    );
  };

  // Wishlist handler
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (toggleWishlistMutation.isPending) return;

    toggleWishlistMutation.mutate(product._id, {
      onError: (error) => {
        console.error("Failed to toggle wishlist:", error);
      },
    });
  };

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-xl"
    >
      <div className="relative">
        <img
          src={product.images?.[0]?.url || '/images/placeholder-1.jpg'}
          alt={product.name}
          className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />

        {/* Wishlist Button */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-3 right-3 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
          onClick={handleWishlistClick}
          aria-label="Add to wishlist"
          disabled={toggleWishlistMutation.isPending && toggleWishlistMutation.variables === product._id}
        >
          {toggleWishlistMutation.isPending && toggleWishlistMutation.variables === product._id ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Heart
              className={cn("h-5 w-5", isWishlisted ? "text-red-500 fill-red-500" : "text-gray-700")}
            />
          )}
        </Button>

        {isOutOfStock && (
          <span className="absolute top-3 left-3 rounded-full bg-gray-900 px-3 py-1 text-sm font-semibold text-white">
            Out of Stock
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4">
        <p className="mb-1 text-xs font-medium uppercase text-gray-500">
          {product.category?.name || 'Category'}
        </p>
        <h3 className="mb-2 truncate text-lg font-heading font-bold text-brand-neutral">
          {product.name}
        </h3>
        <div className="mb-2 flex items-center gap-2">
          <RatingStars rating={product.rating} />
          <span className="text-sm text-gray-600">
            ({product.reviewsCount ?? 0})
          </span>
        </div>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-brand-accent">
              {defaultVariant ? formatPrice(defaultVariant.price) : 'N/A'}
            </span>
            {defaultVariant?.mrp && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                {formatPrice(defaultVariant.mrp)}
              </span>
            )}
          </div>

          <Button
            variant="primary"
            size="icon"
            className="h-10 w-10 shrink-0"
            onClick={handleAddToCart}
            // Disable if out of stock OR if mutation is already running
            disabled={isOutOfStock || addToCartMutation.isPending}
            aria-label="Add to cart"
          >
            {addToCartMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ShoppingBag className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </Link>
  );
}