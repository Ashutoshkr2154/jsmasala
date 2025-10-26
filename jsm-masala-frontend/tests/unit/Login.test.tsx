import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/pages/Login';
import { useLogin } from '@/hooks/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the useLogin hook
jest.mock('@/hooks/useAuth', () => ({
  useLogin: jest.fn(),
  useLogout: jest.fn(), // Also mock other exports from the same file
  useRegister: jest.fn(),
}));

const queryClient = new QueryClient();
const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('LoginPage', () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    mockMutate.mockClear();
    (useLogin as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
    });
  });

  it('renders login form', () => {
    render(<LoginPage />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<LoginPage />, { wrapper: Wrapper });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByText('Invalid email address')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
  });

  it('calls login mutation with form data on submit', async () => {
    render(<LoginPage />, { wrapper: Wrapper });

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledTimes(1);
      expect(mockMutate).toHaveBeenCalledWith(
        { email: 'test@example.com', password: 'password123' },
        expect.any(Object)
      );
    });
  });
});