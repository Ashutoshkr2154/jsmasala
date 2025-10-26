// src/hooks/useCart.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom'; // <-- 1. Import useNavigate

import {
    fetchCart,
    addItemToBackendCart,
    updateBackendCartItem,
    removeBackendCartItem,
    clearBackendCart,
} from '@/services/api.ts';
import { useAuthStore } from '@/store/useAuthStore.ts';
import { CartItem } from '@/types/index.ts';

// Define the type for the API response (matching api.ts)
type CartApiResponse = Awaited<ReturnType<typeof fetchCart>>;

// Define types for mutation inputs
type AddItemInput = Parameters<typeof addItemToBackendCart>[0];
type UpdateItemInput = Parameters<typeof updateBackendCartItem>[0];
type RemoveItemInput = Parameters<typeof removeBackendCartItem>[0];

// --- Query Key Factory (Remains the same) ---
export const cartQueryKeys = {
    all: ['cart'] as const,
    currentUser: () => [...cartQueryKeys.all, 'currentUser'] as const,
};

// --- Hook to Fetch Cart Data (Remains the same) ---
export const useCart = () => {
    const isAuthenticated = !!useAuthStore((state) => state.token);

    return useQuery<CartApiResponse, Error>({
        queryKey: cartQueryKeys.currentUser(),
        queryFn: fetchCart,
        enabled: isAuthenticated,
        staleTime: 1000 * 60 * 2,
        placeholderData: (previousData) => previousData,
    });
};

// --- Mutation Hooks ---

// Add Item Mutation
export const useAddToCart = () => {
    const queryClient = useQueryClient();
    // 2. Get authentication status and navigation hook
    const isAuthenticated = !!useAuthStore((state) => state.token);
    const navigate = useNavigate();

    return useMutation<CartApiResponse, Error, AddItemInput>({
        mutationFn: addItemToBackendCart,

        // 3. ADD ONMUTATE PRE-CHECK LOGIC
        onMutate: async () => {
            if (!isAuthenticated) {
                // Abort the mutation and throw an error with instructions
                throw new Error("AUTH_REQUIRED: You must be logged in to add items to the cart.");
            }
            // If authenticated, allow mutation to proceed
        },

        onSuccess: (data) => {
            queryClient.setQueryData(cartQueryKeys.currentUser(), data);
            console.log('Item added, cart cache updated:', data);
        },
        onError: (error) => {
            // Handle the specific authentication error thrown above
            if (error.message.startsWith("AUTH_REQUIRED")) {
                // We use navigate here, ensuring the user sees the login prompt
                navigate('/login');
            }
            // For general API errors, let the component handle the toast message
            console.error('Failed to add item:', error);
        },
    });
};

// Update Item Quantity Mutation (Remains the same)
export const useUpdateCartItem = () => {
    const queryClient = useQueryClient();
    // Check auth status/navigate here too, if this mutation is callable when user is logged out
    const isAuthenticated = !!useAuthStore((state) => state.token);
    const navigate = useNavigate();
    
    return useMutation<CartApiResponse, Error, UpdateItemInput>({
        mutationFn: updateBackendCartItem,
        onMutate: async () => { if (!isAuthenticated) throw new Error("AUTH_REQUIRED: Please log in."); }, // Add protection
        onError: (error) => { if (error.message.startsWith("AUTH_REQUIRED")) navigate('/login'); },
        onSuccess: (data) => {
            queryClient.setQueryData(cartQueryKeys.currentUser(), data);
            console.log('Item updated, cart cache updated:', data);
        },
    });
};

// Remove Item Mutation (Remains the same)
export const useRemoveCartItem = () => {
    const queryClient = useQueryClient();
    // Check auth status/navigate here too
    const isAuthenticated = !!useAuthStore((state) => state.token);
    const navigate = useNavigate();

    return useMutation<CartApiResponse, Error, RemoveItemInput>({
        mutationFn: removeBackendCartItem,
        onMutate: async () => { if (!isAuthenticated) throw new Error("AUTH_REQUIRED: Please log in."); }, // Add protection
        onError: (error) => { if (error.message.startsWith("AUTH_REQUIRED")) navigate('/login'); },
        onSuccess: (data) => {
            queryClient.setQueryData(cartQueryKeys.currentUser(), data);
            console.log('Item removed, cart cache updated:', data);
        },
    });
};

// Clear Cart Mutation (Remains the same)
export const useClearCart = () => {
    const queryClient = useQueryClient();
    // Check auth status/navigate here too
    const isAuthenticated = !!useAuthStore((state) => state.token);
    const navigate = useNavigate();

    return useMutation<CartApiResponse, Error, void>({
        mutationFn: clearBackendCart,
        onMutate: async () => { if (!isAuthenticated) throw new Error("AUTH_REQUIRED: Please log in."); }, // Add protection
        onError: (error) => { if (error.message.startsWith("AUTH_REQUIRED")) navigate('/login'); },
        onSuccess: (data) => {
            queryClient.setQueryData(cartQueryKeys.currentUser(), data);
            console.log('Cart cleared, cart cache updated:', data);
        },
    });
};