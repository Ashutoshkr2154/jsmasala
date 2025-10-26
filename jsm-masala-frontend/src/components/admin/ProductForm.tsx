// // src/components/admin/ProductForm.tsx
// import React, { useState, useEffect } from 'react';
// import { useForm, useFieldArray, Controller, SubmitHandler } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { PlusCircle, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
// import { Button } from '@/components/common/Button.tsx';
// import { Input } from '@/components/common/Input.tsx'; // Assuming you have a reusable Input
// import { Textarea } from '@/components/common/Textarea.tsx'; // Assuming you have a reusable Textarea
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/common/Select.tsx'; // Assuming Select component
// import { Checkbox } from '@/components/common/Checkbox.tsx'; // Assuming Checkbox component
// import { Product, ProductVariant, Category } from '@/types/index.ts'; // Import types
// import { createProductSchema } from '@/validators/productValidators.ts'; // Import Joi schema via Zod
// import { z } from 'zod';
// import { useQuery } from '@tanstack/react-query'; // To fetch categories
// import api from '@/services/api.ts'; // To fetch categories

// // Define Zod schema based on Joi (or recreate directly with Zod)
// // For simplicity, let's redefine the core structure with Zod here
// const variantZodSchema = z.object({
//   _id: z.string().optional(), // Allow _id for existing variants during update
//   pack: z.string().min(1, 'Pack size is required'),
//   price: z.coerce.number().min(0, 'Price cannot be negative'), // Coerce converts string input to number
//   mrp: z.coerce.number().min(0, 'MRP cannot be negative').optional().nullable(),
//   stock: z.coerce.number().int('Stock must be a whole number').min(0, 'Stock cannot be negative'),
// }).refine(data => data.mrp === null || data.mrp === undefined || data.mrp >= data.price, {
//   message: "MRP must be greater than or equal to the selling price",
//   path: ["mrp"], // Specify path for error message
// });

// const productFormZodSchema = z.object({
//   name: z.string().min(2, 'Name must be at least 2 chars').max(100),
//   shortDescription: z.string().max(250).optional(),
//   description: z.string().min(1, 'Description is required'),
//   category: z.string().min(1, 'Category is required'), // Category ID
//   variants: z.array(variantZodSchema).min(1, 'At least one variant is required'),
//   tags: z.string().optional(), // Keep as string for input, parse on submit
//   isFeatured: z.boolean().default(false),
//   // Images are handled separately via FileList
// });

// // Infer the type from the Zod schema
// type ProductFormData = z.infer<typeof productFormZodSchema>;

// // --- Fetch Categories Function --- (Could be moved to api.ts/hooks)
// const fetchCategories = async (): Promise<Category[]> => {
//     const { data } = await api.get<Category[]>('/categories');
//     return data;
// };

// // --- Component Props ---
// interface ProductFormProps {
//   initialData?: Product | null; // Product data for editing, null/undefined for creating
//   onSubmit: (data: ProductFormData, imageFiles: FileList | null) => void;
//   isLoading?: boolean; // Loading state from parent mutation
//   mode: 'create' | 'edit';
// }

// export function ProductForm({ initialData, onSubmit, isLoading, mode }: ProductFormProps) {
//   const [imagePreviews, setImagePreviews] = useState<string[]>(initialData?.images?.map(img => img.url) || []);
//   const [imageFiles, setImageFiles] = useState<FileList | null>(null);

//   // Fetch categories for the dropdown
//   const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[], Error>({
//       queryKey: ['categoriesAdminForm'],
//       queryFn: fetchCategories,
//   });

//   // --- React Hook Form Setup ---
//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//     reset,
//     watch,
//   } = useForm<ProductFormData>({
//     resolver: zodResolver(productFormZodSchema),
//     defaultValues: {
//       name: initialData?.name || '',
//       shortDescription: initialData?.shortDescription || '',
//       description: initialData?.description || '',
//       category: initialData?.category?._id || '', // Use category ID
//       variants: initialData?.variants || [{ pack: '', price: 0, mrp: null, stock: 0 }],
//       tags: initialData?.tags?.join(', ') || '', // Join tags array into string for input
//       isFeatured: initialData?.isFeatured || false,
//     },
//   });

//   // Field Array for dynamic variants
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: 'variants',
//   });

//   // Effect to reset form when initialData changes (e.g., navigating between edit pages)
//   useEffect(() => {
//     if (initialData) {
//       reset({
//         name: initialData.name,
//         shortDescription: initialData.shortDescription || '',
//         description: initialData.description,
//         category: initialData.category?._id || '',
//         variants: initialData.variants,
//         tags: initialData.tags?.join(', ') || '',
//         isFeatured: initialData.isFeatured || false,
//       });
//       setImagePreviews(initialData.images?.map(img => img.url) || []);
//       setImageFiles(null); // Clear file input on data change
//     } else {
//         // Reset to default empty state for create mode
//         reset({
//              name: '', shortDescription: '', description: '', category: '',
//              variants: [{ pack: '', price: 0, mrp: null, stock: 0 }],
//              tags: '', isFeatured: false
//         });
//         setImagePreviews([]);
//         setImageFiles(null);
//     }
//   }, [initialData, reset]);

//   // Handle image file selection and preview generation
//   const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (files && files.length > 0) {
//       setImageFiles(files); // Store the FileList
//       const previews = Array.from(files).map(file => URL.createObjectURL(file));
//       setImagePreviews(previews);
//     } else {
//         // If files are cleared, revert previews to initial data if editing
//         setImageFiles(null);
//         setImagePreviews(initialData?.images?.map(img => img.url) || []);
//     }
//   };

//   // Wrapper for form submission to include image files
//   const handleFormSubmit: SubmitHandler<ProductFormData> = (data) => {
//      // Basic check: require images on create, optional on update
//      if (mode === 'create' && (!imageFiles || imageFiles.length === 0)) {
//          alert('Please upload at least one product image.'); // Simple alert, use better UI later
//          return;
//      }
//     onSubmit(data, imageFiles);
//   };

//   return (
//     <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
//       {/* Product Name */}
//       <div>
//         <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
//         <Input id="name" {...register('name')} error={errors.name?.message} />
//       </div>

//       {/* Category Dropdown */}
//       <div>
//         <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//         <Controller
//             name="category"
//             control={control}
//             render={({ field }) => (
//                 <Select
//                     value={field.value}
//                     onValueChange={field.onChange}
//                     disabled={isLoadingCategories}
//                 >
//                     <SelectTrigger id="category">
//                         <SelectValue placeholder={isLoadingCategories ? "Loading..." : "Select a category"} />
//                     </SelectTrigger>
//                     <SelectContent>
//                         {categories?.map((cat) => (
//                             <SelectItem key={cat._id} value={cat._id}>
//                                 {cat.name}
//                             </SelectItem>
//                         ))}
//                     </SelectContent>
//                 </Select>
//             )}
//         />
//         {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
//       </div>

//        {/* Short Description */}
//       <div>
//         <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-1">Short Description (Optional)</label>
//         <Textarea id="shortDescription" rows={2} {...register('shortDescription')} error={errors.shortDescription?.message} />
//       </div>

//       {/* Full Description */}
//       <div>
//         <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
//         <Textarea id="description" rows={5} {...register('description')} error={errors.description?.message} />
//       </div>

//        {/* --- Variants Section --- */}
//        <div>
//         <h3 className="text-lg font-medium text-gray-900 mb-2">Variants (Pack Size, Price, Stock)</h3>
//         <div className="space-y-4">
//             {fields.map((field, index) => (
//                 <div key={field.id} className="grid grid-cols-1 sm:grid-cols-12 gap-x-4 gap-y-2 p-4 border rounded-md relative">
//                     {/* Pack Size */}
//                     <div className="sm:col-span-3">
//                         <label htmlFor={`variants.${index}.pack`} className="block text-xs font-medium text-gray-500 mb-1">Pack Size</label>
//                         <Input id={`variants.${index}.pack`} {...register(`variants.${index}.pack`)} error={errors.variants?.[index]?.pack?.message} placeholder="e.g., 100g"/>
//                     </div>
//                      {/* Price */}
//                     <div className="sm:col-span-3">
//                         <label htmlFor={`variants.${index}.price`} className="block text-xs font-medium text-gray-500 mb-1">Price (₹)</label>
//                         <Input id={`variants.${index}.price`} type="number" step="0.01" {...register(`variants.${index}.price`)} error={errors.variants?.[index]?.price?.message} placeholder="e.g., 199.00"/>
//                     </div>
//                      {/* MRP */}
//                      <div className="sm:col-span-3">
//                         <label htmlFor={`variants.${index}.mrp`} className="block text-xs font-medium text-gray-500 mb-1">MRP (₹, Optional)</label>
//                         <Input id={`variants.${index}.mrp`} type="number" step="0.01" {...register(`variants.${index}.mrp`)} error={errors.variants?.[index]?.mrp?.message} placeholder="e.g., 249.00"/>
//                     </div>
//                     {/* Stock */}
//                     <div className="sm:col-span-2">
//                          <label htmlFor={`variants.${index}.stock`} className="block text-xs font-medium text-gray-500 mb-1">Stock</label>
//                         <Input id={`variants.${index}.stock`} type="number" step="1" {...register(`variants.${index}.stock`)} error={errors.variants?.[index]?.stock?.message} placeholder="e.g., 50"/>
//                     </div>
//                     {/* Remove Button */}
//                     <div className="sm:col-span-1 flex items-end justify-end sm:justify-start">
//                         {fields.length > 1 && ( // Only show remove if more than one variant
//                             <Button
//                                 type="button"
//                                 variant="destructive-outline"
//                                 size="icon"
//                                 onClick={() => remove(index)}
//                                 className="h-9 w-9 mt-1 sm:mt-0"
//                                 aria-label="Remove variant"
//                             >
//                                 <Trash2 className="h-4 w-4" />
//                             </Button>
//                         )}
//                     </div>
//                 </div>
//             ))}
//             {errors.variants?.root && <p className="mt-1 text-sm text-red-600">{errors.variants.root.message}</p>}
//             {errors.variants?.message && <p className="mt-1 text-sm text-red-600">{errors.variants.message}</p>} {/* For minLength error */}
//              <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 onClick={() => append({ pack: '', price: 0, mrp: null, stock: 0 })}
//             >
//                 <PlusCircle className="h-4 w-4 mr-2" />
//                 Add Variant
//             </Button>
//         </div>
//       </div>
//       {/* --- End Variants --- */}

//       {/* Tags */}
//       <div>
//         <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags (Optional, comma-separated)</label>
//         <Input id="tags" {...register('tags')} error={errors.tags?.message} placeholder="e.g., organic, spicy, blend" />
//       </div>

//        {/* Is Featured */}
//       <div className="flex items-center space-x-2">
//         <Controller
//             name="isFeatured"
//             control={control}
//             render={({ field }) => (
//                 <Checkbox
//                     id="isFeatured"
//                     checked={field.value}
//                     onCheckedChange={field.onChange}
//                 />
//             )}
//         />
//         <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700 cursor-pointer">
//             Mark as Featured Product
//         </label>
//          {errors.isFeatured && <p className="text-sm text-red-600">{errors.isFeatured.message}</p>}
//       </div>

//       {/* Image Upload */}
//       <div>
//          <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
//            Product Images {mode === 'create' ? '(Required)' : '(Optional - uploads will replace existing images)'}
//          </label>
//          <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
//              <div className="space-y-1 text-center">
//                 <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
//                 <div className="flex text-sm text-gray-600">
//                     <label
//                       htmlFor="images"
//                       className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
//                     >
//                       <span>Upload files</span>
//                       <input
//                         id="images"
//                         name="images" // Name must match multer middleware ('images')
//                         type="file"
//                         className="sr-only"
//                         multiple // Allow multiple files
//                         accept="image/*" // Accept only images
//                         onChange={handleImageChange}
//                       />
//                     </label>
//                     <p className="pl-1">or drag and drop</p>
//                 </div>
//                 <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each (Max 5 files)</p>
//              </div>
//          </div>
//          {/* Image Previews */}
//          {imagePreviews.length > 0 && (
//              <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
//                  {imagePreviews.map((previewUrl, index) => (
//                     <div key={index} className="relative aspect-square">
//                         <img src={previewUrl} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-md shadow-sm" />
//                     </div>
//                  ))}
//              </div>
//          )}
//          {/* TODO: Add specific file validation errors if needed */}
//       </div>

//       {/* Submit Button */}
//       <div className="pt-4 flex justify-end">
//         <Button
//             type="submit"
//             size="lg"
//             isLoading={isLoading} // Show loading state from parent
//             disabled={isLoading || isLoadingCategories} // Disable if loading data or submitting
//         >
//              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
//             {mode === 'create' ? 'Create Product' : 'Update Product'}
//         </Button>
//       </div>
//     </form>
//   );
// }

// // --- Assuming these components exist or you need to create them ---
// // src/components/common/Textarea.tsx
// export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }>(({ error, className, ...props }, ref) => (
//   <div>
//     <textarea ref={ref} className={cn("block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm", error ? "border-red-500" : "", className)} {...props} />
//     {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
//   </div>
// ));
// Textarea.displayName = 'Textarea';

// // src/components/common/Select.tsx (Basic placeholder using native select)
// export const Select = ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => <select className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" {...props}>{children}</select>;
// export const SelectTrigger = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button type="button" {...props}>{children}</button>; // Placeholder
// export const SelectValue = ({ placeholder }: { placeholder?: string }) => <span>{placeholder}</span>; // Placeholder
// export const SelectContent = ({ children }: { children: React.ReactNode }) => <div>{children}</div>; // Placeholder
// export const SelectItem = ({ children, value }: { children: React.ReactNode, value: string }) => <option value={value}>{children}</option>; // Placeholder for native select
// // NOTE: For a better dropdown, use a library like Radix UI Select or Shadcn UI Select

// // src/components/common/Checkbox.tsx (Basic placeholder)
// export const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { onCheckedChange?: (checked: boolean) => void }>(({ onCheckedChange, ...props }, ref) => (
//     <input type="checkbox" ref={ref} onChange={(e) => onCheckedChange?.(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" {...props} />
// ));
// Checkbox.displayName = 'Checkbox';

// // Ensure cn utility is available
// import { clsx, type ClassValue } from 'clsx';
// import { twMerge } from 'tailwind-merge';
// export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }


export const ProductForm= () =>{
  return (<></>);
};