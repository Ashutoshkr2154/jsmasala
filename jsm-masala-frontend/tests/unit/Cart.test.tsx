import { render, screen, fireEvent } from '@testing-library/react';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { useCartStore } from '@/store/useCartStore';
import { CartItem } from '@/types';

const mockItems: CartItem[] = [
  { productId: 'p1', variantId: 'v1', name: 'Turmeric', image: 'img.jpg', pack: '100g', price: 100, quantity: 2, stock: 10 },
  { productId: 'p2', variantId: 'v2', name: 'Chili Powder', image: 'img2.jpg', pack: '200g', price: 150, quantity: 1, stock: 10 },
];

describe('CartDrawer', () => {
  it('renders empty cart message when no items are present', () => {
    useCartStore.setState({ items: [], isOpen: true });
    render(<CartDrawer />);
    
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('renders cart items and subtotal when items are present', () => {
    useCartStore.setState({ items: mockItems, isOpen: true });
    render(<CartDrawer />);

    expect(screen.getByText('Turmeric')).toBeInTheDocument();
    expect(screen.getByText('Chili Powder')).toBeInTheDocument();
    
    // Subtotal = (100 * 2) + (150 * 1) = 350
    expect(screen.getByText('₹350')).toBeInTheDocument();
  });

  it('calls closeCart when the close button is clicked', () => {
    const closeCart = useCartStore.getState().closeCart;
    useCartStore.setState({ items: [], isOpen: true });
    render(<CartDrawer />);

    fireEvent.click(screen.getByLabelText('Close cart panel'));
    expect(closeCart).toHaveBeenCalledTimes(1);
  });
});