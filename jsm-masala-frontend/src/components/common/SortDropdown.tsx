import { useSearchParams } from 'react-router-dom';

const sortOptions = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Top Rated', value: 'rating-desc' },
  { label: 'Newest', value: 'newest-desc' },
];

export function SortDropdown() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSort = searchParams.get('sort') || 'relevance';

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', e.target.value);
    // Reset to page 1 when sorting changes
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  return (
    <div className="flex items-center">
      <label htmlFor="sort-by" className="mr-2 text-sm font-medium text-gray-700">
        Sort by:
      </label>
      <select
        id="sort-by"
        name="sort-by"
        className="rounded-lg border-gray-300 pr-10 text-sm focus:border-brand-primary focus:ring-brand-primary"
        value={currentSort}
        onChange={handleSortChange}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}