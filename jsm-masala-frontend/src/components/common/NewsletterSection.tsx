import { Button } from '@/components/common/Button.tsx'; // Adjust import path if needed
import { Input } from '@/components/common/Input.tsx';   // Adjust import path if needed

export function NewsletterSection() {
  return (
    <section className="bg-amber-50 py-16"> {/* Using a light saffron/yellow background */}
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold font-heading mb-4 text-brand-neutral">
          Subscribe to Our Newsletter
        </h2>
        <p className="mb-8 text-lg text-gray-600 max-w-xl mx-auto">
          Get the latest updates on new products, recipes, and exclusive offers delivered straight to your inbox.
        </p>
        {/* Flex container for form elements */}
        <form
          className="flex flex-col sm:flex-row justify-center items-center gap-3 max-w-lg mx-auto"
          onSubmit={(e) => {
            e.preventDefault();
            console.log('Newsletter subscribed!');
            // Add actual subscription logic here
          }}
        >
          {/* Email Input */}
          <Input
            type="email"
            placeholder="Enter your email address"
            // w-full on small screens, sm:w-72 fixed width on larger, flex-grow allows expansion
            className="w-full sm:w-72 flex-grow"
            aria-label="Email address for newsletter"
            required
          />
          {/* Subscribe Button */}
          <Button
            type="submit"
            variant="accent" // Using accent color (red)
            size="lg" // Larger button
            className="w-full sm:w-auto flex-shrink-0" // Full width on small, auto on larger
          >
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}