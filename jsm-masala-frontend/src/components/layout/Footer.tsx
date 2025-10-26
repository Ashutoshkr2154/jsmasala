// src/components/layout/Footer.tsx
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'; // Ensure icons are imported

export function Footer() {
  // --- Define your actual social media links here ---
  const socialLinks = {
    facebook: 'https://www.facebook.com/yourpage', // REPLACE with your Facebook URL
    instagram: 'https://www.instagram.com/yourpage', // REPLACE with your Instagram URL
    twitter: 'https://twitter.com/yourpage',       // REPLACE with your Twitter URL
    youtube: 'https://www.youtube.com/@yourchannel', // REPLACE with your YouTube URL
  };
  // --------------------------------------------------

  return (
    <footer className="bg-brand-neutral text-white border-t border-gray-700 mt-20"> {/* Adjusted border color */}
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Logo & Social */}
          <div className="col-span-2 lg:col-span-1">
            <h2 className="text-3xl font-heading font-extrabold text-white mb-4">
              JSM Masala
            </h2>
            <p className="text-gray-300 text-sm mb-6">
              Bringing authentic Indian spices to your kitchen since 1985.
            </p>
            {/* === SOCIAL LINKS START === */}
            <div className="flex gap-4"> {/* Container for icons */}
              <a
                href={socialLinks.facebook}
                target="_blank" // Opens in new tab
                rel="noopener noreferrer" // Security best practice
                aria-label="JSM Masala on Facebook" // Accessibility
                className="text-gray-300 hover:text-blue-500 transition-colors" // Styling
              >
                <Facebook className="h-6 w-6" /> {/* Icon */}
              </a>
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="JSM Masala on Instagram"
                className="text-gray-300 hover:text-pink-500 transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="JSM Masala on Twitter"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="JSM Masala on YouTube"
                className="text-gray-300 hover:text-red-600 transition-colors"
              >
                <Youtube className="h-6 w-6" />
              </a>
            </div>
            {/* === SOCIAL LINKS END === */}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/shop?category=blends" className="hover:text-brand-primary">Spice Blends</Link></li>
              <li><Link to="/shop?category=powders" className="hover:text-brand-primary">Powders</Link></li>
              <li><Link to="/shop?category=whole" className="hover:text-brand-primary">Whole Spices</Link></li>
              <li><Link to="/shop?category=organic" className="hover:text-brand-primary">Organic</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/about" className="hover:text-brand-primary">About Us</Link></li>
              <li><Link to="/blog" className="hover:text-brand-primary">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-brand-primary">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-brand-primary">FAQs</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/privacy-policy" className="hover:text-brand-primary">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-brand-primary">Terms of Service</Link></li>
              <li><Link to="/shipping-returns" className="hover:text-brand-primary">Shipping & Returns</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h3 className="font-heading font-semibold text-lg mb-4">Newsletter</h3>
            <p className="text-sm text-gray-300 mb-4">Get 10% off your first order!</p>
            <form className="flex">
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                type="email"
                id="footer-email"
                placeholder="Enter your email"
                className="flex-grow rounded-l-lg border-gray-300 px-4 py-2 text-gray-900 focus:ring-brand-primary focus:border-brand-primary"
              />
              <button type="submit" className="px-4 py-2 rounded-r-lg bg-brand-primary text-white font-semibold hover:bg-opacity-90">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-gray-700 text-center text-sm text-gray-400"> {/* Adjusted border color */}
          <p>&copy; {new Date().getFullYear()} JSM Masala. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}