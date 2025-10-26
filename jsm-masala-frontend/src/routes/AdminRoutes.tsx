// src/routes/AdminRoutes.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout.tsx';
import { SkeletonLoader } from '@/components/common/SkeletonLoader.tsx';

const AdminDashboardPage = lazy(() => import('@/pages/Admin/Dashboard.tsx'));
const AdminProductListPage = lazy(() => import('@/pages/Admin/ProductListPage.tsx'));
const ProductFormPage = lazy(() => import('@/pages/Admin/ProductFormPage.tsx'));
const AdminNotFound = () => <Navigate to="/admin" replace />;

const AdminPageLoader = () => (
  <div className="container py-20 flex justify-center">
    <SkeletonLoader className="w-full h-96" />
  </div>
);

export default function AdminRoutes() {
  return (
    <AdminLayout>
      <Suspense fallback={<AdminPageLoader />}>
        <Routes>
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductListPage />} />
          <Route path="products/new" element={<ProductFormPage mode="create" />} />
          <Route path="products/edit/:id" element={<ProductFormPage mode="edit" />} />
          <Route path="*" element={<AdminNotFound />} />
        </Routes>
      </Suspense>
    </AdminLayout>
  );
}