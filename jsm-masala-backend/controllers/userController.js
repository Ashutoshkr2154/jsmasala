const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
const getUserProfile = async (req, res, next) => {
  // 'protect' middleware already found the user and attached it to req.user
  const user = req.user;

  if (user) {
    // Return relevant user details (excluding password)
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      createdAt: user.createdAt,
    });
  } else {
    // This case should technically not be reached if 'protect' works correctly
    res.status(404);
    return next(new Error('User not found'));
  }
};

// --- TODO: Add Update User Profile Controller ---
// const updateUserProfile = async (req, res, next) => { ... }

module.exports = {
  getUserProfile,
  // updateUserProfile, // Export later
};