import { Fragment } from 'react';
import { X, Loader2, XCircle } from 'lucide-react'; // Import icons
// Get items (synced) and UI state from Zustand
import { useCartStore } from '@/store/useCartStore.ts';
import { formatPrice } from '@/utils/helpers.ts';
import { Button } from '@/components/common/Button.tsx';
import { CartItemRow } from './CartItemRow.tsx';
// Import useCart hook from React Query for loading/error status
import { useCart } from '@/hooks/useCart.ts';

/**
 * The main Cart Drawer (slide-out panel) component.
 * Displays items synced from React Query via Zustand.
 * Shows loading/error states based on the useCart query.
 */
export function CartDrawer() {
  // Get UI state and synced items from Zustand store
  const { items, isOpen, closeCart } = useCartStore();
  // Get query status from React Query hook
  const { isLoading, isError, error } = useCart();

  // Calculate subtotal based on the items currently in the Zustand store
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <Fragment>
      {/* Overlay / Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className={`fixed top-0 right-0 bottom-0 z-50 flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b">
          <h2 id="cart-drawer-title" className="text-2xl font-heading font-bold text-gray-900">
            Shopping Cart
          </h2>
          <button type="button" className="-m-2 p-2 text-gray-400 hover:text-gray-500" onClick={closeCart} aria-label="Close cart panel">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-6">
          {/* --- Loading State --- */}
          {isLoading && (
            <div className="flex justify-center items-center h-full pt-10">
              <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
            </div>
          )}

          {/* --- Error State --- */}
          {isError && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full pt-10 text-center text-red-600">
               <XCircle className="h-12 w-12 mb-2" />
               <p className="font-semibold">Could not load cart.</p>
               {import.meta.env.DEV && <p className="text-xs mt-1">{error?.message}</p>}
            </div>
          )}

          {/* --- Empty Cart State --- */}
          {!isLoading && !isError && items.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <img src="/images/empty-cart.svg" alt="Empty cart" className="w-48 h-48 mb-4" />
              <h3 className="mt-4 text-xl font-semibold">Your cart is empty</h3>
              <p className="mt-2 text-gray-500">Looks like you haven't added any spices yet.</p>
              <Button variant="primary" to="/shop" className="mt-6" onClick={closeCart}>
                Start Shopping
              </Button>
            </div>
          )}

          {/* --- Display Cart Items --- */}
          {!isLoading && !isError && items.length > 0 && (
            <ul role="list" className="-my-4 divide-y divide-gray-200">
              {items.map((item) => (
                <CartItemRow key={item.variantId} item={item} />
              ))}
            </ul>
          )}
        </div>

        {/* Footer (Subtotal & Checkout) */}
        {!isLoading && !isError && items.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-6 mt-auto"> {/* Pushes footer to bottom */}
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <p>Subtotal</p>
              <p>{formatPrice(subtotal)}</p>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="mt-6">
              <Button to="/checkout" size="lg" className="w-full" onClick={closeCart}>
                Checkout
              </Button>
            </div>
            <div className="mt-4 flex justify-center text-center text-sm text-gray-500">
              <p>
                or{' '}
                <Button variant="link" to="/cart" className="p-0" onClick={closeCart}>
                  View Full Cart
                </Button>
              </p>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
}