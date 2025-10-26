import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/utils/helpers';
import { CartItemRow } from '../cart/CartItemRow';

type OrderSummaryProps = {
  isCheckoutPage?: boolean; // Hides cart item details on checkout page
};

/**
 * A component that displays the cart subtotal, shipping, taxes, and total.
 * Can be used on the Cart page or in the Checkout sidebar.
 */
export function OrderSummary({ isCheckoutPage = false }: OrderSummaryProps) {
  const { items } = useCartStore();

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  
  // Placeholders for shipping and tax
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.05; // 5% GST
  const total = subtotal + shipping + tax;

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold font-heading mb-6">Order Summary</h2>

      {/* Item List (for checkout page) */}
      {isCheckoutPage && (
        <div className="mb-6 max-h-64 overflow-y-auto border-b">
          <ul role="list" className="divide-y divide-gray-200">
            {items.map(item => (
               <li key={item.variantId} className="flex py-4">
                 <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                   <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                 </div>
                 <div className="ml-4 flex flex-1 flex-col text-sm">
                   <div className="flex justify-between font-medium text-gray-900">
                     <h3>{item.name}</h3>
                     <p className="ml-4">{formatPrice(item.price * item.quantity)}</p>
                   </div>
                   <p className="text-gray-500">{item.pack}</p>
                   <p className="text-gray-500">Qty: {item.quantity}</p>
                 </div>
               </li>
            ))}
          </ul>
        </div>
      )}

      {/* Promo Code (UI Only) */}
      {!isCheckoutPage && (
        <div className="mb-6">
          <label htmlFor="promo" className="block text-sm font-medium text-gray-700">
            Promo Code
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              id="promo"
              placeholder="Enter code"
              className="flex-1 rounded-l-md border-gray-300 focus:border-brand-primary focus:ring-brand-primary"
            />
            <button
              type="button"
              className="rounded-r-md border border-l-0 border-brand-primary bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between text-base text-gray-700">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-base text-gray-700">
          <span>Shipping (Free over ₹500)</span>
          <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between text-base text-gray-700">
          <span>Taxes (5% GST)</span>
          <span>{formatPrice(tax)}</span>
        </div>
        <div className="flex justify-between text-2xl font-bold text-gray-900 pt-3 border-t">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}