import { ProductVariant } from '@/types/index.ts'; // Ensure .ts extension
import { cn } from '@/utils/helpers.ts'; // Ensure .ts extension
import { formatPrice } from '@/utils/helpers.ts'; // Ensure .ts extension

type VariantSelectorProps = {
  variants: ProductVariant[];
  selectedVariantId: string;
  onSelectVariant: (variant: ProductVariant) => void;
};

/**
 * A component to select a product variant using radio buttons.
 */
export function VariantSelector({
  variants,
  selectedVariantId,
  onSelectVariant,
}: VariantSelectorProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-900 mb-2">Pack Size</h3>
      <fieldset aria-label="Select a pack size">
        <legend className="sr-only">Pack Size</legend>
        <div className="flex flex-wrap gap-3">
          {variants.map((variant) => (
            // --- FIX 1: Added unique key prop using variant._id ---
            <div key={variant._id}> 
              <input
                type="radio"
                // --- FIX 2: Use variant._id (from MongoDB) ---
                id={variant._id}
                name="variant"
                value={variant._id}
                checked={selectedVariantId === variant._id}
                onChange={() => onSelectVariant(variant)}
                className="sr-only peer" // Visually hide the radio button
                disabled={variant.stock <= 0}
              />
              <label
                // --- FIX 3: Use variant._id (from MongoDB) ---
                htmlFor={variant._id}
                className={cn(
                  'flex flex-col items-center justify-center rounded-lg border py-3 px-5 cursor-pointer',
                  'transition-all duration-150',
                  variant.stock <= 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 peer-checked:border-brand-primary peer-checked:ring-2 peer-checked:ring-brand-primary',
                )}
              >
                <span className="text-sm font-semibold">{variant.pack}</span>
                <span className="text-xs">{formatPrice(variant.price)}</span>
                {variant.stock <= 0 && (
                   <span className="text-xs text-red-500">Out of stock</span>
                )}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
}