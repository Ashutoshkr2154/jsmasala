const express = require('express');
const {
    getDashboardStats,
    getUsers,
    // deleteUser,
    // updateUserRole,
} = require('../controllers/adminController'); // Import controller functions
const { protect } = require('../middlewares/authMiddleware'); // Import general auth middleware
const { admin } = require('../middlewares/adminMiddleware'); // Import admin check middleware

const router = express.Router();

// Apply 'protect' and 'admin' middleware to ALL routes in this file
// This ensures only logged-in admins can access these endpoints
router.use(protect, admin);

// Define routes relative to '/api/admin'
router.get('/stats', getDashboardStats); // GET /api/admin/stats
router.get('/users', getUsers);         // GET /api/admin/users

// TODO: Add routes for deleting/updating users later
// router.delete('/users/:id', deleteUser);
// router.put('/users/:id/role', updateUserRole);

module.exports = router;