import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createProductAdmin,
  updateProductAdmin,
  deleteProductAdmin,
} from '@/services/api.ts'; // Import the new API functions
import { Product } from '@/types/index.ts';
import { productQueryKeys } from './useProducts.ts'; // Import product list query keys
import { useAuthStore } from '@/store/useAuthStore.ts';

// --- Define Types for Mutation Inputs ---

// Matches the input for the createProductAdmin API function
type CreateProductInput = Parameters<typeof createProductAdmin>[0];

// Matches the input for the updateProductAdmin API function
type UpdateProductInput = Parameters<typeof updateProductAdmin>[0];

// Matches the input for the deleteProductAdmin API function (just the ID string)
type DeleteProductInput = Parameters<typeof deleteProductAdmin>[0];

// --- Mutation Hook to Create a Product ---
export const useCreateProductAdmin = () => {
  const queryClient = useQueryClient();
  const isAdmin = useAuthStore((state) => state.user?.role === 'admin');

  return useMutation<Product, Error, CreateProductInput>({
    mutationFn: createProductAdmin,
    onSuccess: (newProduct) => {
      console.log('Product created:', newProduct);
      // Invalidate all product lists so they refetch with the new item
      queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() });
      // TODO: Show success toast
    },
    onError: (error) => {
      console.error('Failed to create product:', error);
      // TODO: Show error toast
    },
    // Client-side check to prevent mutation if not admin
    onMutate: () => {
      if (!isAdmin) {
        throw new Error('User is not authorized to perform this action.');
      }
    },
  });
};

// --- Mutation Hook to Update a Product ---
export const useUpdateProductAdmin = () => {
  const queryClient = useQueryClient();
  const isAdmin = useAuthStore((state) => state.user?.role === 'admin');

  return useMutation<Product, Error, UpdateProductInput>({
    mutationFn: updateProductAdmin,
    onSuccess: (updatedProduct) => {
      console.log('Product updated:', updatedProduct);
      // Invalidate all product lists
      queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() });
      // Invalidate the specific product detail queries
      queryClient.invalidateQueries({
        queryKey: productQueryKeys.detail(updatedProduct._id),
      });
      queryClient.invalidateQueries({
        queryKey: productQueryKeys.detail(updatedProduct.slug),
      });
      // TODO: Show success toast
    },
    onError: (error) => {
      console.error('Failed to update product:', error);
      // TODO: Show error toast
    },
    onMutate: () => {
      if (!isAdmin) {
        throw new Error('Unauthorized');
      }
    },
  });
};

// --- Mutation Hook to Delete a Product ---
export const useDeleteProductAdmin = () => {
  const queryClient = useQueryClient();
  const isAdmin = useAuthStore((state) => state.user?.role === 'admin');

  return useMutation<{ message: string }, Error, DeleteProductInput>({
    mutationFn: deleteProductAdmin,
    onSuccess: (data, productId) => {
      console.log('Product deleted:', productId, data.message);
      // Invalidate all product lists
      queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() });
      // Remove specific product detail queries from cache
      queryClient.removeQueries({
        queryKey: productQueryKeys.detail(productId),
      });
      // TODO: Show success toast
    },
    onError: (error, productId) => {
      console.error(`Failed to delete product ${productId}:`, error);
      // TODO: Show error toast
    },
    onMutate: () => {
      if (!isAdmin) {
        throw new Error('Unauthorized');
      }
    },
  });
};