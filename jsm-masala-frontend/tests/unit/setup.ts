// tests/unit/setup.ts
import '@testing-library/jest-dom';

// Mock 'react-router-dom'
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(() => console.log('Mocked navigate')),
  useLocation: () => ({
    pathname: '/',
    state: null,
    search: '',
    hash: '',
  }),
  useSearchParams: () => [new URLSearchParams(), jest.fn()],
  Link: ({ children, to }: { children: React.ReactNode; to: string }) =>
    `<a href="${to}">${children}</a>`,
}));

// Mock 'react-helmet-async'
jest.mock('react-helmet-async', () => ({
  Helmet: ({ children }: { children: React.ReactNode }) => `<helmet>${children}</helmet>`,
  HelmetProvider: ({ children }: { children: React.ReactNode }) => `<div>${children}</div>`,
}));

// Mock 'zustand' stores
jest.mock('@/store/useCartStore', () => {
  // --- FIX: Removed extra '}' ---
  const { create } = jest.requireActual('zustand');
  const store = create(() => ({
    items: [],
    isOpen: false,
    addItem: jest.fn(),
    removeItem: jest.fn(),
    updateQuantity: jest.fn(),
    clearCart: jest.fn(),
    openCart: jest.fn(),
    closeCart: jest.fn(),
    toggleCart: jest.fn(),
    setItems: jest.fn(), // <-- Added missing action
  }));
  return { useCartStore: store };
});

jest.mock('@/store/useAuthStore', () => {
  // --- FIX: Removed extra '}' ---
  const { create } = jest.requireActual('zustand');
  const store = create(() => ({
    user: null,
    token: null,
    login: jest.fn(),
    logout: jest.fn(),
    setAccessToken: jest.fn(), // <-- Added missing action
  }));
  return { useAuthStore: store };
});

// --- ADDED: Mock for useWishlistStore ---
// This is needed for components that use the wishlist
jest.mock('@/store/useWishlistStore', () => {
  const { create } = jest.requireActual('zustand');
  const store = create(() => ({
    items: [],
    setItems: jest.fn(),
    isInWishlist: jest.fn(() => false), // Mock implementation
  }));
  return { useWishlistStore: store };
});