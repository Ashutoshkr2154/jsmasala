// src/pages/About.tsx
import { useEffect } from 'react';
import { Seo } from '@/components/common/Seo.tsx';
import { Award, Leaf, Users } from 'lucide-react';
import { Button } from '@/components/common/Button.tsx';

export default function AboutPage() {
  useEffect(() => {
    console.log("About Page Component Mounted");
  }, []);

  return (
    <> {/* Using Fragment as the main wrapper */}
      <Seo
        title="About JSM Masala"
        description="Learn about our story, our passion for quality, and our commitment to bringing you the most authentic Indian spices."
      />

      {/* Hero Section */}
      <section className="relative bg-brand-neutral text-white overflow-hidden">
        <div className="container py-24 text-center relative z-10">
          <h1 className="text-6xl font-extrabold font-heading mb-6">Our Story</h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-200">
            JSM Masala was born from a passion to share the rich, authentic, and diverse flavors of India with the world.
          </p>
        </div>
        {/* Optional background image setup remains correct */}
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              {/* === UPDATED IMAGE CLASSES === */}
              <img
                src="/images/about-us.jpg"
                alt="JSM Masala spices arranged aesthetically"
                // Changed object-cover to object-contain, added max-w-full and mx-auto
                className="rounded-lg shadow-2xl w-full h-auto max-w-full object-contain max-h-[500px] mx-auto"
                onError={(e) => console.error('About Us Image failed to load:', e.currentTarget.src)}
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold font-heading mb-6">From Our Family to Yours</h2>
              <p className="text-lg text-gray-700 mb-4">
                Since 1985, JSM – Jai Shankar Masala has been a trusted name in households. We are not just a brand; we are a family dedicated to quality.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                We meticulously source the finest raw spices directly from farms, ensuring that every grain is pure. Our traditional grinding processes lock in the natural oils and aromas.
              </p>
              <Button to="/shop" variant="primary" size="lg">Explore Our Spices</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Banner Section */}
      <section className="py-12">
        <div className="container">
          {/* === UPDATED IMAGE CLASSES === */}
          <img
            src="/images/shop-banner.jpg"
            alt="Shop Banner highlighting JSM Masala products"
            // Changed object-cover to object-contain, added max-w-full and mx-auto
            className="w-full h-auto max-w-full object-contain rounded-lg shadow-lg max-h-[400px] mx-auto"
            onError={(e) => console.error('Shop Banner failed to load:', e.currentTarget.src)}
          />
        </div>
      </section>

      {/* "Why Choose Us" Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold font-heading mb-12 text-center">Our Promise</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Content remains the same */}
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
              <div className="bg-brand-primary/20 rounded-full p-4 mb-4">
                <Leaf className="h-10 w-10 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">100% Natural</h3>
              <p className="text-gray-600">No artificial colors, preservatives, or fillers. Just pure, authentic spices.</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
              <div className="bg-brand-primary/20 rounded-full p-4 mb-4">
                <Award className="h-10 w-10 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Sourced from the best farms and ground using traditional techniques.</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
              <div className="bg-brand-primary/20 rounded-full p-4 mb-4">
                <Users className="h-10 w-10 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Community Focused</h3>
              <p className="text-gray-600">We believe in fair trade, supporting the farmers who are the backbone of our craft.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}