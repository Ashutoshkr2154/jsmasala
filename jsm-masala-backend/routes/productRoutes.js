const express = require('express');
const {
    createProduct,
    getProducts,
    getProductByIdOrSlug,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController'); // Import controller
const { protect } = require('../middlewares/authMiddleware'); // Import auth middleware
const { admin } = require('../middlewares/adminMiddleware'); // Import admin middleware
const { uploadMultipleImages } = require('../middlewares/uploadMiddleware'); // Import upload middleware
const { createProductSchema, updateProductSchema } = require('../validators/productValidators'); // Import validators
const validationMiddleware = require('../middlewares/validationMiddleware'); // Import validation middleware

const router = express.Router();

// Define routes

// --- Public Routes ---
// GET /api/products - Get all products (with filters/search/pagination)
router.get('/', getProducts);
// GET /api/products/:idOrSlug - Get a single product by ID or Slug
router.get('/:idOrSlug', getProductByIdOrSlug);

// --- Admin Routes ---
// POST /api/products - Create a new product
router.post(
    '/',
    protect, // 1. Must be logged in
    admin,   // 2. Must be admin
    uploadMultipleImages('images', 5), // 3. Handle file uploads (field named 'images', max 5 files)
    validationMiddleware(createProductSchema), // 4. Validate text fields in req.body
    createProduct // 5. Run controller logic
);

// PUT /api/products/:id - Update a product
router.put(
    '/:id',
    protect,
    admin,
    uploadMultipleImages('images', 5), // Handle potential file uploads for update
    validationMiddleware(updateProductSchema), // Validate text fields
    updateProduct
);

// DELETE /api/products/:id - Delete a product
router.delete(
    '/:id',
    protect,
    admin,
    deleteProduct // No body validation needed
);

module.exports = router;