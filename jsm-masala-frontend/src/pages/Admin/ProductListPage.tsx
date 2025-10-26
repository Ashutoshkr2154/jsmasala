// src/pages/Admin/ProductListPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, XCircle, Trash2, Edit, PlusCircle, Package } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts.ts'; // Reuse the public hook
import { useDeleteProductAdmin } from '@/hooks/useAdminProducts.ts'; // Import delete hook
import { Seo } from '@/components/common/Seo.tsx';
import { Button } from '@/components/common/Button.tsx';
import { formatPrice } from '@/utils/helpers.ts';
import { Product } from '@/types/index.ts';
// Optional: Add Pagination component if you have one
// import { Pagination } from '@/components/common/Pagination.tsx';

export default function AdminProductListPage() {
  // --- Data Fetching ---
  // We can reuse the existing useProducts hook
  // We'll use a simple state for pagination, but you can use URL params
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Show 10 products per page

  const searchParams = new URLSearchParams();
  searchParams.set('page', String(page));
  searchParams.set('limit', String(limit));
  // Optional: Add sort params if needed, e.g., searchParams.set('sort', '-createdAt');

  const { data: productData, isLoading, isError, error } = useProducts(searchParams);
  const deleteProductMutation = useDeleteProductAdmin();

  // --- Handlers ---
  const handleDeleteProduct = (product: Product) => {
    // Simple confirmation dialog
    if (window.confirm(`Are you sure you want to delete "${product.name}"? This cannot be undone.`)) {
      deleteProductMutation.mutate(product._id, {
        onError: (err) => {
          console.error('Delete failed:', err);
          // TODO: Show error toast
        },
        onSuccess: () => {
          // TODO: Show success toast
          // Data will refetch automatically due to query invalidation
        }
      });
    }
  };

  const products = productData?.data || [];
  const meta = productData?.meta;

  return (
    <>
      <Seo title="Admin - Manage Products" />
      <div className="container py-12">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl lg:text-4xl font-extrabold font-heading">
            Manage Products
          </h1>
          <Button asChild>
            <Link to="/admin/products/new">
              <PlusCircle className="h-5 w-5 mr-2" />
              Add New Product
            </Link>
          </Button>
        </div>

        {/* --- Product Table --- */}
        <div className="rounded-lg border bg-white shadow-sm overflow-x-auto">
          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20 min-h-[300px]">
              <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
            </div>
          )}
          
          {/* Error State */}
          {isError && !isLoading && (
            <div className="p-10 text-center text-red-600 min-h-[300px]">
              <XCircle className="h-12 w-12 mx-auto mb-4" />
              <p className="font-semibold">Could not load products.</p>
              {import.meta.env.DEV && <p className="text-xs mt-1">{error?.message}</p>}
            </div>
          )}
          
          {/* Table */}
          {!isLoading && !isError && products && (
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price (Default)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock (Default)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Featured</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                      <Package className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <img
                          src={product.images?.[0]?.url || '/images/placeholder-1.jpg'}
                          alt={product.name}
                          className="h-12 w-12 rounded-md object-cover"
                        />
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{product.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{product.category?.name || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {product.variants?.[0] ? formatPrice(product.variants[0].price) : 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {product.variants?.[0]?.stock ?? 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {product.isFeatured ? 'Yes' : 'No'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Button asChild variant="outline" size="sm" className="mr-2">
                          <Link to={`/admin/products/edit/${product._id}`}>
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Link>
                        </Button>
                        <Button
                          variant="destructive-outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product)}
                          // Disable button if this specific product is being deleted
                          isLoading={deleteProductMutation.isPending && deleteProductMutation.variables === product._id}
                          disabled={deleteProductMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination (Optional) */}
        {/* {meta && meta.totalPages > 1 && (
          <Pagination
            currentPage={meta.currentPage}
            totalPages={meta.totalPages}
            onPageChange={setPage}
          />
        )} */}

      </div>
    </>
  );
}