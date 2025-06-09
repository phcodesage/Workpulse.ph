/**
 * Middleware for validating request data
 */
const { validationResult } = require('express-validator');

/**
 * Validation middleware
 * @param {Array} validations - Array of express-validator validation rules
 */
const validate = (validations) => {
  return async (req, res, next) => {
    // Execute all validations
    await Promise.all(validations.map(validation => validation.run(req)));
    
    // Check for validation errors
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        errors: errors.array()
      });
    }
    
    next();
  };
};

module.exports = validate;
