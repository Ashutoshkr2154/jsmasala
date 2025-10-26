import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Import useMutation
import {
    fetchAdminStats,
    fetchAllUsers,
    fetchAllOrdersAdmin,        // <-- 1. Import new API functions
    updateBackendOrderStatus,  // <-- 1. Import new API functions
} from '@/services/api.ts';
import { useAuthStore } from '@/store/useAuthStore.ts';
import { User, Order } from '@/types/index.ts'; // <-- 2. Import Order type

// Define type for Stats response
type AdminStatsResponse = Awaited<ReturnType<typeof fetchAdminStats>>;
// Define type for Update Status input (matching api.ts)
type UpdateOrderStatusInput = Parameters<typeof updateBackendOrderStatus>[0];


// --- Query Key Factory ---
export const adminQueryKeys = {
  all: ['admin'] as const,
  stats: () => [...adminQueryKeys.all, 'stats'] as const,
  users: () => [...adminQueryKeys.all, 'users', 'list'] as const,
  orders: () => [...adminQueryKeys.all, 'orders', 'list'] as const, // Key for all orders list
  // Optional: Add keys for admin view of single order if needed
  // orderDetail: (id: string) => [...adminQueryKeys.all, 'orders', 'detail', id] as const,
};

// --- Hook to Fetch Dashboard Stats ---
export const useAdminStats = () => { /* ... (existing hook) ... */ };

// --- Hook to Fetch All Users ---
export const useAdminUsers = () => { /* ... (existing hook) ... */ };

// --- 3. ADDED: Hook to Fetch All Orders ---
export const useAllOrdersAdmin = () => {
  const isAdmin = useAuthStore((state) => state.user?.role === 'admin');

  return useQuery<Order[], Error>({ // Expect an array of Order objects
    queryKey: adminQueryKeys.orders(), // Use the key for the list of all orders
    queryFn: fetchAllOrdersAdmin, // API function to call
    enabled: isAdmin, // Only run if user is admin
    staleTime: 1000 * 60 * 2, // Orders might change, refetch every 2 mins if stale
  });
};

// --- 4. ADDED: Hook to Update Order Status (Mutation) ---
export const useUpdateOrderStatusAdmin = () => {
  const queryClient = useQueryClient();
  const isAdmin = useAuthStore((state) => state.user?.role === 'admin');

  return useMutation<Order, Error, UpdateOrderStatusInput>({ // Response, Error, Input types
    mutationFn: updateBackendOrderStatus, // API function to call
    // Check if user is admin before allowing mutation (optional, backend enforces anyway)
    // mutationKey: ['adminUpdateOrderStatus'], // Optional mutation key
    onSuccess: (updatedOrder) => {
      console.log('Order status updated:', updatedOrder);
      // When status is updated, invalidate the list of all orders to refetch it
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.orders() });
      // Also invalidate the specific order details if you have a query for that
      // queryClient.invalidateQueries({ queryKey: orderQueryKeys.detail(updatedOrder._id) });
      // You might also want to invalidate user-specific order lists if applicable
      // queryClient.invalidateQueries({ queryKey: orderQueryKeys.currentUser() });

      // Optional: Show success toast notification
    },
    onError: (error) => {
      console.error('Failed to update order status:', error);
      // Optional: Show error toast notification
    },
    // Prevent mutation if user is not admin (client-side check)
    onMutate: () => {
        if (!isAdmin) {
            throw new Error('User is not authorized to perform this action.');
        }
    }
  });
};


// --- Keep existing hook bodies (shortened) ---
export const useAdminStats = () => { const isAdmin = useAuthStore((state) => state.user?.role === 'admin'); return useQuery({ queryKey: adminQueryKeys.stats(), queryFn: fetchAdminStats, enabled: isAdmin, staleTime: 1000 * 60 * 5 }); };
export const useAdminUsers = () => { const isAdmin = useAuthStore((state) => state.user?.role === 'admin'); return useQuery({ queryKey: adminQueryKeys.users(), queryFn: fetchAllUsers, enabled: isAdmin, staleTime: 1000 * 60 * 15 }); };