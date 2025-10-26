// src/hooks/useOrders.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createOrderOnBackend,
  fetchMyOrders,
  fetchOrderById,
} from '@/services/api.ts'; // Import API functions
import { Order } from '@/types/index.ts'; // Import Order type
import { useAuthStore } from '@/store/useAuthStore.ts'; // To check authentication
import { cartQueryKeys } from './useCart.ts'; // Import cart keys to invalidate cart after order

// Define type for mutation input (matches api.ts createOrderOnBackend payload)
type CreateOrderInput = Parameters<typeof createOrderOnBackend>[0];

// --- Query Key Factory ---
export const orderQueryKeys = {
  all: ['orders'] as const,
  lists: () => [...orderQueryKeys.all, 'list'] as const,
  currentUser: () => [...orderQueryKeys.lists(), 'currentUser'] as const, // Key for user's order list
  details: () => [...orderQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderQueryKeys.details(), id] as const, // Key for a single order detail
};

// --- Hook to Create an Order (Mutation) ---
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation<Order, Error, CreateOrderInput>({ // Response, Error, Input types
    mutationFn: createOrderOnBackend, // API function to call
    onSuccess: (data) => {
      // When an order is successfully created:
      console.log('Order created successfully:', data);

      // 1. Invalidate the user's order list query so it refetches with the new order
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.currentUser() });

      // 2. Invalidate the user's cart query (backend clears the cart, frontend needs to refetch empty cart)
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.currentUser() });
      // Alternatively, directly set the cart query data to empty if preferred for immediate UI update:
      // queryClient.setQueryData(cartQueryKeys.currentUser(), { _id: null, user: '', items: [], totalPrice: 0, totalItems: 0 });

      // The CheckoutPage component will typically handle navigation to a confirmation page/step
    },
    onError: (error) => {
      console.error('Failed to create order:', error);
      // The component using this hook should show an error message to the user
    },
  });
};

// --- Hook to Fetch Current User's Orders ---
export const useMyOrders = () => {
  const isAuthenticated = !!useAuthStore((state) => state.token); // Check if user is logged in

  return useQuery<Order[], Error>({ // Expect an array of Order objects
    queryKey: orderQueryKeys.currentUser(), // Key for this user's orders
    queryFn: fetchMyOrders, // API function to call
    enabled: isAuthenticated, // Only run the query if the user is authenticated
    staleTime: 1000 * 60 * 5, // Refetch orders list every 5 minutes if it becomes stale
  });
};

// --- Hook to Fetch a Single Order by ID ---
export const useOrderDetails = (orderId: string | undefined) => { // Accept undefined for ID from URL params
  const isAuthenticated = !!useAuthStore((state) => state.token);

  return useQuery<Order, Error>({ // Expect a single Order object
    queryKey: orderQueryKeys.detail(orderId ?? 'INVALID_ID'), // Key includes the specific order ID
    queryFn: () => fetchOrderById(orderId!), // Call API function, assert orderId exists when running
    enabled: isAuthenticated && !!orderId, // Only run if logged in AND orderId is provided
    staleTime: Infinity, // Order details rarely change once created, keep cached data indefinitely unless invalidated
  });
};

// Add Admin hooks later (useAllOrders, useUpdateOrderStatus) if needed