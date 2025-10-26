// src/hooks/useWishlist.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchWishlist,
  toggleBackendWishlist,
} from '@/services/api.ts'; // Import API functions
import { useAuthStore } from '@/store/useAuthStore.ts';
import { Product } from '@/types/index.ts'; // Ensure Product type is imported

// --- Types ---
// Matches the response from the fetchWishlist API function
type WishlistApiResponse = Awaited<ReturnType<typeof fetchWishlist>>;
// Matches the response from the toggleBackendWishlist API function
type ToggleWishlistResponse = Awaited<ReturnType<typeof toggleBackendWishlist>>;
// Matches the input for the toggleBackendWishlist API function (product ID string)
type ToggleWishlistInput = Parameters<typeof toggleBackendWishlist>[0];

// --- Query Key Factory ---
export const wishlistQueryKeys = {
  all: ['wishlist'] as const,
  currentUser: () => [...wishlistQueryKeys.all, 'currentUser'] as const,
};

// --- Hook to Fetch Current User's Wishlist ---
export const useWishlist = () => {
  const isAuthenticated = !!useAuthStore((state) => state.token); // Check if logged in

  return useQuery<WishlistApiResponse, Error>({
    queryKey: wishlistQueryKeys.currentUser(),
    queryFn: fetchWishlist,
    enabled: isAuthenticated, // Only run if user is authenticated
    staleTime: 1000 * 60 * 15, // Wishlist data can be cached for 15 mins
  });
};

// --- Mutation Hook to Add/Remove from Wishlist (Toggle) ---
export const useToggleWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation<ToggleWishlistResponse, Error, ToggleWishlistInput>({ // Add types
    mutationFn: toggleBackendWishlist, // The API function to call
    
    // --- UPDATED LOGIC ---
    // We will update the cache on success, using the fresh data
    // returned from the backend API.
    
    onSuccess: (data) => {
      // 'data' from the backend is { message, wishlist }
      // We set the React Query cache for 'wishlist' to this new data.
      queryClient.setQueryData(wishlistQueryKeys.currentUser(), data.wishlist);
      // This cache update will automatically trigger the sync
      // in Layout.tsx, updating the Zustand store.
      
      // Optional: Show success toast with data.message
      // e.g., toast.success(data.message);
      console.log('Wishlist toggled:', data.message);
    },

    // If the mutation fails, just log the error.
    // No rollback is needed since we didn't do an optimistic update.
    onError: (err) => {
      console.error("Failed to toggle wishlist:", err);
      // TODO: Show error toast to the user
    },
    
    // We don't need onSettled because onSuccess handles the cache update.
  });
};