/**
 * Custom error handler middleware
 * Provides consistent error responses across the API
 */
const errorHandler = (err, req, res, next) => {
  // Log error for server-side debugging
  console.error(err.stack);
  
  // Default error object
  const error = {
    success: false,
    error: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  };

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error.message = `Resource not found with id of ${err.value}`;
    error.error = 'Resource not found';
    return res.status(404).json(error);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    error.message = 'Duplicate field value entered';
    error.error = 'Validation Error';
    return res.status(400).json(error);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error.message = Object.values(err.errors).map(val => val.message);
    error.error = 'Validation Error';
    return res.status(400).json(error);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.error = 'Invalid token';
    return res.status(401).json(error);
  }

  if (err.name === 'TokenExpiredError') {
    error.error = 'Token expired';
    return res.status(401).json(error);
  }

  // Set status code
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json(error);
};

module.exports = errorHandler;
