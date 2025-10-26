import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Seo } from '@/components/common/Seo';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useLogin } from '@/hooks/useAuth';

// Validation schema for login
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLogin();
  
  // Get the 'from' path saved by ProtectedRoute, default to profile
  const from = location.state?.from?.pathname || '/profile';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginSchema> = (data) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        // Send user back to where they came from
        navigate(from, { replace: true });
      },
    });
  };

  return (
    <>
      <Seo title="Login" description="Login to your JSM Masala account." />
      <div className="container flex min-h-[70vh] items-center justify-center py-12">
        <div className="w-full max-w-md rounded-lg border bg-white p-8 shadow-md">
          <h1 className="text-3xl font-extrabold font-heading text-center mb-6">
            Welcome Back
          </h1>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              autoComplete="current-password"
            />
            
            {/* Show a general error from the API */}
            {loginMutation.isError && (
              <p className="text-sm text-red-600 text-center">
                Invalid email or password. Please try again.
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              isLoading={loginMutation.isPending}
            >
              Login
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Button variant="link" to="/register" className="p-0">
              Sign up
            </Button>
          </p>
        </div>
      </div>
    </>
  );
}