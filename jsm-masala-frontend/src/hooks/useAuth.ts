import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore.ts'; // Ensure .ts
import { loginUser, registerUser, fetchUserProfile } from '@/services/api.ts'; // Ensure .ts and import api functions
import { User } from '@/types/index.ts'; // Ensure .ts

// Define types used by the mutations
type LoginCredentials = Parameters<typeof loginUser>[0];
type RegisterDetails = Parameters<typeof registerUser>[0];
type AuthData = Awaited<ReturnType<typeof loginUser>>; // Extracts the response type

// --- Login Mutation ---
export const useLogin = () => {
  const loginToStore = useAuthStore((state) => state.login);

  return useMutation<AuthData, Error, LoginCredentials>({ // Define types: Response, Error, Input
    mutationFn: loginUser, // Use the API function
    onSuccess: (data) => {
      // Extract user details from the backend response
      const userDetails: User = {
          _id: data._id, // Use _id from backend
          name: data.name,
          email: data.email,
          role: data.role,
          // Add other fields if backend sends them
      };
      // Save user details and token to Zustand store
      loginToStore(userDetails, data.accessToken);
      // NOTE: We are currently ignoring data.refreshToken from the response.
      // A more robust solution would store this securely (e.g., HttpOnly cookie managed by backend).
    },
    onError: (error) => {
      console.error('Login failed:', error);
      // Frontend components can handle showing error messages based on mutation.isError
    },
  });
};

// --- Register Mutation ---
export const useRegister = () => {
  const loginToStore = useAuthStore((state) => state.login);

  return useMutation<AuthData, Error, RegisterDetails>({
    mutationFn: registerUser,
    onSuccess: (data) => {
      // Log the user in immediately after registration
       const userDetails: User = {
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
      };
      loginToStore(userDetails, data.accessToken);
      // Ignoring refreshToken here too
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });
};

// --- Logout Mutation ---
export const useLogout = () => {
  const queryClient = useQueryClient();
  const logoutFromStore = useAuthStore((state) => state.logout);

  return useMutation<void, Error, void>({ // No specific input or output needed
    mutationFn: async () => {
      // Optional: Call a backend logout endpoint if it exists
      // await api.post('/auth/logout');

      // Primarily, just clear local state
      logoutFromStore();
    },
    onSuccess: () => {
      // Clear all React Query cache on logout
      queryClient.clear();
      console.log('User logged out, query cache cleared.');
    },
     onError: (error) => {
      console.error('Logout failed:', error);
      // Even if backend call fails, attempt to clear local state
      logoutFromStore();
      queryClient.clear();
    },
  });
};

// --- User Profile Query ---
// Hook to fetch the currently logged-in user's profile
export const useProfile = () => {
    const isAuthenticated = !!useAuthStore((state) => state.token); // Check if user is logged in

    return useQuery<User, Error>({
        queryKey: ['profile', 'me'], // Unique key for this query
        queryFn: fetchUserProfile,   // API function to call
        enabled: isAuthenticated,   // Only run the query if the user is authenticated
        staleTime: 1000 * 60 * 5, // Keep profile data fresh for 5 minutes
        // Optional: Add retry logic, etc.
    });
};