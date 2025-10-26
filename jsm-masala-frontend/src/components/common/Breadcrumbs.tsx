import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import React from 'react';

type BreadcrumbItem = {
  name: string;
  href?: string; // The last item won't have an href
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

/**
 * Renders a breadcrumb navigation trail.
 */
export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => (
          <li key={item.name} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 shrink-0 text-gray-400 mx-2" />
            )}
            {item.href ? (
              <Link
                to={item.href}
                className="font-medium text-gray-500 hover:text-gray-700"
              >
                {item.name}
              </Link>
            ) : (
              <span className="font-semibold text-gray-700" aria-current="page">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}