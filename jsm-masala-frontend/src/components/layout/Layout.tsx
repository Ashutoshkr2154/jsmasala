// src/components/layout/Layout.tsx
import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '../cart/CartDrawer'; // <--- 1. IMPORT

type LayoutProps = {
  children: React.ReactNode;
};

/**
 * Main application layout.
 * Renders the Header, the main page content (children), and the Footer.
 * It also renders the CartDrawer, which is hidden by default.
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-grow">
        {children}
      </main>
      <Footer />
      
      <CartDrawer /> {/* <--- 2. ADD THE COMPONENT HERE */}
    </div>
  );
}