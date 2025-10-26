import { z } from 'zod';

/**
 * Zod schema for validating a shipping/billing address.
 */
export const addressSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Must be a valid email address' }),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
  apartment: z.string().optional(),
  city: z.string().min(1, { message: 'City is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  zipCode: z
    .string()
    .min(6, { message: 'Must be a 6-digit zip code' })
    .max(6, { message: 'Must be a 6-digit zip code' }),
  phone: z
    .string()
    .min(10, { message: 'Must be a 10-digit phone number' })
    .regex(/^\d{10}$/, { message: 'Must be a valid 10-digit phone number' }),
});

// We can also create a type from the schema to use in our components
export type AddressSchema = z.infer<typeof addressSchema>;