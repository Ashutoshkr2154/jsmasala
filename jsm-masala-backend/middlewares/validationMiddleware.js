const validationMiddleware = (schema) => {
    return (req, res, next) => {
        // Validate req.body against the provided Joi schema
        const { error } = schema.validate(req.body, {
            abortEarly: false, // Return all errors, not just the first
            stripUnknown: true, // Remove properties not defined in the schema
        });

        if (error) {
            // If validation fails, extract error messages and send a 400 response
            const errorMessage = error.details.map((detail) => detail.message).join(', ');
            res.status(400); // Bad Request
            // Use next(error) to pass to the central error handler
            return next(new Error(`Validation Error: ${errorMessage}`));
        }

        // If validation passes, proceed to the next middleware/controller
        next();
    };
};

module.exports = validationMiddleware;