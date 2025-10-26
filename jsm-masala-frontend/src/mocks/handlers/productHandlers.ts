import { http, HttpResponse } from 'msw';
import { db } from '@/mocks/db.ts';
import { PaginatedProductsResponse, ProductVariant } from '@/types/index.ts'; // Ensure types are imported

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function to get the lowest price of a product's variants
const getProductBasePrice = (variants: ProductVariant[]): number => {
  if (!variants || variants.length === 0) return Infinity;
  return Math.min(...variants.map(v => v.price));
};

export const productHandlers = [
  http.get(`${API_BASE_URL}/products`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const categories = url.searchParams.getAll('category'); // Use getAll for categories
    const search = url.searchParams.get('search')?.toLowerCase(); // <-- Get search term and ensure lowercase
    const featured = url.searchParams.get('featured');
    const priceRange = url.searchParams.get('price'); // <-- Get the price parameter

    let filteredProducts = [...db.products];

    // --- UPDATED: Comprehensive Search Logic ---
    if (search) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search) ||
        product.tags.some(tag => tag.toLowerCase().includes(search)) ||
        product.shortDescription.toLowerCase().includes(search) // Optional: search description
        // Add || product.description.toLowerCase().includes(search) if you want to search full description
      );
    }
    // ===========================================

    // Filter by category (allow multiple)
    if (categories.length > 0) {
      filteredProducts = filteredProducts.filter(p =>
        categories.some(cat => p.category.toLowerCase() === cat.toLowerCase())
      );
    }

    // Filter by featured
    if (featured) {
      filteredProducts = filteredProducts.filter(p => p.isFeatured);
    }

    // Filter by Price Range
    if (priceRange) {
      const [minStr, maxStr] = priceRange.split('-'); // e.g., "100-200" -> ["100", "200"]
      const minPrice = parseInt(minStr, 10);
      const maxPrice = parseInt(maxStr, 10);

      if (!isNaN(minPrice) && !isNaN(maxPrice)) {
        filteredProducts = filteredProducts.filter(product => {
          const basePrice = getProductBasePrice(product.variants); // Get lowest variant price
          return basePrice >= minPrice && basePrice <= maxPrice;
        });
      }
    }

    // Apply pagination
    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedProducts = filteredProducts.slice(
      (page - 1) * limit,
      page * limit,
    );

    const response: PaginatedProductsResponse = {
      data: paginatedProducts,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };

    // Simulate network delay if needed for testing loading states
    // await new Promise(res => setTimeout(res, 500));

    return HttpResponse.json(response);
  }),

  // GET /api/products/:slug handler remains the same
  http.get(`${API_BASE_URL}/products/:slug`, ({ params }) => {
       const { slug } = params;
        const product = db.products.find((p) => p.slug === slug);

        if (product) {
          const related = db.products
            .filter((p) => p.category === product.category && p.slug !== product.slug)
            .slice(0, 5);
          return HttpResponse.json({ ...product, relatedProducts: related });
        } else {
          return HttpResponse.json({ message: 'Product not found' }, { status: 404 });
        }
  }),
];