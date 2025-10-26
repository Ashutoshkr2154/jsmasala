import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/useAuthStore.ts';
import {
  PaginatedProductsResponse,
  Product,
  ProductVariant,
  User,
  CartItem,
  Order,
  // Add Wishlist type if defined in types/index.ts
} from '@/types/index.ts';
import { AddressSchema } from '@/lib/schemas.ts';

// Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Ensure this is true for sending cookies
});

// --- Request Interceptor ---
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);


// --- State and Queue for token refresh ---
let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void; }[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};


// --- UPDATED Response Interceptor ---
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {

      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          if (originalRequest.headers) {
             originalRequest.headers['Authorization'] = 'Bearer ' + token;
          }
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("Attempting token refresh...");
        const { data } = await api.post<{ accessToken: string }>('/auth/refresh');
        const newAccessToken = data.accessToken;
        console.log("Token refresh successful.");

        useAuthStore.getState().setAccessToken(newAccessToken);

        if (originalRequest.headers) {
           originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        }

        processQueue(null, newAccessToken);

        isRefreshing = false;
        return api(originalRequest);

      } catch (refreshError: any) {
        console.error('Refresh token failed:', refreshError?.response?.data?.message || refreshError.message);
        processQueue(refreshError, null);
        isRefreshing = false;
        useAuthStore.getState().logout();
        // window.location.href = '/login'; // Optional redirect
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
// --- END Response Interceptor ---

export default api;

// ==================================
// === API Function Definitions ===
// ==================================

// Helper function (already present)
const createProductFormData = (productData: any, imageFiles?: FileList | null): FormData => { /* ... */ };

// Types (already present)
type AuthResponse = { _id: string; name: string; email: string; role: string; accessToken: string; refreshToken: string; };
type ProductInputData = { name: string; description: string; shortDescription?: string; category: string; variants: Omit<ProductVariant, '_id'>[]; tags?: string[] | string; isFeatured?: boolean; };
type CartApiResponse = { _id: string | null; user: string; items: CartItem[]; totalPrice: number; totalItems: number; createdAt?: string; updatedAt?: string; };
type CreateOrderPayload = { shippingAddress: AddressSchema; paymentMethod: string; paymentResult?: { id: string; status: string; update_time: string; email_address?: string; }; };
type AdminStatsResponse = { users: number; orders: number; revenue: number; outOfStockProducts: number; };
type UpdateOrderStatusPayload = { orderId: string; status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'; };


// --- START: Wishlist API Types & Functions ---
// Define Wishlist API Response Types (matching backend)
type WishlistApiResponse = {
  _id: string | null;
  user: string;
  products: Product[]; // Backend populates products
  createdAt?: string;
  updatedAt?: string;
};

type ToggleWishlistResponse = {
  message: string;
  wishlist: WishlistApiResponse; // Backend returns the updated wishlist
};

// Fetch the user's wishlist
export const fetchWishlist = async (): Promise<WishlistApiResponse> => {
  const { data } = await api.get<WishlistApiResponse>('/wishlist');
  return data || { _id: null, user: '', products: [] }; // Return empty structure if null
};

// Add or remove a product (toggle)
export const toggleBackendWishlist = async (productId: string): Promise<ToggleWishlistResponse> => {
  const { data } = await api.post<ToggleWishlistResponse>('/wishlist', { productId });
  return data;
};
// --- END: Wishlist API Functions ---


// --- Function Exports (keep all shortened versions) ---
export const loginUser = async (credentials) => { const { data } = await api.post('/auth/login', credentials); return data; };
export const registerUser = async (details) => { const { data } = await api.post('/auth/register', details); return data; };
export const fetchProducts = async (params) => { const { data } = await api.get('/products', { params }); return data; };
export const fetchProductByIdOrSlug = async (idOrSlug) => { const { data } = await api.get(`/products/${idOrSlug}`); return data; };
export const fetchUserProfile = async () => { const { data } = await api.get('/users/me'); return data; };
export const fetchCart = async () => { const { data } = await api.get('/cart'); return data || { _id: null, user: '', items: [], totalPrice: 0, totalItems: 0 }; };
export const addItemToBackendCart = async (item) => { const { data } = await api.post('/cart', item); return data; };
export const updateBackendCartItem = async ({ variantId, quantity }) => { const { data } = await api.put(`/cart/${variantId}`, { quantity }); return data; };
export const removeBackendCartItem = async (variantId) => { const { data } = await api.delete(`/cart/${variantId}`); return data; };
export const clearBackendCart = async () => { const { data } = await api.delete('/cart'); return data; };
export const createOrderOnBackend = async (orderDetails) => { const { data } = await api.post('/orders', orderDetails); return data; };
export const fetchMyOrders = async () => { const { data } = await api.get('/orders/myorders'); return data; };
export const fetchOrderById = async (orderId) => { const { data } = await api.get(`/orders/${orderId}`); return data; };
export const fetchAdminStats = async () => { const { data } = await api.get('/admin/stats'); return data; };
export const fetchAllUsers = async () => { const { data } = await api.get('/admin/users'); return data; };
export const fetchAllOrdersAdmin = async () => { const { data } = await api.get('/orders'); return data; };
export const updateBackendOrderStatus = async ({ orderId, status }) => { const { data } = await api.put(`/orders/${orderId}/status`, { status }); return data; };
export const createProductAdmin = async ({ productData, imageFiles }) => { const formData = createProductFormData(productData, imageFiles); const { data } = await api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }); return data; };
export const updateProductAdmin = async ({ productId, productData, imageFiles }) => { const formData = createProductFormData(productData, imageFiles); const { data } = await api.put(`/products/${productId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }); return data; };
export const deleteProductAdmin = async (productId) => { const { data } = await api.delete(`/products/${productId}`); return data; };