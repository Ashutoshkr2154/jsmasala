import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Basic styling adjustments for arrows/dots if needed
// You might add this to your src/styles/index.css
/*
.slick-prev:before, .slick-next:before {
  color: black; // Or your theme color
}
*/

export function HomeSlider() {
  const images = [
    "/images/banner1.jpg",
    "/images/banner2.jpg",
    "/images/banner3.jpg",
    "/images/banner4.jpg",
    // Add more images if needed
  ];

  const settings = {
    dots: true, // Show dots navigation
    infinite: true, // Loop slides
    speed: 500, // Transition speed in ms
    slidesToShow: 3, // Show 3 slides at a time on desktop
    slidesToScroll: 1, // Scroll 1 slide at a time
    autoplay: true,
    autoplaySpeed: 3000, // Slide every 3 seconds
    pauseOnHover: true,
    arrows: true, // Show prev/next arrows
    responsive: [ // Adjust settings for smaller screens
      {
        breakpoint: 1024, // Tablets
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 640, // Mobile
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false // Hide arrows on mobile
        }
      }
    ]
  };

  // Add styles for spacing between slides if needed
  const slidePadding = "px-2 md:px-3"; // Adjust horizontal padding

  return (
    <section className="py-12 bg-white overflow-hidden"> {/* Added overflow-hidden */}
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold font-heading mb-8 text-center text-brand-neutral">
          Explore Our Range
        </h2>
        <Slider {...settings}>
          {images.map((img, index) => (
            <div key={index} className={slidePadding}> {/* Apply padding here */}
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                className="rounded-lg shadow-md w-full h-auto object-cover aspect-[16/9]" // Maintain aspect ratio
                onError={(e) => console.error(`Slider image ${index+1} failed to load:`, e.currentTarget.src)}
              />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}