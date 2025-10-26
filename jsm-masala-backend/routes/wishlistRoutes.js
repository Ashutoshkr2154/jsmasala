const express = require('express');
const {
    getWishlist,
    toggleWishlist,
} = require('../controllers/wishlistController'); // Import controller functions
const { protect } = require('../middlewares/authMiddleware'); // Import auth middleware
const validationMiddleware = require('../middlewares/validationMiddleware'); // Import validation middleware
const Joi = require('joi'); // Import Joi for simple validation

const router = express.Router();

// Apply 'protect' middleware to ALL wishlist routes
router.use(protect);

// Validation schema for toggling (POST)
const toggleWishlistSchema = Joi.object({
    productId: Joi.string().hex().length(24).required().messages({
        'string.empty': 'Product ID is required.',
        'string.hex': 'Product ID must be a valid ObjectId.',
        'string.length': 'Product ID must be 24 characters long.',
        'any.required': 'Product ID is required.'
    }),
});

// Define routes relative to '/api/wishlist'
router.route('/')
    .get(getWishlist) // GET /api/wishlist - Get user's wishlist
    .post(validationMiddleware(toggleWishlistSchema), toggleWishlist); // POST /api/wishlist - Add/Remove (toggle) item

module.exports = router;