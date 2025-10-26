import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { PaginatedProductsResponse } from '@/types';

type PaginationProps = {
  meta: PaginatedProductsResponse['meta'];
};

export function Pagination({ meta }: PaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, totalPages } = meta;

  const handlePageChange = (newPage: number) => {
    // Do nothing if page is out of bounds
    if (newPage < 1 || newPage > totalPages) return;

    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    // Scroll to top of product grid
    document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  const PageButton = ({ pageNum }: { pageNum: number }) => (
    <button
      onClick={() => handlePageChange(pageNum)}
      className={cn(
        'relative inline-flex items-center px-4 py-2 text-sm font-semibold',
        pageNum === page
          ? 'z-10 bg-brand-primary text-white focus-visible:outline-brand-primary'
          : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
      )}
      aria-current={pageNum === page ? 'page' : undefined}
    >
      {pageNum}
    </button>
  );

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 py-6 sm:px-0">
      <div className="flex flex-1 justify-between sm:justify-end">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Previous
        </button>
        
        {/* Simple Page Numbers (for a real app, add ellipsis "...") */}
        {/* We'll just show current and neighbors for simplicity */}
        <div className="hidden sm:flex sm:ml-4">
          {page > 1 && <PageButton pageNum={page - 1} />}
          <PageButton pageNum={page} />
          {page < totalPages && <PageButton pageNum={page + 1} />}
          {page < totalPages - 1 && (
             <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700">
               ...
             </span>
          )}
          {page < totalPages - 1 && <PageButton pageNum={totalPages} />}
        </div>
        
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Next
          <ChevronRight className="h-5 w-5 ml-1" />
        </button>
      </div>
    </nav>
  );
}