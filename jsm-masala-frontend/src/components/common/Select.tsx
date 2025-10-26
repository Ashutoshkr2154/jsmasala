// src/components/common/Select.tsx
import React, { forwardRef } from 'react';
import { cn } from '@/utils/helpers.ts';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

/**
 * A simple, styled native <select> element.
 * Note: This file provides a basic implementation. For the full experience in
 * ProductForm.tsx, you would use a custom dropdown component.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, error, ...props }, ref) => {
    return (
        <select
          ref={ref}
          className={cn(
            'block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base h-11',
            'focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary',
            'disabled:cursor-not-allowed disabled:opacity-50',
             error ? 'border-red-500 focus:ring-red-500' : '',
            className,
          )}
          {...props}
        >
          {children}
        </select>
    );
  }
);
Select.displayName = 'Select';

// --- Placeholder components to match ProductForm imports ---
// These allow the ProductForm.tsx file to compile without error.
export const SelectTrigger = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    ({ children, className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn("flex h-11 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2 text-base disabled:cursor-not-allowed disabled:opacity-50", className)}
    {...props}
  >
    {children}
  </button>
));
SelectTrigger.displayName = 'SelectTrigger';

export const SelectValue = ({ placeholder }: { placeholder?: string }) => (
    <span>{placeholder || "Select..."}</span>
);

export const SelectContent = ({ children }: { children: React.ReactNode }) => (
    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
        {/* This is a simple placeholder. A real component needs Radix/Popper.js */}
        {children}
    </div>
);

export const SelectItem = ({ children, value, ...props }: { children: React.ReactNode, value: string } & React.OptionHTMLAttributes<HTMLOptionElement>) => (
  <option value={value} {...props}>
    {children}
  </option>
);
// --- End Placeholder Components ---