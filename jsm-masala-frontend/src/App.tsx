// src/App.tsx
import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Use @ alias for all imports
import { Layout } from '@/components/layout/Layout';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

// Use @ alias for all lazy imports
const HomePage = lazy(() => import('@/pages/Home.tsx'));
const ShopPage = lazy(() => import('@/pages/Shop.tsx'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetail.tsx'));
const CartPage = lazy(() => import('@/pages/Cart.tsx'));
const CheckoutPage = lazy(() => import('@/pages/Checkout.tsx'));
const LoginPage = lazy(() => import('@/pages/Login.tsx'));
const RegisterPage = lazy(() => import('@/pages/Register.tsx'));
const ProfilePage = lazy(() => import('@/pages/Profile.tsx'));
const WishlistPage = lazy(() => import('@/pages/Wishlist.tsx'));
const AboutPage = lazy(() => import('@/pages/About.tsx'));
const ContactPage = lazy(() => import('@/pages/Contact.tsx'));
const NotFoundPage = lazy(() => import('@/pages/NotFound.tsx'));

// --- 1. Import Admin Routes & Order Confirmation ---
// Assuming AdminRoutes is a file that handles nested admin routing
// If not, we'll import the pages directly. Let's assume a nested structure.
const AdminRoutes = lazy(() => import('@/routes/AdminRoutes.tsx')); // Or import directly
const OrderConfirmationPage = lazy(() => import('@/pages/OrderConfirmationPage.tsx'));
// --------------------------------------------------

export function App() {
  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />

          {/* --- Protected Routes --- */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            
            {/* --- 2. Update Admin Route --- */}
            {/* Use path="/*" to allow nested routes in AdminRoutes */}
            <Route path="/admin/*" element={<AdminRoutes />} />
            {/* ----------------------------- */}

            {/* --- 3. Add Order Confirmation Route --- */}
            <Route path="/order/success/:orderId" element={<OrderConfirmationPage />} />
            {/* ------------------------------------- */}
            
            {/* TODO: Add route for user's order history page */}
            {/* <Route path="/profile/orders" element={<OrderHistoryPage />} /> */}
          </Route>

          {/* 404 Not Found Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

function PageLoader() {
  return (
    <div className="container py-20 flex justify-center">
      <SkeletonLoader className="w-full h-96" />
    </div>
  );
}