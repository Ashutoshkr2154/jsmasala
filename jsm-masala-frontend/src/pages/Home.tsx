// src/pages/Home.tsx
import { Link } from 'react-router-dom';
import { Award, Leaf, Truck } from 'lucide-react';
import { Seo } from '@/components/common/Seo.tsx';
import { Button } from '@/components/common/Button.tsx';
import { ProductCard } from '@/components/product/ProductCard.tsx';
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton.tsx';
import { useFeaturedProducts } from '@/hooks/useProducts.ts';
import { HomeSlider } from '@/components/common/HomeSlider.tsx';
import { NewsletterSection } from '@/components/common/NewsletterSection.tsx';

const featuredCategories = [
  { name: 'Spice Blends', href: '/shop?category=Blends', image: '/images/cat-blends.jpg' },
  { name: 'Powders', href: '/shop?category=Powders', image: '/images/cat-powders.jpg' },
  { name: 'Whole Spices', href: '/shop?category=Whole+Spices', image: '/images/cat-whole.jpg' },
  { name: 'Organic', href: '/shop?category=Organic', image: '/images/cat-organic.jpg' },
];

export default function HomePage() {
  const { data: featuredProducts, isLoading, isError } = useFeaturedProducts();

  return (
    <>
      <Seo
        title="Authentic Indian Spices"
        description="Welcome to JSM Masala. Discover the finest, most authentic Indian spices, blends, and powders delivered fresh to your door."
      />

      {/* 1. Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] bg-gray-800 text-white overflow-hidden">
        <img
          src="/images/hero-bg.jpg"
          alt="A spread of colorful Indian spices"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          onError={(e) => console.error('Hero background failed to load:', e.currentTarget.src)}
        />
        <div className="relative z-10 container h-full flex flex-col justify-center text-center items-center px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-heading mb-4">
            The True Taste of India
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Experience the rich aromas and authentic flavors of JSM Masala,
            crafted from the finest spices.
          </p>
          <Button to="/shop" size="lg" variant="primary">
            Shop All Spices
          </Button>
        </div>
      </section>

      {/* 2. Slider Component */}
      <HomeSlider />

      {/* 3. Featured Categories Section */}
      <section className="py-16 bg-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold font-heading mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredCategories.map((cat) => (
              <Link to={cat.href} key={cat.name} className="group relative rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-48 w-full object-cover"
                  onError={(e) => console.error(`Category image ${cat.name} failed to load:`, e.currentTarget.src)}
                 />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-2">
                  <h3 className="text-xl md:text-2xl font-bold text-white group-hover:underline text-center">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Products Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold font-heading mb-8 text-center">
            Our Bestsellers
          </h2>
          {/* Set a min-height to prevent layout shift while loading
            or if an error/empty state is shown.
          */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[300px]">
            
            {/* --- Loading State --- */}
            {isLoading && (
              Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            )}

            {/* --- Error State --- */}
            {isError && !isLoading && (
              <p className="text-red-500 col-span-full text-center py-10">
                Could not load featured products. Please try refreshing.
              </p>
            )}

            {/* --- Success & Data Exists State --- */}
            {/* This is the fix:
              1. Check !isLoading and !isError
              2. Check if `featuredProducts.data` exists (it won't on the first render)
              3. Check if the array has items (`.length > 0`)
            */}
            {!isLoading && !isError && featuredProducts?.data && featuredProducts.data.length > 0 && (
              featuredProducts.data.map((product) => (
                // Use product._id, as that's what MongoDB provides
                <ProductCard key={product._id} product={product} />
              ))
            )}

            {/* --- Empty State --- */}
            {/* Show this if loading is done, no error, but no products were found */}
            {!isLoading && !isError && (!featuredProducts?.data || featuredProducts.data.length === 0) && (
              <p className="text-gray-500 col-span-full text-center py-10">
                No featured products are available right now.
              </p>
            )}

          </div>
        </div>
      </section>

      {/* 5. "Why Choose Us" Section */}
      <section className="py-16 bg-brand-background/50">
        <div className="container">
          <h2 className="text-3xl font-bold font-heading mb-12 text-center">Why JSM Masala?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Item 1 */}
            <div className="flex flex-col items-center p-4">
              <div className="bg-brand-primary/20 rounded-full p-4 mb-4">
                <Leaf className="h-10 w-10 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">100% Natural</h3>
              <p className="text-gray-600">No artificial colors, preservatives, or fillers. Just pure, authentic spices.</p>
            </div>
            {/* Item 2 */}
            <div className="flex flex-col items-center p-4">
              <div className="bg-brand-primary/20 rounded-full p-4 mb-4">
                <Award className="h-10 w-10 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Sourced from the best farms and ground using traditional techniques.</p>
            </div>
            {/* Item 3 */}
            <div className="flex flex-col items-center p-4">
              <div className="bg-brand-primary/20 rounded-full p-4 mb-4">
                <Truck className="h-10 w-10 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Freshness Guaranteed</h3>
              <p className="text-gray-600">Packed in small batches to ensure maximum flavor and aroma.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Newsletter Section */}
      <NewsletterSection />
    </>
  );
}