import { Link } from 'react-router-dom';
import { Award, Leaf, Truck } from 'lucide-react';
import { Seo } from '@/components/common/Seo';
import { Button } from '@/components/common/Button';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton';
import { useFeaturedProducts } from '@/hooks/useProducts';

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
      <section className="relative h-[60vh] min-h-[400px] bg-gray-800 text-white">
        {/* Add a background image in /public/images/hero-bg.jpg */}
        <img 
          src="/images/hero-bg.jpg" 
          alt="A spread of colorful Indian spices"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 container h-full flex flex-col justify-center text-center items-center">
          <h1 className="text-4xl md:text-6xl font-extrabold font-heading mb-4">
            The True Taste of India
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-8">
            Experience the rich aromas and authentic flavors of JSM Masala,
            crafted from the finest spices.
          </p>
          <Button to="/shop" size="lg" variant="primary">
            Shop All Spices
          </Button>
        </div>
      </section>

      {/* 2. Featured Categories Section */}
      <section className="py-16 bg-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold font-heading mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredCategories.map((cat) => (
              <Link to={cat.href} key={cat.name} className="group relative rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105">
                <img src={cat.image} alt={cat.name} className="h-48 w-full object-cover" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-white group-hover:underline">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Products Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold font-heading mb-8 text-center">
            Our Bestsellers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading && (
              Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            )}
            {isError && (
              <p className="text-red-500 col-span-full text-center">
                Could not load featured products.
              </p>
            )}
            {featuredProducts?.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      
      {/* 4. "Why Choose Us" Section */}
      <section className="py-16 bg-brand-background/50">
        <div className="container">
          <h2 className="text-3xl font-bold font-heading mb-12 text-center">Why JSM Masala?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-brand-primary/20 rounded-full p-4 mb-4">
                <Leaf className="h-10 w-10 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">100% Natural</h3>
              <p className="text-gray-600">No artificial colors, preservatives, or fillers. Just pure, authentic spices.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-brand-primary/20 rounded-full p-4 mb-4">
                <Award className="h-10 w-10 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Sourced from the best farms and ground using traditional techniques.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-brand-primary/20 rounded-full p-4 mb-4">
                <Truck className="h-10 w-10 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Freshness Guaranteed</h3>
              <p className="text-gray-600">Packed in small batches to ensure maximum flavor and aroma.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}