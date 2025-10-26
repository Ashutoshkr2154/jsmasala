// src/pages/ProductDetailPage.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import Link
import { Heart, CheckCircle, Shield, XCircle, Loader2 } from 'lucide-react';

import { ProductVariant, Product } from '@/types/index.ts';
import { useProductByIdOrSlug } from '@/hooks/useProducts.ts';
import { useAddToCart } from '@/hooks/useCart.ts';
import { useCartStore } from '@/store/useCartStore.ts';
import { useToggleWishlist } from '@/hooks/useWishlist.ts';
import { useWishlistStore } from '@/store/useWishlistStore.ts';

import { Seo } from '@/components/common/Seo.tsx';
import { Breadcrumbs } from '@/components/common/Breadcrumbs.tsx';
import { Button } from '@/components/common/Button.tsx';
import { RatingStars } from '@/components/common/RatingStars.tsx';
import { QuantityStepper } from '@/components/common/QuantityStepper.tsx';
import { ProductGallery } from '@/components/product/ProductGallery.tsx';
import { VariantSelector } from '@/components/product/VariantSelector.tsx';
import { ProductDetailSkeleton } from '@/components/product/ProductDetailSkeleton.tsx';
import { formatPrice, cn } from '@/utils/helpers.ts';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  
  // --- 1. ALL HOOKS ARE CALLED AT THE TOP ---
  const { data: product, isLoading, isError, error } = useProductByIdOrSlug(slug);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const addToCartMutation = useAddToCart();
  const openCartDrawer = useCartStore((state) => state.openCart);
  const { isInWishlist } = useWishlistStore();
  const toggleWishlistMutation = useToggleWishlist();

  // --- 2. ALL EFFECTS ARE CALLED AT THE TOP ---
  
  // Effect 1: Set default variant when product loads
  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      const inStockVariant = product.variants.find(v => v.stock > 0);
      setSelectedVariant(inStockVariant || product.variants[0]);
      setQuantity(1); // Reset quantity
    } else {
      setSelectedVariant(null);
    }
  }, [product]); // Runs when product data changes

  // Effect 2: Adjust quantity based on selected variant's stock
  // This hook is now placed *before* any conditional returns, fixing the error.
  useEffect(() => {
      if (selectedVariant) {
          const maxStock = selectedVariant.stock;
          if (quantity > maxStock && maxStock > 0) {
              setQuantity(maxStock);
          } else if (maxStock === 0 && quantity !== 1) {
              setQuantity(1); // Reset to 1 if variant goes out of stock
          }
      }
  }, [selectedVariant, quantity]); // Runs when selectedVariant or quantity changes

  // --- 3. ALL HANDLERS ARE DEFINED AT THE TOP ---
  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariant || selectedVariant.stock <= 0 || addToCartMutation.isPending) return;
    addToCartMutation.mutate(
      { productId: product._id, variantId: selectedVariant._id, quantity: quantity },
      { onSuccess: () => openCartDrawer() }
    );
  };

  const handleWishlistClick = () => {
    if (!product || toggleWishlistMutation.isPending) return;
    toggleWishlistMutation.mutate(product._id, {
      onError: (err) => console.error("Failed to toggle wishlist:", err),
    });
  };

  // --- 4. CONDITIONAL RETURNS (LOADING/ERROR) COME *AFTER* ALL HOOKS ---
  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (isError || !product) {
    return (
      <div className="container py-20 text-center">
        <XCircle className="h-16 w-16 mx-auto text-red-500" />
        <h1 className="mt-4 text-3xl font-bold">Product Not Found</h1>
        <p className="mt-2 text-lg text-gray-600">
          This product is unavailable or the link you followed is invalid.
        </p>
        {/* We use `asChild` prop on Button to make it render as a Link */}
        <Button asChild className="mt-6">
          <Link to="/shop">Back to Shop</Link>
        </Button>
      </div>
    );
  }

  // --- 5. RENDER LOGIC (SAFE TO RUN) ---
  // Derived state is calculated *after* the early returns
  const isWishlisted = isInWishlist(product._id);
  const isOutOfStock = !selectedVariant || selectedVariant.stock <= 0;
  const maxQuantity = selectedVariant ? selectedVariant.stock : 1;

  return (
    <>
      <Seo
        title={product.name}
        description={product.shortDescription || product.description.substring(0, 160)}
      />
      <div className="container py-12">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Shop', href: '/shop' },
            { name: product.category?.name || 'Category', href: `/shop?category=${product.category?.slug || ''}` },
            { name: product.name },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Left Column: Image Gallery */}
          <ProductGallery images={product.images?.map(img => img.url) || []} productName={product.name} />

          {/* Right Column: Product Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl lg:text-4xl font-extrabold font-heading mb-3">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-4">
              <RatingStars rating={product.rating} starSize={20} />
              <span className="text-sm text-gray-600">({product.reviewsCount ?? 0} reviews)</span>
            </div>

            <p className="text-lg text-gray-600 mb-6">
              {product.shortDescription || '...'}
            </p>

            <VariantSelector
                variants={product.variants}
                selectedVariantId={selectedVariant?._id || ''}
                onSelectVariant={handleVariantSelect}
            />

            <div className="mt-4 mb-2">
              {isOutOfStock ? (
                <p className="text-lg font-semibold text-red-600">
                  Currently Out of Stock — Check back soon!
                </p>
              ) : selectedVariant && selectedVariant.stock < 10 ? (
                 <p className="text-lg font-semibold text-orange-600">
                   Low Stock (Only {selectedVariant.stock} left!)
                 </p>
              ) : (
                <p className="text-lg font-semibold text-green-700">
                  In Stock
                </p>
              )}
            </div>

            <div className="mt-4 mb-6">
              <span className="text-3xl lg:text-4xl font-bold text-brand-accent">
                {selectedVariant ? formatPrice(selectedVariant.price) : 'Select pack size'}
              </span>
              {selectedVariant?.mrp && selectedVariant.mrp > selectedVariant.price && (
                <span className="ml-3 text-xl lg:text-2xl text-gray-400 line-through">
                  {formatPrice(selectedVariant.mrp)}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <QuantityStepper value={quantity} onChange={setQuantity} max={maxQuantity > 0 ? maxQuantity : 1} min={1} disabled={isOutOfStock} />
              <Button
                size="lg"
                className="flex-1 w-full sm:w-auto"
                onClick={handleAddToCart}
                disabled={isOutOfStock || addToCartMutation.isPending}
                isLoading={addToCartMutation.isPending}
              >
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>
            
            <Button
              variant="outline"
              size="lg"
              className="mt-4 w-full sm:w-auto"
              onClick={handleWishlistClick}
              disabled={toggleWishlistMutation.isPending}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              {toggleWishlistMutation.isPending && toggleWishlistMutation.variables === product._id ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <Heart className={cn("h-5 w-5 mr-2", isWishlisted ? "text-red-500 fill-red-500" : "")} />
              )}
              {isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
            </Button>
            
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
              {/* ... Trust Badges ... */}
            </div>
          </div>
        </div>

        {/* Full Description & Reviews */}
        {/* ... */}
      </div>
    </>
  );
}