import { Minus, Plus } from 'lucide-react';
import { cn } from '@/utils/helpers';

type QuantityStepperProps = {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max: number; // Use stock as max
  className?: string;
};

/**
 * A reusable +/- stepper component for quantity input.
 */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max,
  className,
}: QuantityStepperProps) {
  const handleDecrement = () => {
    onChange(Math.max(min, value - 1));
  };

  const handleIncrement = () => {
    onChange(Math.min(max, value + 1));
  };

  return (
    <div
      className={cn(
        'flex items-center rounded-lg border border-gray-300',
        className,
      )}
    >
      <button
        onClick={handleDecrement}
        className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 rounded-l-lg"
        aria-label="Decrease quantity"
        disabled={value <= min}
      >
        <Minus className="h-5 w-5" />
      </button>
      <span
        className="w-12 select-none text-center text-lg font-medium"
        aria-live="polite"
        aria-atomic="true"
      >
        {value}
      </span>
      <button
        onClick={handleIncrement}
        className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 rounded-r-lg"
        aria-label="Increase quantity"
        disabled={value >= max}
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
  );
}