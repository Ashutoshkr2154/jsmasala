import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/types';
import { useCartStore } from '@/store/useCartStore';

// Mock product data
const mockProduct: Product = {
  id: 'p_001',
  name: 'JSM Organic Turmeric',
  slug: 'organic-turmeric',
  images: ['/test-img.jpg'],
  variants: [{ id: 'v_001', pack: '200g', price: 129, mrp: 149, stock: 120 }],
  rating: 4.7,
  reviewsCount: 86,
  category: 'Turmeric',
  tags: ['organic'],
  shortDescription: 'Pure organic turmeric',
  description: 'Full description',
  isFeatured: true,
};

describe('ProductCard', () => {
  const addItem = useCartStore.getState().addItem;

  beforeEach(() => {
    // Reset mocks before each test
    (addItem as jest.Mock).mockClear();
  });

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('JSM Organic Turmeric')).toBeInTheDocument();
    expect(screen.getByText('Turmeric')).toBeInTheDocument();
    expect(screen.getByText('₹129')).toBeInTheDocument();
    expect(screen.getByText('₹149')).toBeInTheDocument();
    expect(screen.getByText('(86)')).toBeInTheDocument();
  });

  it('calls addItemToCart when "Add to cart" button is clicked', () => {
    render(<ProductCard product={mockProduct} />);

    const addToCartButton = screen.getByLabelText('Add to cart');
    fireEvent.click(addToCartButton);

    expect(addItem).toHaveBeenCalledTimes(1);
    expect(addItem).toHaveBeenCalledWith({
      productId: 'p_001',
      variantId: 'v_001',
      name: 'JSM Organic Turmeric',
      image: '/test-img.jpg',
      pack: '200g',
      price: 129,
      quantity: 1,
      stock: 120,
    });
  });

  it('disables "Add to cart" button when out of stock', () => {
    const outOfStockProduct = {
      ...mockProduct,
      variants: [{ ...mockProduct.variants[0], stock: 0 }],
    };
    render(<ProductCard product={outOfStockProduct} />);

    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    const addToCartButton = screen.getByLabelText('Add to cart');
    expect(addToCartButton).toBeDisabled();
  });
});