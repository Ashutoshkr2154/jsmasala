const express = require('express');
// 1. Import *all* controller functions, including refreshToken
const {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    logoutUser,
    refreshToken // <-- Added import
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema
} = require('../validators/authValidators');
const validationMiddleware = require('../middlewares/validationMiddleware');

const router = express.Router();

// --- Public Authentication Routes ---
router.post('/register', validationMiddleware(registerSchema), registerUser);
router.post('/login', validationMiddleware(loginSchema), loginUser);
router.post('/forgotpassword', validationMiddleware(forgotPasswordSchema), forgotPassword);
router.put('/resetpassword/:resetToken', validationMiddleware(resetPasswordSchema), resetPassword);

// --- 2. Add Refresh Token Route ---
// Public route, relies on HttpOnly cookie for authentication
router.post('/refresh', refreshToken);
// ---------------------------------

// --- Protected Authentication Route ---
router.post('/logout', protect, logoutUser); // Logout requires knowing *who* is logging out (needs access token)


module.exports = router;