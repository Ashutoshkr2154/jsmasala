import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CheckoutPage from '@/pages/Checkout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('CheckoutPage', () => {
  it('renders shipping form on initial load', () => {
    render(<CheckoutPage />, { wrapper: Wrapper });
    expect(screen.getByText('Shipping Information')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('progresses from shipping to payment step on valid form submission', async () => {
    render(<CheckoutPage />, { wrapper: Wrapper });

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('First name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Address'), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText('City'), { target: { value: 'Anytown' } });
    fireEvent.change(screen.getByLabelText('State / Province'), { target: { value: 'State' } });
    fireEvent.change(screen.getByLabelText('Zip / Postal code'), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText('Phone'), { target: { value: '1234567890' } });

    // Submit
    fireEvent.click(screen.getByRole('button', { name: 'Continue to Payment' }));

    // Wait for the next step to appear
    await waitFor(() => {
      expect(screen.getByText('Payment')).toBeInTheDocument();
    });
  });

  it('progresses to confirmation step after payment', async () => {
    render(<CheckoutPage />, { wrapper: Wrapper });

    // --- 1. Fill shipping (same as last test) ---
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('First name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Address'), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText('City'), { target: { value: 'Anytown' } });
    fireEvent.change(screen.getByLabelText('State / Province'), { target: { value: 'State' } });
    fireEvent.change(screen.getByLabelText('Zip / Postal code'), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText('Phone'), { target: { value: '1234567890' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue to Payment' }));

    // --- 2. Submit payment ---
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Place Order (Mock)' }));
    });

    // --- 3. Check for confirmation ---
    await waitFor(() => {
      expect(screen.getByText('Thank you for your order!')).toBeInTheDocument();
    });
  });
});