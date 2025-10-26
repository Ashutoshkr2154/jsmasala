// src/hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchProductByIdOrSlug } from '@/services/api.ts'; // Ensure .ts extension
import { PaginatedProductsResponse, Product } from '@/types/index.ts'; // Ensure .ts extension

// Query keys structure remains good
export const productQueryKeys = {
  all: ['products'] as const,
  lists: () => [...productQueryKeys.all, 'list'] as const,
  list: (params: string) => [...productQueryKeys.lists(), { params }] as const,
  details: () => [...productQueryKeys.all, 'detail'] as const,
  // Use idOrSlug consistently for detail keys
  detail: (idOrSlug: string) => [...productQueryKeys.details(), idOrSlug] as const,
};

/**
 * Custom hook to fetch a paginated list of products.
 * Matches backend response { data: Product[], meta: {...} }
 */
export const useProducts = (params: URLSearchParams) => {
  const queryKey = productQueryKeys.list(params.toString());

  return useQuery<PaginatedProductsResponse, Error>({ // Added explicit types
    queryKey: queryKey,
    queryFn: () => fetchProducts(params), // Calls API function
    // Keep previous data visible while fetching next page/filter results
    placeholderData: (previousData) => previousData,
    // Add staleTime if desired (e.g., refetch after 5 mins)
    // staleTime: 1000 * 60 * 5,
  });
};

/**
 * Custom hook to fetch a single product by its ID or slug.
 * Matches backend response Product object.
 * @param {string | undefined} idOrSlug - The product ID or slug (can be undefined initially from URL params).
 */
export const useProductByIdOrSlug = (idOrSlug: string | undefined) => {
  return useQuery<Product, Error>({ // Added explicit types
    // Use idOrSlug in the query key, default to empty string if undefined
    queryKey: productQueryKeys.detail(idOrSlug ?? ''),
    // Use the correct API function name, assert idOrSlug is defined when queryFn runs
    queryFn: () => fetchProductByIdOrSlug(idOrSlug!),
    // The query will only run if idOrSlug is truthy (not undefined, null, or empty string)
    enabled: !!idOrSlug,
    // Add staleTime if desired
    // staleTime: 1000 * 60 * 15, // e.g., refetch after 15 mins
  });
};

/**
 * Custom hook to fetch featured products.
 */
export const useFeaturedProducts = (limit = 8) => { // Added optional limit parameter
  // --- ADD THIS LOG ---
  console.log("[useFeaturedProducts] Hook called. Limit:", limit);
  // --- END LOG ---

  const params = new URLSearchParams();
  params.set('featured', 'true');
  params.set('limit', String(limit));
  // Use a distinct query key part for featured products including limit
  const queryKey = productQueryKeys.list(`featured-${limit}`);

  return useQuery<PaginatedProductsResponse, Error>({ // Added explicit types
    queryKey: queryKey,
    queryFn: () => {
      // --- ADD THIS LOG ---
      console.log("[useFeaturedProducts] queryFn executing! Fetching with params:", params.toString());
      // --- END LOG ---
      return fetchProducts(params);
    },
    staleTime: 1000 * 60 * 15, // Featured products likely don't change often
  });
};