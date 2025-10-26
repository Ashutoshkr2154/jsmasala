// src/components/common/Checkbox.tsx
import React, { forwardRef } from 'react';
import { cn } from '@/utils/helpers.ts';

// Props for a basic checkbox, can be extended
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * A simple, reusable checkbox component.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, name, onCheckedChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(event.target.checked);
    };
    
    // Use an ID for the label to click
    const id = props.id || name;

    return (
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id={id}
          name={name}
          ref={ref}
          onChange={handleChange} // Use controlled change handler
          className={cn(
            'h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary focus:ring-offset-0',
            className,
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            {label}
          </label>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';