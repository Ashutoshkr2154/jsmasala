import { faker } from '@faker-js/faker';
import { Product, ProductVariant } from '@/types';

// Helper to create product variants
const createVariants = (pricePer100g: number): ProductVariant[] => {
  const packs = [
    { pack: '100g', price: pricePer100g, stock: faker.number.int({ min: 0, max: 200 }) },
    { pack: '200g', price: pricePer100g * 1.9, stock: faker.number.int({ min: 0, max: 150 }) },
    { pack: '500g', price: pricePer100g * 4.5, stock: faker.number.int({ min: 0, max: 70 }) },
  ];

  return packs.map((p, i) => ({
    id: `v_${faker.string.uuid()}_${i}`,
    pack: p.pack,
    price: Math.floor(p.price),
    mrp: Math.floor(p.price * 1.15), // 15% markup for MRP
    stock: p.stock,
  }));
};

// Helper to create a single product
const createProduct = (category: string, name: string, basePrice: number, isFeatured = false): Product => {
  const slug = faker.helpers.slugify(name).toLowerCase();
  return {
    id: `p_${faker.string.uuid()}`,
    name,
    slug: slug,
    images: [
      `/images/placeholder-1.jpg`, // You can add real images to /public/images
      `/images/placeholder-2.jpg`,
      `/images/placeholder-3.jpg`,
    ],
    variants: createVariants(basePrice),
    rating: faker.number.float({ min: 3.5, max: 5, precision: 0.1 }),
    reviewsCount: faker.number.int({ min: 10, max: 500 }),
    category,
    tags: [category.toLowerCase(), ...faker.helpers.arrayElements(['organic', 'blend', 'powder'], 1)],
    shortDescription: `Authentic ${name}. ${faker.lorem.sentence()}`,
    description: faker.lorem.paragraphs(3),
    isFeatured,
  };
};

// Create our mock product list
export const db: { products: Product[] } = {
  products: [
    createProduct('Turmeric', 'JSM Organic Turmeric Powder', 70, true),
    createProduct('Red Chili', 'JSM Kashmiri Red Chili Powder', 90, true),
    createProduct('Garam Masala', 'JSM Royal Garam Masala', 120, true),
    createProduct('Coriander', 'JSM Coriander Powder (Dhaniya)', 60),
    createProduct('Cumin', 'JSM Cumin Powder (Jeera)', 80),
    createProduct('Blends', 'JSM Kitchen King Masala', 110),
    createProduct('Blends', 'JSM Chana Masala', 100, true),
    createProduct('Blends', 'JSM Pav Bhaji Masala', 105),
    createProduct('Pickles', 'JSM Mango Pickle', 150),
    createProduct('Ready Mixes', 'JSM Instant Gulab Jamun Mix', 200),
    createProduct('Whole Spices', 'JSM Whole Black Peppercorns', 130),
    createProduct('Whole Spices', 'JSM Whole Cloves (Laung)', 150),
    createProduct('Whole Spices', 'JSM Cinnamon Sticks (Dalchini)', 140),
    createProduct('Powders', 'JSM Black Pepper Powder', 135),
    createProduct('Organic', 'JSM Organic Cumin Seeds', 90),
    createProduct('Organic', 'JSM Organic Fenugreek Seeds', 75, true),
    createProduct('Pickles', 'JSM Mixed Vegetable Pickle', 140),
    createProduct('Blends', 'JSM Sambar Masala', 115),
    createProduct('Powders', 'JSM Dry Ginger Powder (Saunth)', 85),
    createProduct('Ready Mixes', 'JSM Instant Idli Mix', 180),
  ],
};