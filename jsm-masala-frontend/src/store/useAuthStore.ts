import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthState, User } from '@/types/index.ts'; // Assuming AuthActions is defined in types or we define it here

// --- 1. Define AuthActions type ---
// Ensure this matches or is added to your src/types/index.ts
export type AuthActions = {
  login: (user: User, token: string) => void;
  logout: () => void;
  setAccessToken: (token: string) => void; // <-- Add this action
};
// --- End AuthActions ---

// Define the complete store type
type AuthStore = AuthState & AuthActions;

/**
 * Creates a Zustand store for managing user authentication.
 *
 * This store also uses 'persist' middleware to save the user's
 * token and profile, keeping them logged in across sessions.
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // --- STATE ---
      user: null,
      token: null,

      // --- ACTIONS ---

      /**
       * Sets the user and token in the state upon successful login/register.
       */
      login: (user: User, token: string) => {
        set({ user, token });
        // The Axios interceptor automatically picks up the token from here
      },

      /**
       * Clears the user and token from the state upon logout.
       */
      logout: () => {
        set({ user: null, token: null });
        // The Axios interceptor will no longer find a token
      },

      /**
       * --- 2. Add setAccessToken Action ---
       * Updates only the access token in the state.
       * Used by the Axios interceptor after a successful token refresh.
       */
      setAccessToken: (token: string) => {
        set({ token });
      },
      // --- End setAccessToken ---
    }),
    {
      // Configuration for the 'persist' middleware
      name: 'jsm-auth-storage', // Key for localStorage
      storage: createJSONStorage(() => localStorage),
      // We persist the whole state (user and token)
    },
  ),
);