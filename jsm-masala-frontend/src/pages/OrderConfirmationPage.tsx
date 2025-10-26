// src/pages/OrderConfirmationPage.tsx
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Seo } from '@/components/common/Seo.tsx';
import { Button } from '@/components/common/Button.tsx';
import { useOrderDetails } from '@/hooks/useOrders.ts'; // Import hook
import { formatPrice } from '@/utils/helpers.ts';

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>(); // MongoDB _id
  
  // Fetch order details using the ID from the URL
  const { data: order, isLoading } = useOrderDetails(orderId);

  return (
    <>
      <Seo title="Order Confirmed!" />
      <div className="container py-20 text-center">
        <CheckCircle className="h-20 w-20 mx-auto text-green-600" />
        <h1 className="mt-6 text-4xl font-extrabold font-heading">
          Thank You For Your Order!
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Your order has been placed successfully. A confirmation email is on its way.
        </p>

        {isLoading && (
            <div className="flex justify-center items-center h-24">
                <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
            </div>
        )}

        {order && (
            <div className="mt-8 bg-gray-50 border rounded-lg p-6 max-w-md mx-auto text-left divide-y">
               <div className="py-2">
                   <span className="text-sm text-gray-500">Order ID:</span>
                   <p className="font-semibold text-brand-primary">{order.orderId}</p> {/* Display custom ID */}
               </div>
                <div className="py-2">
                   <span className="text-sm text-gray-500">Total Amount:</span>
                   <p className="text-lg font-bold">{formatPrice(order.totalPrice)}</p>
               </div>
                <div className="py-2">
                   <span className="text-sm text-gray-500">Status:</span>
                   <p className="font-semibold">{order.orderStatus}</p>
               </div>
            </div>
        )}

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Button to="/profile" variant="secondary" size="lg">
            View Your Orders
          </Button>
          <Button to="/shop" size="lg">
            Continue Shopping
          </Button>
        </div>
      </div>
    </>
  );
}