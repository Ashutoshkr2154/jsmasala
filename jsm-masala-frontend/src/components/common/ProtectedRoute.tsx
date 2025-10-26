import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

type ProtectedRouteProps = {
  children?: React.ReactNode;
};

/**
 * A component to protect routes that require authentication.
 *
 * It checks for a user in the 'useAuthStore'.
 * If no user exists, it redirects to the '/login' page,
 * saving the user's intended destination to redirect back to.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to in the state. This allows us to send them back there
    // after they log in.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If 'children' are provided, render them.
  // Otherwise, render the nested routes (e.g., in App.tsx).
  return children ? <>{children}</> : <Outlet />;
}