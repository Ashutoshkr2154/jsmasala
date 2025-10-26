import { Link, NavLink } from 'react-router-dom';
import { Home, ShoppingCart, User, Heart, Menu, Search } from 'lucide-react';
import { useState } from 'react';

// Mock data for nav links
const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mockCartCount = 3; // Placeholder
  const isLoggedIn = false; // Placeholder

  const activeLinkClass = 'text-brand-primary font-semibold';
  const inactiveLinkClass = 'hover:text-brand-primary transition-colors';

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container" aria-label="Main navigation">
        <div className="flex justify-between items-center h-20">
          {/* === LOGO START === */}
          {/* Use img tag pointing to public folder */}
          <Link to="/" className="flex items-center" aria-label="JSM Masala Home">
            <img
              src="/images/logo.svg" // Correct path for Vite public assets
              alt="JSM Masala Logo"
              // Tailwind classes for height, max-height, and object fit
              className="h-12 max-h-[60px] w-auto object-contain"
            />
          </Link>
          {/* === LOGO END === */}

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex gap-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  className={({ isActive }) => (isActive ? activeLinkClass : inactiveLinkClass)}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <input 
                type="search" 
                placeholder="Search spices..."
                className="border rounded-lg py-2 px-4 pl-10 w-64 focus:ring-brand-primary focus:border-brand-primary" 
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <Link to={isLoggedIn ? "/profile" : "/login"} className="hidden lg:block p-2 rounded-full hover:bg-gray-100" aria-label={isLoggedIn ? "My Profile" : "Login"}>
              <User className="w-6 h-6" />
            </Link>
            <Link to="/wishlist" className="hidden lg:block p-2 rounded-full hover:bg-gray-100" aria-label="Wishlist">
              <Heart className="w-6 h-6" />
            </Link>
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-100" aria-label={`View cart, ${mockCartCount} items`}>
              <ShoppingCart className="w-6 h-6" />
              {mockCartCount > 0 && (
                <span className="absolute top-0 right-0 block w-5 h-5 bg-brand-accent text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {mockCartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-full hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="lg:hidden pb-4 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) => `block px-3 py-2 rounded-md text-base ${isActive ? activeLinkClass : inactiveLinkClass}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}
            <Link to={isLoggedIn ? "/profile" : "/login"} className="block px-3 py-2 rounded-md text-base" onClick={() => setIsMobileMenuOpen(false)}>
              {isLoggedIn ? "Profile" : "Login / Register"}
            </Link>
            <Link to="/wishlist" className="block px-3 py-2 rounded-md text-base" onClick={() => setIsMobileMenuOpen(false)}>
              Wishlist
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}