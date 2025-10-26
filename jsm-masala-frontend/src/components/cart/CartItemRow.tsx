// src/components/cart/CartItemRow.tsx
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, Loader2 } from 'lucide-react'; // 1. Import Loader2
import { CartItem } from '@/types/index.ts';
import { formatPrice, cn } from '@/utils/helpers.ts';
// 2. Import React Query mutation hooks
import { useUpdateCartItem, useRemoveCartItem } from '@/hooks/useCart.ts';

type CartItemRowProps = {
  item: CartItem;
};

export function CartItemRow({ item }: CartItemRowProps) {
  // 3. Initialize the mutation hooks
  const updateItemMutation = useUpdateCartItem();
  const removeItemMutation = useRemoveCartItem();

  // 4. Handler for changing quantity
  const handleQuantityChange = (newQuantity: number) => {
    // Prevent action if already updating or quantity is invalid
    if (updateItemMutation.isPending || newQuantity < 1) return;

    // We can optimistically check stock, but the backend will validate anyway
    const clampedQuantity = Math.max(1, Math.min(newQuantity, item.stock));

    // Call the mutation to update the backend
    updateItemMutation.mutate(
      { variantId: item.variantId, quantity: clampedQuantity },
      {
        onError: (error) => {
          console.error("Failed to update quantity:", error);
          // TODO: Show error toast
        },
      }
    );
  };

  // 5. Handler for removing item
  const handleRemoveItem = () => {
    if (removeItemMutation.isPending) return; // Prevent multiple clicks

    // Call the mutation to remove from the backend
    removeItemMutation.mutate(item.variantId, {
      onError: (error) => {
        console.error("Failed to remove item:", error);
        // TODO: Show error toast
      },
    });
  };

  // 6. Determine loading state for this specific item
  const isUpdatingThisItem = updateItemMutation.isPending && updateItemMutation.variables?.variantId === item.variantId;
  const isRemovingThisItem = removeItemMutation.isPending && removeItemMutation.variables === item.variantId;
  const isLoading = isUpdatingThisItem || isRemovingThisItem;

  return (
    // Dim the row and disable interactions while its mutations are pending
    <li className={cn("flex py-4", isLoading ? "opacity-50 pointer-events-none" : "")}>
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src={item.image || '/images/placeholder-1.jpg'} // Image URL from cart item
          alt={item.name}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            {/* TODO: Add Link to product page if slug is available on cart item */}
            <h3>{item.name}</h3>
            <p className="ml-4">{formatPrice(item.price * item.quantity)}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">{item.pack}</p>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          {/* Quantity Stepper */}
          <div className="flex items-center rounded border border-gray-300">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              aria-label="Decrease quantity"
              disabled={item.quantity <= 1 || isLoading}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-10 select-none text-center text-sm font-medium">
              {/* 7. Show loader if this item is updating */}
              {isUpdatingThisItem ? (
                 <Loader2 className="h-4 w-4 mx-auto animate-spin" />
              ) : (
                item.quantity
              )}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              aria-label="Increase quantity"
              disabled={item.quantity >= item.stock || isLoading}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Remove Button */}
          <div className="flex">
            <button
              type="button"
              onClick={handleRemoveItem}
              className="font-medium text-brand-primary hover:text-brand-primary/80 disabled:opacity-50 p-1"
              aria-label="Remove item"
              disabled={isLoading}
            >
              {/* 8. Show loader if this item is being removed */}
              {isRemovingThisItem ? (
                 <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Trash2 className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        
        {/* Stock Warnings */}
        {item.quantity >= item.stock && item.stock > 0 && (
          <p className="mt-1 text-xs text-orange-600">Max available stock reached</p>
         )}
         {item.stock <= 0 && (
          <p className="mt-1 text-xs text-red-600">Item currently out of stock</p>
         )}
      </div>
    </li>
  );
}