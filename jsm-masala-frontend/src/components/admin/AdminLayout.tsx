// // src/components/admin/AdminLayout.tsx
// import React from 'react';
// import { NavLink, Navigate } from 'react-router-dom';
// import { useAuthStore } from '@/store/useAuthStore.ts';
// import { LayoutDashboard, Package, ShoppingCart, Users } from 'lucide-react';

// type AdminLayoutProps = {
//   children: React.ReactNode;
// };

// const adminNavLinks = [
//   { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
//   { name: 'Products', href: '/admin/products', icon: Package },
//   { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
//   { name: 'Users', href: '/admin/users', icon: Users },
// ];

// export function AdminLayout({ children }: AdminLayoutProps) {
//   const user = useAuthStore((state) => state.user);

//   if (user?.role !== 'admin') {
//     return <Navigate to="/" replace />;
//   }

//   return (
//     <div className="flex min-h-screen">
//       <aside className="w-56 bg-gray-800 text-white p-4 hidden md:block flex-shrink-0">
//         <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
//         <nav>
//           <ul className="space-y-2">
//             {adminNavLinks.map((link) => (
//               <li key={link.name}>
//                 <NavLink
//                   to={link.href}
//                   end={link.href === '/admin'} 
//                   className={({ isActive }) =>
//                     `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
//                       isActive
//                         ? 'bg-brand-primary text-white'
//                         : 'text-gray-300 hover:bg-gray-700 hover:text-white'
//                     }`
//                   }
//                 >
//                   <link.icon className="h-5 w-5" />
//                   {link.name}
//                 </NavLink>
//               </li>
//             ))}
//           </ul>
//         </nav>
//       </aside>
//       <main className="flex-1 bg-gray-100 p-6 md:p-10 overflow-x-auto">
//         {children}
//       </main>
//     </div>
//   );
// }


export const AdminLayout = ()=>{
  return (
    <>
    </>
  );
};