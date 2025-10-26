// src/components/layout/Layout.tsx
import React, { useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '../cart/CartDrawer.tsx';
import { useCart } from '@/hooks/useCart.ts';
import { useCartStore } from '@/store/useCartStore.ts';
import { useAuthStore } from '@/store/useAuthStore.ts';

// --- 1. Import Wishlist hooks ---
import { useWishlist } from '@/hooks/useWishlist.ts';
import { useWishlistStore } from '@/store/useWishlistStore.ts';

// ... (CartSync component remains the same) ...

// --- 2. Add WishlistSync Component ---
function WishlistSync() {
  const { data: wishlistData, isSuccess } = useWishlist();
  const setWishlistItems = useWishlistStore((state) => state.setItems);
  const isAuthenticated = !!useAuthStore((state) => state.token);

  useEffect(() => {
    // When React Query successfully fetches wishlist data...
    if (isSuccess && wishlistData && isAuthenticated) {
      // ...sync it into the Zustand store.
      setWishlistItems(wishlistData.products);
    } else if (!isAuthenticated) {
      // If user logs out, clear items in Zustand store
      setWishlistItems([]);
    }
  }, [wishlistData, isSuccess, setWishlistItems, isAuthenticated]);

  return null; // This component renders nothing
}
// --- End WishlistSync Component ---


export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CartSync /> {/* Existing cart sync */}
      <WishlistSync /> {/* <-- 3. Add the wishlist sync component */}
      <main id="main-content" className="flex-grow">
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}

// Ensure LayoutProps is defined if not already
type LayoutProps = {
  children: React.ReactNode;
};

// Ensure CartSync is defined if not already
function CartSync() {
  const { data: cartData, isSuccess } = useCart();
  const setItems = useCartStore((state) => state.setItems);
  const isAuthenticated = !!useAuthStore((state) => state.token);

  useEffect(() => {
    if (isSuccess && cartData && isAuthenticated) {
      setItems(cartData.items);
    } else if (!isAuthenticated) {
      setItems([]);
    }
  }, [cartData, isSuccess, setItems, isAuthenticated]);

  return null;
}