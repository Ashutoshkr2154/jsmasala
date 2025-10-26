import { QueryClient } from '@tanstack/react-query';

/**
 * Global Query Client for React Query
 *
 * We set default options here:
 * - staleTime: 5 minutes. Data is considered fresh for 5 mins and won't be re-fetched on mount.
 * - cacheTime: 1 hour. Data stays in the cache for 1 hour after it's no longer used.
 * - refetchOnWindowFocus: false. Prevents re-fetching data just because the user clicked away and back.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60, // 1 hour (use gcTime, cacheTime is deprecated)
      refetchOnWindowFocus: false,
      retry: 1, // Retry failed requests 1 time
    },
  },
});