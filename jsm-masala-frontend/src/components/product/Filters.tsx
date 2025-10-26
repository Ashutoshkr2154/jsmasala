import { useSearchParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/common/Button.tsx'; // Ensure correct import

// Filter options data
const categories = ['Blends', 'Powders', 'Whole Spices', 'Organic', 'Pickles', 'Ready Mixes'];
const prices = [
  { label: 'Under ₹100', value: '0-100' },
  { label: '₹100 to ₹200', value: '100-200' },
  { label: '₹200 to ₹500', value: '200-500' },
  { label: 'Over ₹500', value: '500-99999' }, // Use a high upper bound
];

export function Filters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Function to update URL search params on filter change
  const handleFilterChange = (type: string, value: string, isChecked: boolean) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', '1'); // Reset page when filters change

    if (isChecked) {
      if (type === 'category') {
        newParams.append(type, value); // Allow multiple categories
      } else {
        newParams.set(type, value); // Only one price range
      }
    } else {
      // Logic to remove the filter value
      if (type === 'category') {
        const allCategories = newParams.getAll('category');
        newParams.delete('category'); // Clear existing categories
        allCategories
          .filter(cat => cat !== value) // Remove the unchecked one
          .forEach(cat => newParams.append('category', cat)); // Add back the others
      } else {
        newParams.delete(type); // Remove price or other single-value filters
      }
    }
    setSearchParams(newParams); // Update the URL
  };

  // Get current selections from URL
  const selectedCategories = searchParams.getAll('category');
  const selectedPrice = searchParams.get('price');

  return (
    <aside className="w-full lg:w-64">
      <h2 className="text-2xl font-bold font-heading mb-6">Filters</h2>

      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 text-brand-neutral">Category</h3>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category} className="flex items-center">
              <input
                type="checkbox"
                id={`cat-${category}`}
                value={category}
                // Check if this category is in the URL params
                checked={selectedCategories.includes(category)}
                onChange={(e) => handleFilterChange('category', e.target.value, e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary focus:ring-offset-0"
              />
              <label htmlFor={`cat-${category}`} className="ml-3 text-sm text-gray-600 cursor-pointer">
                {category}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Filter */}
      <div>
        <h3 className="font-semibold mb-3 text-brand-neutral">Price</h3>
        <ul className="space-y-2">
          {prices.map((price) => (
            <li key={price.value} className="flex items-center">
              <input
                type="radio"
                id={`price-${price.value}`}
                name="price" // Radio buttons need the same name
                value={price.value}
                 // Check if this price is in the URL params
                checked={selectedPrice === price.value}
                onChange={(e) => handleFilterChange('price', e.target.value, e.target.checked)}
                className="h-4 w-4 border-gray-300 text-brand-primary focus:ring-brand-primary focus:ring-offset-0"
              />
              <label htmlFor={`price-${price.value}`} className="ml-3 text-sm text-gray-600 cursor-pointer">
                {price.label}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Clear Filters Button */}
      {(selectedCategories.length > 0 || selectedPrice) && (
        <Button
          variant="secondary"
          className="w-full mt-6 text-sm"
          onClick={() => setSearchParams({})} // Clears all params
        >
          <X className="w-4 h-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </aside>
  );
}