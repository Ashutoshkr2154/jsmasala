const express = require('express');
const {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
} = require('../controllers/categoryController'); // Import controller functions
const { protect } = require('../middlewares/authMiddleware'); // Import general auth middleware
const { admin } = require('../middlewares/adminMiddleware'); // Import admin check middleware
const { categorySchema } = require('../validators/categoryValidators'); // Import validation schema
const validationMiddleware = require('../middlewares/validationMiddleware'); // Import validation middleware

const router = express.Router();

// Define routes

// --- Public Routes ---
// Anyone can get categories
router.get('/', getCategories);
router.get('/:slugOrId', getCategory); // Get a single category

// --- Protected Admin Routes ---
// Only logged-in admins can modify categories
router.post('/',
    protect, // 1. Check if logged in
    admin,   // 2. Check if admin
    validationMiddleware(categorySchema), // 3. Validate request body
    createCategory // 4. Run controller function
);
router.put('/:id',
    protect,
    admin,
    validationMiddleware(categorySchema),
    updateCategory
);
router.delete('/:id',
    protect,
    admin,
    deleteCategory // No body validation needed
);

module.exports = router;