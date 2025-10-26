// Middleware to check if the user has an 'admin' role
const admin = (req, res, next) => {
    // Assumes 'protect' middleware has run and attached req.user
    if (req.user && req.user.role === 'admin') {
        next(); // User is an admin, proceed to the next handler
    } else {
        res.status(403); // 403 Forbidden - logged in, but not authorized
        // Use next(error) to pass to the central error handler
        return next(new Error('Not authorized as an admin'));
    }
};

module.exports = { admin };