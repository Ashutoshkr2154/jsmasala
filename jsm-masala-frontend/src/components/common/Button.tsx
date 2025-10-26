import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { cn } from '@/utils/helpers.ts'; // Ensure .ts extension if needed
import { Loader2 } from 'lucide-react';

// Define variants with hover states (darken background, etc.)
const variants = {
  primary: 'bg-brand-primary text-white hover:bg-brand-primary/90 focus-visible:ring-brand-primary', // Slightly darken on hover
  accent: 'bg-brand-accent text-white hover:bg-brand-accent/90 focus-visible:ring-brand-accent', // Slightly darken on hover
  secondary: 'bg-white text-brand-neutral border border-gray-300 hover:bg-gray-50 focus-visible:ring-brand-primary',
  outline: 'border border-brand-primary text-brand-primary hover:bg-brand-primary/10 focus-visible:ring-brand-primary',
  ghost: 'hover:bg-gray-100 text-brand-neutral',
  link: 'text-brand-primary underline-offset-4 hover:underline disabled:no-underline disabled:text-gray-400', // Adjusted link hover/disabled
};

// Define sizes (no changes needed)
const sizes = {
  sm: 'h-9 px-3 rounded-md text-sm',
  md: 'h-11 px-6 py-3 rounded-lg text-base',
  lg: 'h-12 px-8 rounded-lg text-lg',
  icon: 'h-10 w-10 flex-shrink-0', // Added flex-shrink-0 for icon buttons in flex layouts
};

// --- Component Props ---
type BaseButtonProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  isLoading?: boolean;
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
};

// Intersect with standard button attributes
type ButtonProps = BaseButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>;
// Intersect with Link attributes
type ButtonLinkProps = BaseButtonProps & LinkProps;

// Type guard to check if props are for a Link
function isLink(props: ButtonProps | ButtonLinkProps): props is ButtonLinkProps {
  // Check if 'to' exists and variant is not 'link' (link variant uses specific styles)
  // Or handle 'asChild' prop if you plan to use it for wrapping Links
  return 'to' in props;
}

/**
 * A flexible, reusable button component with variants, sizes,
 * loading state, hover effects, and the ability to act as a React Router <Link>.
 */
export function Button(props: ButtonProps | ButtonLinkProps) {
  // --- BASE STYLES including TRANSITIONS and HOVER effects ---
  // Added transition, hover translate/shadow, active state
  // Exclude these effects for the 'link' variant
  const baseStyles = `
    inline-flex items-center justify-center font-semibold rounded-lg
    transition-all duration-300 ease-in-out
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    disabled:opacity-50 disabled:pointer-events-none
  `;
  const hoverEffectStyles = `
    hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm
  `;

  if (isLink(props)) {
    // --- Render as <Link> ---
    const {
      variant = 'primary',
      size = 'md',
      className,
      to,
      children,
      ...rest
    } = props;

    // Apply hover effects unless it's the 'link' variant
    const linkHoverStyles = variant === 'link' ? '' : hoverEffectStyles;

    return (
      <Link
        to={to}
        className={cn(
          baseStyles,
          linkHoverStyles, // Apply hover effects conditionally
          variants[variant],
          sizes[size],
          className,
        )}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  // --- Render as <button> ---
  const {
    variant = 'primary',
    size = 'md',
    isLoading = false,
    className,
    children,
    disabled, // Capture disabled prop
    ...rest
  } = props;

  // Apply hover effects unless it's the 'link' variant
  const buttonHoverStyles = variant === 'link' ? '' : hoverEffectStyles;

  return (
    <button
      className={cn(
        baseStyles,
        buttonHoverStyles, // Apply hover effects conditionally
        variants[variant],
        sizes[size],
        className,
      )}
      // Combine isLoading and passed disabled prop
      disabled={isLoading || disabled}
      {...rest}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : null}
      {children}
    </button>
  );
}