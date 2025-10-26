import { CreditCard, Landmark, CircleDot, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/common/Button';

type PaymentFormProps = {
  onBack: () => void;
  onSubmit: () => void;
};

/**
 * A UI-only placeholder for the payment step.
 * In a real app, this would integrate with Stripe/Razorpay.
 */
export function PaymentForm({ onBack, onSubmit }: PaymentFormProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold font-heading mb-6">Payment</h2>
      <p className="text-gray-600 mb-6">
        This is a demo. No real payment will be processed.
      </p>
      
      {/* Payment Method Selector */}
      <fieldset className="space-y-4">
        <legend className="sr-only">Payment Method</legend>
        
        {/* Credit Card (Selected) */}
        <label className="flex items-center p-4 border rounded-lg ring-2 ring-brand-primary border-brand-primary cursor-pointer">
          <input type="radio" name="payment-method" className="h-5 w-5 text-brand-primary focus:ring-brand-primary" defaultChecked />
          <div className="ml-4 flex-1">
            <p className="font-semibold">Credit/Debit Card</p>
            <p className="text-sm text-gray-500">Pay with Visa, Mastercard, RuPay</p>
          </div>
          <CreditCard className="h-6 w-6 text-gray-600" />
        </label>
        
        {/* UPI */}
        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-gray-400">
          <input type="radio" name="payment-method" className="h-5 w-5 text-brand-primary focus:ring-brand-primary" />
          <div className="ml-4 flex-1">
            <p className="font-semibold">UPI</p>
            <p className="text-sm text-gray-500">Pay with any UPI app</p>
          </div>
          <CircleDot className="h-6 w-6 text-gray-600" />
        </label>
        
        {/* Net Banking */}
        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-gray-400">
          <input type="radio" name="payment-method" className="h-5 w-5 text-brand-primary focus:ring-brand-primary" />
          <div className="ml-4 flex-1">
            <p className="font-semibold">Net Banking</p>
            <p className="text-sm text-gray-500">All major banks supported</p>
          </div>
          <Landmark className="h-6 w-6 text-gray-600" />
        </label>
      </fieldset>
      
      {/* Fake Form */}
      <div className="mt-6 space-y-4 p-4 border rounded-lg bg-gray-50">
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-6">
            <label htmlFor="card-number" className="block text-sm font-medium">Card Number</label>
            <input type="text" id="card-number" placeholder="1234 5678 9012 3456" className="w-full rounded-md border-gray-300" />
          </div>
          <div className="col-span-4">
            <label htmlFor="card-expiry" className="block text-sm font-medium">Expiry (MM/YY)</label>
            <input type="text" id="card-expiry" placeholder="MM / YY" className="w-full rounded-md border-gray-300" />
          </div>
          <div className="col-span-2">
            <label htmlFor="card-cvc" className="block text-sm font-medium">CVC</label>
            <input type="text" id="card-cvc" placeholder="123" className="w-full rounded-md border-gray-300" />
          </div>
        </div>
      </div>
      
      <p className="flex items-center text-sm text-green-700 mt-4">
        <ShieldCheck className="h-5 w-5 mr-2" />
        Your payment is secure and encrypted.
      </p>

      {/* Navigation */}
      <div className="mt-8 flex flex-col-reverse sm:flex-row justify-between gap-4">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={onBack}
        >
          Back to Shipping
        </Button>
        <Button
          type="button"
          size="lg"
          onClick={onSubmit}
        >
          Place Order (Mock)
        </Button>
      </div>
    </div>
  );
}