// src/pages/Checkout.tsx
import { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Lock, XCircle, ShoppingCart } from 'lucide-react';

// --- Imports for Data and State ---
import { useCart } from '@/hooks/useCart.ts';
import { useCreateOrder } from '@/hooks/useOrders.ts';
import { useProfile } from '@/hooks/useAuth.ts';
import { AddressSchema, addressSchema } from '@/lib/schemas.ts';
import { useCartStore } from '@/store/useCartStore.ts';

// --- Component Imports ---
import { Seo } from '@/components/common/Seo.tsx';
import { Button } from '@/components/common/Button.tsx';
import { Input } from '@/components/common/Input.tsx';
import { OrderSummary } from '@/components/checkout/OrderSummary.tsx';

const steps = ['Shipping', 'Payment'];
type CheckoutStep = 'Shipping' | 'Payment';

export default function CheckoutPage() {
  const navigate = useNavigate();

  // --- State Management ---
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('Shipping');
  const [shippingData, setShippingData] = useState<AddressSchema | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('MockPayment');

  // --- Data Fetching Hooks ---
  const { data: cart, isLoading: isCartLoading, isError: isCartError } = useCart();
  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  const createOrderMutation = useCreateOrder();
  const { items: cartItems } = useCartStore();

  // --- Form Hook (React Hook Form + Zod) ---
  const methods = useForm<AddressSchema>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: '', lastName: '', email: '', phone: '',
      address: '', apartment: '', city: '', state: '', zipCode: '',
      country: 'India',
    },
  });

  // Effect to pre-fill form once profile loads
  useEffect(() => {
    if (profile) {
      methods.reset({
        firstName: profile.name?.split(' ')[0] || '',
        lastName: profile.name?.split(' ')[1] || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address?.street || '',
        apartment: profile.address?.apartment || '',
        city: profile.address?.city || '',
        state: profile.address?.state || '',
        zipCode: profile.address?.zipCode || '',
        country: profile.address?.country || 'India',
      });
    }
  }, [profile, methods]);


  // --- Handlers ---
  const onShippingSubmit: SubmitHandler<AddressSchema> = (data) => {
    setShippingData(data);
    setCurrentStep('Payment');
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = async () => {
    if (!shippingData || !paymentMethod || createOrderMutation.isPending) {
      return;
    }

    createOrderMutation.mutate(
      {
        shippingAddress: shippingData,
        paymentMethod: paymentMethod,
      },
      {
        onSuccess: (createdOrder) => {
          navigate(`/order/success/${createdOrder._id}`);
        },
        onError: (error) => {
          console.error('Order placement failed:', error);
        },
      }
    );
  };

  // --- Early Exit & Error States ---
  if (isLoadingProfile || (isCartLoading && !cart)) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (isCartError) {
     return (
       <div className="container py-20 text-center text-red-600">
         <XCircle className="h-16 w-16 mx-auto mb-4" />
         <h1 className="text-3xl font-bold">Error</h1>
         <p className="mt-2 text-lg">Could not load your cart. Please try again.</p>
       </div>
     );
  }

  if (!isCartLoading && (!cart || cart.items.length === 0)) {
     return (
        <div className="container py-20 text-center">
            <ShoppingCart className="h-16 w-16 mx-auto text-gray-400" />
            <h1 className="text-3xl font-bold mt-4">Your cart is empty.</h1>
            <p className="mt-2 text-lg">You cannot proceed to checkout with an empty cart.</p>
            {/* === THIS IS THE FIX ===
              * Changed from <Button asChild>...<Link>...
              * To <Button to="...">...
            */}
            <Button to="/shop" className="mt-6">
                Back to Shop
            </Button>
            {/* === END OF FIX === */}
        </div>
     );
  }

  return (
    <>
      <Seo title="Checkout" description="Complete your JSM Masala order." />
      <div className="container py-12">
        <h1 className="text-4xl font-extrabold font-heading text-center mb-8">
          Checkout
        </h1>
        
        {/* Step Indicator (Simplified) */}
        <div className="flex justify-center items-center w-full max-w-md mx-auto mb-12 space-x-2">
            <span className={`font-semibold ${currentStep === 'Shipping' ? 'text-brand-primary' : 'text-gray-500'}`}>
                1. Shipping
            </span>
             <span className="text-gray-300">&gt;</span>
            <span className={`font-semibold ${currentStep === 'Payment' ? 'text-brand-primary' : 'text-gray-500'}`}>
                2. Payment
            </span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Main Content (Left/Center) */}
          <div className="lg:col-span-1">
            
            {/* --- Step 1: Shipping Form --- */}
            {currentStep === 'Shipping' && (
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onShippingSubmit)}>
                   <h2 className="text-2xl font-bold font-heading mb-6">Shipping Information</h2>
                   <div className="space-y-4">
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <Input label="First Name" {...methods.register('firstName')} error={methods.formState.errors.firstName?.message} />
                           <Input label="Last Name" {...methods.register('lastName')} error={methods.formState.errors.lastName?.message} />
                       </div>
                       <Input label="Email" type="email" {...methods.register('email')} error={methods.formState.errors.email?.message} />
                       <Input label="Phone" type="tel" {...methods.register('phone')} error={methods.formState.errors.phone?.message} />
                       <Input label="Address" {...methods.register('address')} error={methods.formState.errors.address?.message} />
                       <Input label="Apartment, suite, etc. (optional)" {...methods.register('apartment')} error={methods.formState.errors.apartment?.message} />
                       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                           <Input label="City" {...methods.register('city')} error={methods.formState.errors.city?.message} />
                           <Input label="State" {...methods.register('state')} error={methods.formState.errors.state?.message} />
                           <Input label="Zip Code" {...methods.register('zipCode')} error={methods.formState.errors.zipCode?.message} />
                       </div>
                   </div>
                   <Button type="submit" size="lg" className="w-full mt-8">
                        Continue to Payment
                   </Button>
                </form>
              </FormProvider>
            )}

            {/* --- Step 2: Payment Method --- */}
            {currentStep === 'Payment' && (
              <div>
                  <h2 className="text-2xl font-bold font-heading mb-6">Payment</h2>
                  <div className="rounded-lg border bg-white p-6 shadow-sm">
                      <p className="text-lg font-medium mb-4">Payment Method</p>
                      <div className="p-4 border rounded-md bg-gray-50">
                          <label className="flex items-center">
                              <input type="radio" name="payment-method" className="h-5 w-5 text-brand-primary" checked readOnly />
                              <span className="ml-3 font-medium">Mock Payment Gateway (Test)</span>
                          </label>
                           <p className="text-sm text-gray-500 ml-8 mt-2">
                               This is a test environment. No real payment will be processed.
                           </p>
                      </div>
                      
                      {createOrderMutation.isError && (
                          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md my-6">
                              <p className="font-bold">Order Placement Failed</p>
                              <p>{createOrderMutation.error.message || 'An unknown error occurred.'}</p>
                          </div>
                      )}

                      <div className="mt-8 flex flex-col-reverse sm:flex-row justify-between gap-4">
                           <Button type="button" variant="secondary" size="lg" onClick={() => setCurrentStep('Shipping')}>
                                Back to Shipping
                           </Button>
                           <Button
                              type="button"
                              size="lg"
                              onClick={handlePlaceOrder}
                              disabled={createOrderMutation.isPending || !shippingData}
                              isLoading={createOrderMutation.isPending}
                            >
                              <Lock className="h-4 w-4 mr-2" />
                              Place Order
                           </Button>
                      </div>
                  </div>
              </div>
            )}
          </div>

          {/* Sidebar: Order Summary */}
          <aside className="lg:col-span-1 sticky top-28 h-fit">
            <h2 className="text-2xl font-bold font-heading mb-6 lg:hidden">Order Summary</h2>
            <OrderSummary isCheckoutPage={true} items={cartItems} /> 
          </aside>
        </div>
      </div>
    </>
  );
}