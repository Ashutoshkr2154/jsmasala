import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Seo } from '@/components/common/Seo';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useRegister } from '@/hooks/useAuth';

// Validation schema for registration
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
type RegisterSchema = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterSchema> = (data) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        // Send user to their new profile page
        navigate('/profile', { replace: true });
      },
    });
  };

  return (
    <>
      <Seo title="Create Account" description="Create a new JSM Masala account." />
      <div className="container flex min-h-[70vh] items-center justify-center py-12">
        <div className="w-full max-w-md rounded-lg border bg-white p-8 shadow-md">
          <h1 className="text-3xl font-extrabold font-heading text-center mb-6">
            Create an Account
          </h1>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Name"
              type="text"
              {...register('name')}
              error={errors.name?.message}
              autoComplete="name"
            />
            <Input
              label="Email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              {...register('password')}
              error={errors.password?.message}
              autoComplete="new-password"
            />
            
            {registerMutation.isError && (
              <p className="text-sm text-red-600 text-center">
                Could not create account. An account with this email may already exist.
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              isLoading={registerMutation.isPending}
            >
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Button variant="link" to="/login" className="p-0">
              Login
            </Button>
          </p>
        </div>
      </div>
    </>
  );
}