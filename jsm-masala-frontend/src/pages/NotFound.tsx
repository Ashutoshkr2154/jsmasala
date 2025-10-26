import { Seo } from '@/components/common/Seo';
import { Button } from '@/components/common/Button';

export default function NotFoundPage() {
  return (
    <>
      <Seo title="Page Not Found (404)" description="The page you are looking for does not exist." />
      <div className="container flex flex-col items-center justify-center text-center py-20">
        <img 
          src="/images/404.svg" // You can find a 404 SVG online
          alt="404 Not Found"
          className="w-full max-w-lg"
        />
        <h1 className="text-5xl font-extrabold font-heading mt-8">
          Page Not Found
        </h1>
        <p className="text-xl text-gray-600 mt-4 max-w-xl">
          Oops! The spice you're looking for seems to have vanished.
          Let's get you back on the right path.
        </p>
        <Button to="/" size="lg" className="mt-10">
          Go Back Home
        </Button>
      </div>
    </>
  );
}