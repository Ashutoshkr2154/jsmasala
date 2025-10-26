// src/pages/Cart.tsx
import { Link } from 'react-router-dom';
import { Loader2, XCircle } from 'lucide-react'; // Import icons

// Hooks for data, state, and actions
import { useCartStore } from '@/store/useCartStore.ts'; // Gets synced items
import { useCart, useClearCart } from '@/hooks/useCart.ts'; // Gets query state and clear mutation

// Component Imports (ensure .tsx extensions)
import { Seo } from '@/components/common/Seo.tsx';
import { Button } from '@/components/common/Button.tsx';
import { Breadcrumbs } from '@/components/common/Breadcrumbs.tsx';
import { CartItemRow } from '@/components/cart/CartItemRow.tsx';
import { OrderSummary } from '@/components/checkout/OrderSummary.tsx';

export default function CartPage() {
  // Get synced items from Zustand (updated by Layout.tsx)
  const { items } = useCartStore();
  // Get query status from React Query hook
  const { isLoading, isError, error } = useCart();
  // Get clear cart mutation hook
  const clearCartMutation = useClearCart();

  // Handler for the Clear Cart button
  const handleClearCart = () => {
    // Prevent multiple clicks if already clearing
    if (clearCartMutation.isPending) return;
    
    // Call the mutation hook (no arguments needed for clear)
    clearCartMutation.mutate(undefined, {
      onError: (err) => {
        console.error("Failed to clear cart:", err);
        // Optional: Show error toast to the user
      },
      // onSuccess is handled by the hook updating the React Query cache,
      // which then triggers the sync in Layout.tsx to update Zustand
    });
  };

  // Calculate total items count (more accurate than items.length if quantity > 1)
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Seo
        title="Your Shopping Cart"
        description="Review and manage items in your JSM Masala shopping cart."
      />

      <div className="container py-12">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Shopping Cart' }, // Current page
          ]}
        />

        {/* === Loading State === */}
        {isLoading && (
          <div className="flex justify-center items-center py-20 min-h-[400px]">
            <Loader2 className="h-12 w-12 animate-spin text-brand-primary" />
          </div>
        )}

        {/* === Error State === */}
        {isError && !isLoading && (
          <div className="text-center py-20 text-red-600 min-h-[400px]">
             <XCircle className="h-16 w-16 mx-auto mb-4" />
             <h1 className="text-3xl font-bold">Error Loading Cart</h1>
             <p className="mt-2 text-lg">Could not fetch your cart items. Please try refreshing the page.</p>
             {/* Show technical error details only in development */}
             {import.meta.env.DEV && <pre className="mt-4 text-xs text-left">{error?.message}</pre>}
          </div>
        )}

        {/* === Empty Cart State === */}
        {/* Show only if NOT loading, NO error, AND items array is empty */}
        {!isLoading && !isError && items.length === 0 && (
          <div className="text-center py-20 min-h-[400px]">
            <img src="/images/empty-cart.svg" alt="Empty cart illustration" className="w-64 h-64 mx-auto mb-6" />
            <h1 className="mt-8 text-4xl font-extrabold font-heading">Your Cart is Empty</h1>
            <p className="mt-4 text-lg text-gray-600">
              Looks like you haven't added any spices.
            </p>
            <Button to="/shop" size="lg" className="mt-8">
              Start Shopping
            </Button>
          </div>
        )}

        {/* === Cart Content (Items + Summary) === */}
        {/* Show only if NOT loading, NO error, AND items array is NOT empty */}
        {!isLoading && !isError && items.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-start">
            {/* Left Col: Cart Items */}
            <section className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row justify-between items-baseline mb-6 gap-4">
                <h1 className="text-3xl font-extrabold font-heading">
                  {/* Use calculated total items count */}
                  Your Cart ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})
                </h1>
                {/* Clear Cart Button */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClearCart}
                  // Disable button while mutation is running
                  disabled={clearCartMutation.isPending}
                  isLoading={clearCartMutation.isPending} // Show loading state on button
                >
                  Clear Cart
                </Button>
              </div>

              <ul role="list" className="divide-y divide-gray-200 border-t border-b">
                {/* CartItemRow uses mutations internally */}
                {items.map((item) => (
                  <CartItemRow key={item.variantId} item={item} />
                ))}
              </ul>
            </section>

            {/* Right Col: Order Summary */}
            <aside className="lg:col-span-1 sticky top-28"> {/* Sticky position */}
              {/* OrderSummary calculates totals based on passed 'items' */}
              <OrderSummary isCheckoutPage={false} /> {/* Shows promo code input */}
              <Button
                to="/checkout"
                size="lg"
                className="w-full mt-6"
                // Optionally disable checkout if cart is empty (though this section hides anyway)
                disabled={items.length === 0}
              >
                Proceed to Checkout
              </Button>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}