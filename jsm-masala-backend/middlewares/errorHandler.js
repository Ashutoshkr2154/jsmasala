// Middleware to handle routes that are not found (404)
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass the error to the next middleware (our general error handler)
};

// General error handling middleware (should be the last middleware used)
const errorHandler = (err, req, res, next) => {
  // Determine the status code: use the response status code if it's already set and not 200, otherwise use 500 (Internal Server Error)
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Mongoose Bad ObjectId Error Handler (CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404; // Treat as Not Found
    message = 'Resource not found';
  }

  // Mongoose Duplicate Key Error Handler (code 11000)
  if (err.code === 11000) {
    statusCode = 400; // Bad Request
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value entered for ${field}. Please use another value.`;
  }

  // Mongoose Validation Error Handler
  if (err.name === 'ValidationError') {
    statusCode = 400; // Bad Request
    // Combine multiple validation messages if they exist
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  // JWT Specific Errors (adjust based on middleware error messages)
  if (message === 'Not authorized, token failed' || message === 'Not authorized, no token' || message === 'Not authorized, user not found') {
      statusCode = 401; // Unauthorized
  }
   if (message === 'Not authorized, token expired') {
      statusCode = 401; // Unauthorized (could also use 403 Forbidden)
  }

  // Send the error response
  res.status(statusCode).json({
    message: message,
    // Include stack trace only in development mode for debugging
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };