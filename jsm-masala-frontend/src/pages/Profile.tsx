// src/pages/Profile.tsx
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, XCircle, Package } from 'lucide-react'; // Import icons

// Import hooks and store
import { Seo } from '@/components/common/Seo.tsx';
import { Button } from '@/components/common/Button.tsx';
import { useAuthStore } from '@/store/useAuthStore.ts';
import { useLogout } from '@/hooks/useAuth.ts';
import { useMyOrders } from '@/hooks/useOrders.ts'; // <-- 1. Import useMyOrders hook
import { formatPrice } from '@/utils/helpers.ts'; // <-- Import formatPrice

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogout();
  const navigate = useNavigate();

  // 2. Fetch user's orders
  const { data: orders, isLoading, isError, error } = useMyOrders();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate('/'); // Redirect to homepage on successful logout
      },
    });
  };

  // Fallback if user data isn't loaded yet (though ProtectedRoute should handle this)
  if (!user) {
    return (
        <div className="flex justify-center items-center h-[60vh]">
            <Loader2 className="h-12 w-12 animate-spin text-brand-primary" />
        </div>
    );
  }

  return (
    <>
      <Seo title="Your Profile" description="Manage your account and view orders." />
      <div className="container py-12">
        <div className="flex flex-col sm:flex-row justify-between items-baseline mb-8 gap-4">
            <h1 className="text-3xl lg:text-4xl font-extrabold font-heading">
            Welcome, {user.name}!
            </h1>
            {/* Moved logout button to top for easier access */}
             <Button
                variant="accent"
                onClick={handleLogout}
                isLoading={logoutMutation.isPending}
                size="sm" // Smaller button
              >
                Logout
              </Button>
        </div>
        <p className="text-lg text-gray-600 mb-8">
          Manage your addresses, view your order history, and update your details.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">

          {/* === Main Content: Order History === */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold font-heading mb-6">Order History</h2>

            {/* 3. Handle Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-10 rounded-lg border bg-white min-h-[200px]">
                <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
              </div>
            )}

            {/* 4. Handle Error State */}
            {isError && !isLoading && (
              <div className="rounded-lg border bg-red-50 p-6 text-center text-red-700 min-h-[200px]">
                <XCircle className="h-10 w-10 mx-auto mb-2" />
                <p className="font-semibold">Could not load order history.</p>
                {import.meta.env.DEV && <p className="text-xs mt-1">{error?.message}</p>}
              </div>
            )}

            {/* 5. Handle Empty State */}
            {!isLoading && !isError && (!orders || orders.length === 0) && (
              <div className="rounded-lg border bg-white p-8 text-center min-h-[200px]">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg text-gray-500 mb-6">You haven't placed any orders yet.</p>
                <Button to="/shop">Start Shopping</Button>
              </div>
            )}

            {/* 6. Display Orders List */}
            {!isLoading && !isError && orders && orders.length > 0 && (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                      <span className="font-semibold text-lg text-brand-primary">Order #{order.orderId}</span>
                      <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${
                          order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                          order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800' // Pending or Processing
                      }`}>
                          {order.orderStatus}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                       <p>
                         Placed On: {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                       </p>
                       <p>Total: <span className="font-medium text-gray-800">{formatPrice(order.totalPrice)}</span> ({order.items.length} item{order.items.length !== 1 ? 's' : ''})</p>
                    </div>
                     {/* Optional: Link to a future Order Detail Page */}
                    {/* <div className="mt-3 text-right">
                       <Button to={`/order/${order._id}`} variant="link" size="sm" className="p-0 h-auto">
                         View Details
                       </Button>
                    </div> */}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* === End Order History === */}


          {/* Sidebar (Account Details) */}
          <aside className="sticky top-28 h-fit"> {/* Added sticky */}
            <h2 className="text-2xl font-bold font-heading mb-6">Account Details</h2>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-lg font-semibold">{user.name}</p>
              </div>
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-lg font-semibold">{user.email}</p>
              </div>
              {/* Add buttons for future features */}
              {/* <Button variant="secondary" className="w-full mb-3">Manage Addresses</Button> */}
              {/* <Button variant="secondary" className="w-full mb-3">Update Profile</Button> */}
              {/* Logout button moved to top */}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}