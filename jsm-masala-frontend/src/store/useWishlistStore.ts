// src/store/useWishlistStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types/index.ts';

// Define the state
type WishlistState = {
  items: Product[]; // Will be synced from React Query
};

// Define the actions
type WishlistActions = {
  setItems: (products: Product[]) => void; // Action to sync items
  // Checks if a product ID is in the local state for fast UI updates
  isInWishlist: (productId: string) => boolean;
};

type WishlistStore = WishlistState & WishlistActions;

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      // --- STATE ---
      items: [], // This array will be kept in sync with the backend data

      // --- ACTIONS ---

      /**
       * Replaces the entire wishlist items array.
       * This is called by our sync component when React Query fetches data.
       */
      setItems: (products) => {
        set({ items: products });
      },

      /**
       * Checks if a product ID is in the local state (items array).
       * Provides an instant check for UI (e.g., heart icon).
       */
      isInWishlist: (productId) => {
        // Use .some() for an efficient boolean check
        return get().items.some((item) => item._id === productId);
      },

      // Note: The 'toggleWishlist' function is removed.
      // Components will now call the 'useToggleWishlist' mutation hook instead,
      // which talks to the backend.
    }),
    {
      name: 'jsm-wishlist-storage', // Key for localStorage
      storage: createJSONStorage(() => localStorage),
      // Only persist the 'items' array
      partialize: (state) => ({ items: state.items }),
    },
  ),
);