import { render, screen, fireEvent } from '@testing-library/react';
import { Filters } from '@/components/product/Filters';
import { useSearchParams } from 'react-router-dom';

describe('Filters', () => {
  const mockSetSearchParams = jest.fn();
  
  beforeEach(() => {
    // Reset mocks
    mockSetSearchParams.mockClear();
    (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams(), mockSetSearchParams]);
  });

  it('renders filter categories and prices', () => {
    render(<Filters />);
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Blends')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByLabelText('Under ₹100')).toBeInTheDocument();
  });

  it('calls setSearchParams when a category is checked', () => {
    render(<Filters />);
    fireEvent.click(screen.getByLabelText('Blends'));

    expect(mockSetSearchParams).toHaveBeenCalledTimes(1);
    const newParams = mockSetSearchParams.mock.calls[0][0] as URLSearchParams;
    expect(newParams.get('category')).toBe('Blends');
    expect(newParams.get('page')).toBe('1');
  });

  it('calls setSearchParams when a price is selected', () => {
    render(<Filters />);
    fireEvent.click(screen.getByLabelText('₹100 to ₹200'));
    
    expect(mockSetSearchParams).toHaveBeenCalledTimes(1);
    const newParams = mockSetSearchParams.mock.calls[0][0] as URLSearchParams;
    expect(newParams.get('price')).toBe('100-200');
    expect(newParams.get('page')).toBe('1');
  });
});