// src/pages/Shop.tsx
import { useSearchParams } from 'react-router-dom';
import { Seo } from '@/components/common/Seo.tsx'; // Added .tsx
import { Filters } from '@/components/product/Filters.tsx'; // Added .tsx
import { SortDropdown } from '@/components/common/SortDropdown.tsx'; // Added .tsx
import { ProductCard } from '@/components/product/ProductCard.tsx'; // Added .tsx
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton.tsx'; // Added .tsx
import { Pagination } from '@/components/common/Pagination.tsx'; // Added .tsx
import { useProducts } from '@/hooks/useProducts.ts'; // Ensured .ts

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const currentSearchTerm = searchParams.get('search'); // Get current search term for message

  // The useProducts hook reads the searchParams directly
  const { data, isLoading, isError, error } = useProducts(searchParams);

  const products = data?.data || [];
  const meta = data?.meta;

  return (
    <>
      <Seo
        title="Shop All Spices"
        description="Browse our complete collection of authentic Indian spices, blends, powders, and more."
      />

      <div className="container py-12">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold font-heading">Our Spices</h1>
          <p className="mt-2 text-lg text-gray-600">
            Find the perfect flavor for your next dish.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            {/* Ensure Filters component handles rendering based on searchParams */}
            <Filters />
          </div>

          {/* Product Grid & Sorting */}
          <div className="lg:w-3/4">
            {/* Sort Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b gap-4"> {/* Added gap, flex-col */}
              <p className="text-sm text-gray-600">
                {/* Improved loading/result text */}
                {isLoading
                  ? 'Loading products...'
                  : `${meta?.total ?? 0} product${meta?.total !== 1 ? 's' : ''} found ${currentSearchTerm ? `for "${currentSearchTerm}"` : ''}`}
              </p>
              {/* Ensure SortDropdown reads searchParams if needed, or triggers update */}
              <SortDropdown />
            </div>

            {/* Grid */}
            <div id="product-grid" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 min-h-[400px]"> {/* Added min-height */}
              {isLoading && (
                // Show more skeletons on loading
                Array.from({ length: meta?.limit || 9 }).map((_, i) => <ProductCardSkeleton key={i} />)
              )}

              {isError && (
                <div className="col-span-full text-center py-20 text-red-600">
                  <h3 className="text-2xl font-semibold">Error Loading Products</h3>
                  <p className="mt-2">
                    Could not fetch products. Please try refreshing the page.
                  </p>
                  {/* Optional: Show error details in dev mode */}
                  {import.meta.env.DEV && <pre className="mt-4 text-xs text-left">{error?.message}</pre>}
                </div>
              )}

              {!isLoading && !isError && products.length === 0 && (
                <div className="col-span-full text-center py-20">
                  <h3 className="text-2xl font-semibold">No Products Found</h3>
                  {/* More specific message based on filters/search */}
                  <p className="mt-2 text-gray-500">
                    {currentSearchTerm
                      ? `We couldn't find any products matching "${currentSearchTerm}". Try broadening your search.`
                      : 'Try adjusting your filters or clearing them to see all spices.'}
                  </p>
                  {/* Maybe add a "Clear Filters" button here too */}
                </div>
              )}

              {/* Render product cards */}
              {!isLoading && !isError && products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {/* Only show pagination if loaded, no error, and more than one page */}
            {!isLoading && !isError && meta && meta.totalPages > 1 && (
              <div className="mt-12">
                <Pagination meta={meta} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}