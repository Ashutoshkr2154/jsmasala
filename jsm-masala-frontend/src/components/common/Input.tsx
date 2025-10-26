import React, { forwardRef } from 'react';
import { cn } from '@/utils/helpers';
import { XCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string; // Error message from react-hook-form
}

/**
 * A reusable, styled <input> component that integrates
 * with react-hook-form to display labels and errors.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, name, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={name}
          name={name}
          ref={ref}
          className={cn(
            'flex h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-base',
            'placeholder:text-gray-400 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error ? 'border-red-500 focus:ring-red-500' : '',
            className,
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 flex items-center text-sm text-red-600">
            <XCircle className="w-4 h-4 mr-1" />
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';