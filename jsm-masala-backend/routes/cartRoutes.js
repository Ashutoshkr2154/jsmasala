const express = require('express');
const {
    getCart,
    addItemToCart,
    updateCartItemQuantity,
    removeItemFromCart,
    clearCart,
} = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');
// --- 1. Import schemas and middleware ---
const { addItemSchema, updateQuantitySchema } = require('../validators/cartValidators'); // <-- Import schemas
const validationMiddleware = require('../middlewares/validationMiddleware'); // <-- Import middleware
// ----------------------------------------

const router = express.Router();

router.use(protect); // Apply auth check to all cart routes

router.route('/')
    .get(getCart)
    // --- 2. Apply addItemSchema validation ---
    .post(validationMiddleware(addItemSchema), addItemToCart) // <-- Use validation
    .delete(clearCart);

router.route('/:variantId')
    // --- 3. Apply updateQuantitySchema validation ---
    .put(validationMiddleware(updateQuantitySchema), updateCartItemQuantity) // <-- Use validation
    .delete(removeItemFromCart);

module.exports = router;