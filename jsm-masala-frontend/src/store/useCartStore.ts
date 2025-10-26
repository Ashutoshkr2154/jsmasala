import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
// Make sure CartState, CartActions, CartItem are correctly defined in your types file
import { CartState, CartActions, CartItem } from '@/types/index.ts'; // Ensure .ts extension

// Define the new action type for syncing
type CartStoreSyncActions = {
  setItems: (items: CartItem[]) => void; // Action to update items from external source (React Query)
};

// Combine original actions (mostly UI) with the sync action
type CartStoreActions = Pick<CartActions, 'openCart' | 'closeCart' | 'toggleCart'> & CartStoreSyncActions;

// Define the complete store type including state and combined actions
type CartStore = CartState & CartStoreActions;

/**
 * Zustand store for managing UI state (cart drawer visibility) and
 * holding a synchronized copy of cart items fetched via React Query.
 */
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // --- STATE ---
      items: [], // This will be kept in sync with React Query's cache
      isOpen: false, // UI state for the drawer

      // --- ACTIONS ---

      // Action to replace the entire items array (called by the sync logic)
      setItems: (newItems: CartItem[]) => {
        set({ items: newItems });
      },

      // --- UI ACTIONS (Keep these) ---
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      // --- BACKEND-RELATED ACTIONS (Comment out or remove) ---
      // These actions are now primarily handled by React Query mutations
      // which call the backend API. React Query's success handler will
      // update its cache, and our sync logic will update this store's 'items'.

      /*
      addItem: (itemToAdd) => {
        console.warn('addItem called directly on Zustand store - should use useAddToCart mutation');
        // Original logic commented out:
        // const existingItem = get().items.find( ... );
        // ... set(...) ...
      },

      removeItem: (variantId) => {
        console.warn('removeItem called directly on Zustand store - should use useRemoveCartItem mutation');
        // Original logic commented out:
        // set((state) => ({ items: state.items.filter(...) }));
      },

      updateQuantity: (variantId, quantity) => {
        console.warn('updateQuantity called directly on Zustand store - should use useUpdateCartItem mutation');
        // Original logic commented out:
        // if (quantity <= 0) { get().removeItem(variantId); } else { set(...) }
      },

      clearCart: () => {
        console.warn('clearCart called directly on Zustand store - should use useClearCart mutation');
        // Original logic commented out:
        // set({ items: [] });
      },
      */

    }),
    {
      // Configuration for the 'persist' middleware
      name: 'jsm-cart-storage-v2', // Changed name slightly to avoid conflict with old structure if needed
      storage: createJSONStorage(() => localStorage), // Use localStorage

      // --- UPDATED PERSISTENCE ---
      // Option 1: Only persist UI state (isOpen). Items refetched on load. Simplest.
      partialize: (state) => ({ isOpen: state.isOpen }),

      // Option 2: Persist items AND UI state. Provides offline view but relies on sync.
      // partialize: (state) => ({ items: state.items, isOpen: state.isOpen }),
    },
  ),
);

// Note: The logic to sync React Query's cart data *into* this store
// was added in the Layout.tsx component in the previous step.