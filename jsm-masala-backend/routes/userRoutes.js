const express = require('express');
const { getUserProfile } = require('../controllers/userController'); // Import controller
const { protect } = require('../middlewares/authMiddleware'); // Import protect middleware

const router = express.Router();

// Define routes
// GET /api/users/me - Runs 'protect' first, then 'getUserProfile'
router.get('/me', protect, getUserProfile);

// TODO: Add route for updating profile later
// router.put('/me', protect, updateUserProfile);

module.exports = router;