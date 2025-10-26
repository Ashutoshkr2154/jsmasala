/**
 * src/types/index.ts
 *
 * This is the single source of truth for all custom types,
 * interfaces, and shapes used throughout the application.
 */

// --- Product & Catalog ---

/** Represents a single product variant (e.g., 100g, 200g) */
export type ProductVariant = {
  id: string;
  pack: string; // e.g., "100g", "200g", "500g"
  price: number;
  mrp?: number; // Maximum Retail Price (optional, for showing discounts)
  stock: number;
};

/** Represents a full product */
export type Product = {
  id: string;
  name: string;
  slug: string; // URL-friendly name
  images: string[];
  variants: ProductVariant[];
  rating: number;
  reviewsCount: number;
  category: string;
  tags: string[];
  shortDescription: string;
  description: string;
  isFeatured: boolean;
};

/** API response for a list of products */
export type PaginatedProductsResponse = {
  data: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// --- Cart ---

/** Represents a single item added to the shopping cart */
export type CartItem = {
  productId: string;
  variantId: string;
  name: string;
  image: string;
  pack: string;
  price: number;
  quantity: number;
  stock: number; // To check against when incrementing
};

/** Represents the state of the shopping cart */
export type CartState = {
  items: CartItem[];
  isOpen: boolean;
};

/** Defines the actions you can perform on the cart */
export type CartActions = {
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

// --- User & Authentication ---

/** Represents the currently logged-in user */
export type User = {
  id: string;
  name: string;
  email: string;
  // ... any other user fields like addresses, etc.
};

/** Represents the authentication state */
export type AuthState = {
  user: User | null;
  token: string | null;
};

/** Defines the actions you can perform on the auth state */
export type AuthActions = {
  login: (user: User, token: string) => void;
  logout: () => void;
};

// --- API & Forms ---

/** A generic type for API error responses */
export type ApiError = {
  message: string;
  statusCode?: number;
};

/** Shape of the checkout address form */
export type AddressFormValues = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
};