import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressSchema, AddressSchema } from '@/lib/schemas';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';

type AddressFormProps = {
  onSubmit: SubmitHandler<AddressSchema>;
};

/**
 * A reusable address form for shipping/billing,
 * built with React Hook Form and Zod for validation.
 */
export function AddressForm({ onSubmit }: AddressFormProps) {
  // 1. Initialize React Hook Form
  const methods = useForm<AddressSchema>({
    resolver: zodResolver(addressSchema),
    // We could pre-populate this from the auth store
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  return (
    // 2. Wrap the form in FormProvider to pass down methods
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-2xl font-bold font-heading mb-6">
          Shipping Information
        </h2>
        
        <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
          {/* Email */}
          <div className="sm:col-span-6">
            <Input
              label="Email"
              {...methods.register('email')}
              error={errors.email?.message}
            />
          </div>

          {/* First & Last Name */}
          <div className="sm:col-span-3">
            <Input
              label="First name"
              {...methods.register('firstName')}
              error={errors.firstName?.message}
            />
          </div>
          <div className="sm:col-span-3">
            <Input
              label="Last name"
              {...methods.register('lastName')}
              error={errors.lastName?.message}
            />
          </div>

          {/* Address */}
          <div className="sm:col-span-6">
            <Input
              label="Address"
              {...methods.register('address')}
              error={errors.address?.message}
            />
          </div>
          <div className="sm:col-span-6">
            <Input
              label="Apartment, suite, etc. (optional)"
              {...methods.register('apartment')}
              error={errors.apartment?.message}
            />
          </div>
          
          {/* City, State, Zip */}
          <div className="sm:col-span-2">
            <Input
              label="City"
              {...methods.register('city')}
              error={errors.city?.message}
            />
          </div>
          <div className="sm:col-span-2">
            <Input
              label="State / Province"
              {...methods.register('state')}
              error={errors.state?.message}
            />
          </div>
          <div className="sm:col-span-2">
            <Input
              label="Zip / Postal code"
              {...methods.register('zipCode')}
              error={errors.zipCode?.message}
            />
          </div>
          
          {/* Phone */}
          <div className="sm:col-span-6">
            <Input
              label="Phone"
              type="tel"
              {...methods.register('phone')}
              error={errors.phone?.message}
            />
          </div>
        </div>

        <div className="mt-8">
          <Button type="submit" size="lg" className="w-full sm:w-auto">
            Continue to Payment
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}