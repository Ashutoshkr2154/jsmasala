import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS classes conditionally and intelligently.
 * Avoids conflicts (e.g., merging 'p-2' and 'p-4' results in 'p-4').
 *
 * @param inputs - A list of class strings, objects, or arrays.
 * @returns A single, clean class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as an Indian Rupee (INR) string.
 *
 * @param amount - The numeric amount.
 * @returns A formatted string (e.g., "₹1,299.00").
 */
export function formatPrice(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}