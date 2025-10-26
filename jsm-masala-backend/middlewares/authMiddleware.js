const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import User model to find user details
require('dotenv').config(); // Ensure env variables are loaded

const protect = async (req, res, next) => {
    let token;

    // Check for token in Authorization header (format: Bearer <token>)
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Extract token from header ("Bearer ASD...")
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user associated with the token ID
            // Exclude the password field from the user object
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                 // If user doesn't exist (e.g., deleted after token was issued)
                 res.status(401); // Unauthorized
                 return next(new Error('Not authorized, user not found'));
            }

            // If token is valid and user exists, proceed to the next middleware/route handler
            next();
        } catch (error) {
            console.error('Token verification failed:', error.message);
            res.status(401); // Unauthorized
            // Pass a specific error message based on JWT error type
            if (error.name === 'JsonWebTokenError') {
                 return next(new Error('Not authorized, token failed'));
            } else if (error.name === 'TokenExpiredError') {
                 return next(new Error('Not authorized, token expired'));
            } else {
                 return next(new Error('Not authorized, token error'));
            }
        }
    }

    // If no token is found in the header
    if (!token) {
        res.status(401); // Unauthorized
        return next(new Error('Not authorized, no token provided'));
    }
};

module.exports = { protect }; // Export the middleware