// src/pages/Admin/Dashboard.tsx
import React, { useState } from 'react'; // Import useState for local state management
import { Seo } from '@/components/common/Seo.tsx';
import { Button } from '@/components/common/Button.tsx';
import { PlusCircle, Package, ShoppingBag, Users, IndianRupee, Loader2, XCircle, Edit } from 'lucide-react'; // Added Edit icon
// Import all admin hooks
import { useAdminStats, useAdminUsers, useAllOrdersAdmin, useUpdateOrderStatusAdmin } from '@/hooks/useAdmin.ts';
import { formatPrice } from '@/utils/helpers.ts';
import { Link } from 'react-router-dom';
import { Order } from '@/types/index.ts'; // Import Order type

// --- Stat Card Helper Component (remains the same) ---
const StatCard = ({ title, value, icon: Icon, isLoading, isError }: {
  title: string; value: string | number | undefined; icon: React.ElementType; isLoading: boolean; isError: boolean;
}) => ( /* ... StatCard code ... */ );

// --- Order Status Dropdown Component ---
const OrderStatusSelector = ({ order }: { order: Order }) => {
  const [currentStatus, setCurrentStatus] = useState(order.orderStatus);
  const updateStatusMutation = useUpdateOrderStatusAdmin();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Order['orderStatus']; // Cast to valid status type
    setCurrentStatus(newStatus); // Update local state immediately for responsiveness (optional)

    updateStatusMutation.mutate(
      { orderId: order._id, status: newStatus },
      {
        onError: (error) => {
          console.error(`Failed to update order ${order.orderId}:`, error);
          setCurrentStatus(order.orderStatus); // Revert local state on error
          // TODO: Show error toast
        },
        onSuccess: (updatedOrder) => {
          console.log(`Order ${updatedOrder.orderId} status updated to ${updatedOrder.orderStatus}`);
          setCurrentStatus(updatedOrder.orderStatus); // Ensure local state matches server
           // TODO: Show success toast
        },
      }
    );
  };

  const validStatuses: Order['orderStatus'][] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <select
      value={currentStatus}
      onChange={handleStatusChange}
      disabled={updateStatusMutation.isPending} // Disable while updating
      className={`p-1.5 rounded-md border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${
        updateStatusMutation.isPending ? 'bg-gray-100' : 'bg-white border-gray-300'
      } ${
        currentStatus === 'Delivered' ? 'text-green-800 border-green-300' :
        currentStatus === 'Shipped' ? 'text-blue-800 border-blue-300' :
        currentStatus === 'Cancelled' ? 'text-red-800 border-red-300' :
        currentStatus === 'Processing' ? 'text-purple-800 border-purple-300' :
        'text-yellow-800 border-yellow-300' // Pending
      }`}
    >
      {validStatuses.map(status => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
};
// --- End Order Status Dropdown ---


export default function AdminDashboardPage() {
  // Fetch data using hooks
  const { data: stats, isLoading: isLoadingStats, isError: isErrorStats, error: errorStats } = useAdminStats();
  const { data: users, isLoading: isLoadingUsers, isError: isErrorUsers, error: errorUsers } = useAdminUsers();
  // Fetch all orders data
  const { data: orders, isLoading: isLoadingOrders, isError: isErrorOrders, error: errorOrders } = useAllOrdersAdmin();

  return (
    <>
      <Seo title="Admin Dashboard" description="Manage JSM Masala products and orders." />
      <div className="container py-12">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl lg:text-4xl font-extrabold font-heading">Admin Dashboard</h1>
          <Button> {/* TODO: Link to Add Product Page */}
            <PlusCircle className="h-5 w-5 mr-2" /> Add New Product
          </Button>
        </div>

        {/* Admin Stat Widgets */}
        {isErrorStats && (<div className="mb-8 p-4 bg-red-50 ...">Error loading stats...</div>)}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* ... StatCard components ... */}
           <StatCard title="Total Users" value={stats?.users} icon={Users} isLoading={isLoadingStats} isError={isErrorStats} />
           <StatCard title="Total Orders" value={stats?.orders} icon={ShoppingBag} isLoading={isLoadingStats} isError={isErrorStats} />
           <StatCard title="Total Revenue" value={stats?.revenue !== undefined ? formatPrice(stats.revenue) : undefined} icon={IndianRupee} isLoading={isLoadingStats} isError={isErrorStats} />
           <StatCard title="Out of Stock" value={stats?.outOfStockProducts} icon={Package} isLoading={isLoadingStats} isError={isErrorStats} />
        </div>

        {/* --- Orders Table Section START --- */}
        <div className="mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold font-heading mb-6">Manage Orders</h2>
          <div className="rounded-lg border bg-white shadow-sm overflow-x-auto">
            {isLoadingOrders && (
              <div className="flex justify-center items-center py-10 min-h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
              </div>
            )}
            {isErrorOrders && !isLoadingOrders && (
              <div className="p-6 text-center text-red-600 min-h-[300px]">
                <XCircle className="h-10 w-10 mx-auto mb-2" />
                <p className="font-semibold">Could not load orders.</p>
                {import.meta.env.DEV && <p className="text-xs mt-1">{errorOrders?.message}</p>}
              </div>
            )}
            {!isLoadingOrders && !isErrorOrders && orders && (
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-500">No orders found.</td></tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap font-medium text-sm text-brand-primary">{order.orderId}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{order.user?.name || 'N/A'}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                        </td>
                         <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                           {formatPrice(order.totalPrice)}
                         </td>
                        <td className="px-4 py-4 whitespace-nowrap text-xs">
                           {/* === Use OrderStatusSelector Component === */}
                           <OrderStatusSelector order={order} />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          {/* TODO: Link to detailed order view */}
                          <Button variant="link" size="sm" className="p-0 h-auto text-indigo-600 hover:text-indigo-900">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
        {/* --- Orders Table Section END --- */}

        {/* Users Table Section (remains the same) */}
        <div>
           <h2 className="text-2xl lg:text-3xl font-bold font-heading mb-6">Manage Users</h2>
           <div className="rounded-lg border bg-white shadow-sm overflow-x-auto">
               {/* ... User table code ... */}
                {isLoadingUsers && ( <div className="flex ..."><Loader2 ... /></div> )}
                {/* ... Error state ... */}
                {!isLoadingUsers && !isErrorUsers && users && (
                    <table className="w-full min-w-[600px]">
                        {/* ... Table structure ... */}
                    </table>
                )}
           </div>
        </div>

      </div>
    </>
  );
}

// --- Make sure StatCard is defined above or imported ---
const StatCard = ({ title, value, icon: Icon, isLoading, isError }: { title: string, value: string | number | undefined, icon: React.ElementType, isLoading: boolean, isError: boolean }) => (
 <div className="rounded-lg border bg-white p-6 shadow-sm min-h-[120px] flex flex-col justify-between transition-shadow hover:shadow-md">
    <div className="flex justify-between items-start">
      <h2 className="text-lg font-semibold text-gray-600">{title}</h2>
      <Icon className={`h-8 w-8 ${isError ? 'text-red-400' : 'text-blue-500'}`} />
    </div>
    <div className="mt-2">
      {isLoading ? ( <Loader2 className="h-6 w-6 animate-spin text-gray-400" /> )
       : isError ? ( <span className="text-2xl font-bold text-red-500">Error</span> )
       : ( <p className="text-3xl lg:text-4xl font-bold">{value ?? 'N/A'}</p> )}
    </div>
  </div>
);