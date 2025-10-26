const express = require('express');
const {
    addOrderItems,
    getMyOrders,
    getOrderById,
    getOrders,
    updateOrderStatus,
} = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');
const { admin } = require('../middlewares/adminMiddleware');
// --- 1. Import schemas and middleware ---
const { createOrderSchema, updateStatusSchema } = require('../validators/orderValidators'); // <-- Import schemas
const validationMiddleware = require('../middlewares/validationMiddleware'); // <-- Import middleware
// ----------------------------------------

const router = express.Router();

router.use(protect); // Protect all order routes

// --- User Routes ---
// --- 2. Apply createOrderSchema validation ---
router.post('/', validationMiddleware(createOrderSchema), addOrderItems); // <-- Use validation
router.get('/myorders', getMyOrders);
router.get('/:id', getOrderById);

// --- Admin Routes ---
router.get('/', admin, getOrders);
// --- 3. Apply updateStatusSchema validation ---
router.put('/:id/status', admin, validationMiddleware(updateStatusSchema), updateOrderStatus); // <-- Use validation

module.exports = router;