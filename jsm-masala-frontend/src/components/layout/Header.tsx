// src/components/layout/Header.tsx
import { Link, NavLink, useSearchParams, useNavigate } from 'react-router-dom'; // Import necessary hooks
import { Home, ShoppingCart, User, Heart, Menu, Search, X } from 'lucide-react'; // Import X icon for clear button
import { useState, useEffect } from 'react'; // Import useEffect
import { useDebounce } from '@/hooks/useDebounce.ts'; // Import useDebounce hook

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

  // --- Search State ---
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialSearchQuery = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearchQuery); // Local state for input value
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Debounced value after 500ms
  // ---

  // Effect to update URL when debounced search term changes
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (debouncedSearchTerm) {
      newParams.set('search', debouncedSearchTerm);
      newParams.set('page', '1'); // Reset page on new search
    } else {
      newParams.delete('search'); // Remove param if search is empty
    }

    // Update URL or navigate based on current page and if search changed
    const currentPath = window.location.pathname;
    if (debouncedSearchTerm !== initialSearchQuery) { // Only update if value actually changed
        if (currentPath.startsWith('/shop')) {
            // If already on shop page, just update params
             setSearchParams(newParams, { replace: true }); // replace: true avoids cluttering history
        }
        // If searching from a different page (and search term is not empty), navigate to shop
        else if (debouncedSearchTerm) {
             navigate(`/shop?${newParams.toString()}`);
        }
        // If search is cleared on non-shop page, do nothing to URL, just keep local state updated
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, initialSearchQuery, navigate]); // Dependencies for the effect

  // Effect to sync local state if URL changes externally (e.g., browser back/forward)
   useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  // Handle explicit form submission (Enter key)
  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newParams = new URLSearchParams(searchParams);
     if (searchTerm) {
      newParams.set('search', searchTerm);
      newParams.set('page', '1');
    } else {
      newParams.delete('search');
    }
     // Always navigate to shop page on explicit submit to show results
     navigate(`/shop?${newParams.toString()}`);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container" aria-label="Main navigation">
        <div className="flex justify-between items-center h-20"> {/* Parent flex container */}

          {/* === LOGO + TEXT SECTION START === */}
          <Link to="/" className="flex items-center" aria-label="JSM Masala Home">
            <div className="flex items-center space-x-3">
              <img
                src="/images/logo.svg"
                alt="JSM Logo"
                className="h-14 max-h-[60px] w-auto object-contain"
              />
              <span className="text-2xl font-bold text-brand-neutral tracking-wide whitespace-nowrap">
                JAI SHANKAR MASALA
              </span>
            </div>
          </Link>
          {/* === LOGO + TEXT SECTION END === */}

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

            {/* === UPDATED SEARCH BAR === */}
            <form className="relative" onSubmit={handleSearchSubmit}> {/* Use form for Enter key */}
              <label htmlFor="search-input" className="sr-only">Search Spices</label>
              <input
                id="search-input"
                type="search"
                placeholder="Search for spices..."
                value={searchTerm} // Bind value to state
                onChange={(e) => setSearchTerm(e.target.value)} // Update state on change
                // Added focus styles, padding adjustments
                className="border rounded-lg py-2 pr-10 pl-10 w-64 focus:ring-2 focus:ring-brand-primary focus:border-transparent focus:outline-none transition duration-150 ease-in-out" // Added pr-10 for clear button space
              />
              {/* Search Icon inside */}
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
               {/* Clear button (visible when searchTerm has value) */}
               {searchTerm && (
                 <button
                   type="button"
                   onClick={() => setSearchTerm('')} // Clear the search term state
                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1" // Added padding for easier click
                   aria-label="Clear search"
                 >
                   <X className="w-4 h-4" /> {/* Use X icon */}
                 </button>
               )}
            </form>
            {/* ========================== */}

          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
             {/* ... Icons remain the same ... */}
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

        {/* Mobile Menu Panel */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="lg:hidden pb-4 space-y-2">
            {/* ... (Mobile menu content remains the same) ... */}
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