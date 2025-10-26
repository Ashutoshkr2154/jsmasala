// // src/pages/Admin/ProductFormPage.tsx
// import { useParams, useNavigate } from 'react-router-dom';
// import { Loader2, XCircle } from 'lucide-react';
// import { ProductForm } from '@/components/admin/ProductForm.tsx';
// import { Seo } from '@/components/common/Seo.tsx';
// import { useProductByIdOrSlug } from '@/hooks/useProducts.ts';
// import { useCreateProductAdmin, useUpdateProductAdmin } from '@/hooks/useAdminProducts.ts';
// import { Product } from '@/types/index.ts';

// interface ProductFormPageProps {
//   mode: 'create' | 'edit';
// }

// // Define the type expected by the onSubmit handler in ProductForm
// type ProductFormData = Parameters<Parameters<typeof ProductForm>[0]['onSubmit']>[0];
// type ImageFiles = Parameters<Parameters<typeof ProductForm>[0]['onSubmit']>[1];


// export default function ProductFormPage({ mode }: ProductFormPageProps) {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();

//   const { data: productData, isLoading: isLoadingProduct, isError, error } = useProductByIdOrSlug(
//     mode === 'edit' ? id : undefined
//   );

//   const createMutation = useCreateProductAdmin();
//   const updateMutation = useUpdateProductAdmin();

//   const isMutating = createMutation.isPending || updateMutation.isPending;

//   const handleFormSubmit = (formData: ProductFormData, imageFiles: ImageFiles) => {
//     const tagsArray = formData.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || [];

//      const productPayload = {
//          ...formData,
//          tags: tagsArray,
//          isFeatured: formData.isFeatured || false,
//      };

//     if (mode === 'create') {
//       if (!imageFiles) {
//         console.error('Image files are required for creating a product.');
//         return;
//       }
//       createMutation.mutate(
//         { productData: productPayload, imageFiles },
//         {
//           onSuccess: (newProduct) => {
//             console.log('Product created:', newProduct);
//             navigate('/admin/products');
//           },
//           onError: (err) => {
//               console.error("Create Product Error:", err)
//           }
//         }
//       );
//     } else if (mode === 'edit' && id) {
//       updateMutation.mutate(
//         { productId: id, productData: productPayload, imageFiles },
//         {
//           onSuccess: (updatedProduct) => {
//             console.log('Product updated:', updatedProduct);
//             navigate('/admin/products');
//           },
//             onError: (err) => {
//               console.error("Update Product Error:", err)
//           }
//         }
//       );
//     }
//   };

//   if (isLoadingProduct && mode === 'edit') {
//     return (
//       <div className="container py-20 flex justify-center">
//         <Loader2 className="h-12 w-12 animate-spin text-brand-primary" />
//         <p className="ml-4 text-lg">Loading product data...</p>
//       </div>
//     );
//   }

//   if (isError && mode === 'edit') {
//      return (
//        <div className="container py-20 text-center text-red-600">
//          <XCircle className="h-16 w-16 mx-auto mb-4" />
//          <h1 className="text-3xl font-bold">Error Loading Product</h1>
//          <p className="mt-2 text-lg">Could not fetch product details. Please try again.</p>
//        </div>
//      );
//   }

//    if (mode === 'edit' && !productData) {
//        return (
//             <div className="container py-20 text-center text-red-600">
//                 <h1 className="text-3xl font-bold">Product Not Found</h1>
//             </div>
//        );
//    }

//   return (
//     <>
//       <Seo title={mode === 'create' ? 'Admin - Add Product' : 'Admin - Edit Product'} />
//       <div className="container py-12">
//         <h1 className="text-3xl lg:text-4xl font-extrabold font-heading mb-8">
//           {mode === 'create' ? 'Add New Product' : 'Edit Product'}
//         </h1>

//         <div className="max-w-4xl mx-auto rounded-lg border bg-white p-6 md:p-8 shadow-sm">
//           <ProductForm
//             initialData={mode === 'edit' ? productData : null}
//             onSubmit={handleFormSubmit}
//             isLoading={isMutating}
//             mode={mode}
//           />
//         </div>
//       </div>
//     </>
//   );



export const ProductFormPage = () =>{
    return(
        <></>
    );
}