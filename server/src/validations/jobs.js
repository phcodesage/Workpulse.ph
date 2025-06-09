const { body } = require('express-validator');

/**
 * Validation rules for creating a job
 */
exports.createJobValidation = [
  body('title')
    .notEmpty()
    .withMessage('Job title is required')
    .isLength({ min: 5, max: 100 })
    .withMessage('Job title must be between 5 and 100 characters'),
  
  body('description')
    .notEmpty()
    .withMessage('Job description is required')
    .isLength({ min: 20 })
    .withMessage('Job description must be at least 20 characters'),
  
  body('location')
    .notEmpty()
    .withMessage('Job location is required'),
  
  body('salary')
    .optional()
    .isString()
    .withMessage('Salary must be a string'),
  
  body('type')
    .notEmpty()
    .withMessage('Job type is required')
    .isIn(['full-time', 'part-time', 'contract', 'internship', 'remote'])
    .withMessage('Job type must be one of: full-time, part-time, contract, internship, remote'),
  
  body('category')
    .notEmpty()
    .withMessage('Job category is required'),
  
  body('skills')
    .isArray()
    .withMessage('Skills must be an array'),
  
  body('requirements')
    .isArray()
    .withMessage('Requirements must be an array'),
  
  body('status')
    .optional()
    .isIn(['open', 'closed'])
    .withMessage('Status must be either open or closed')
];

/**
 * Validation rules for updating a job
 */
exports.updateJobValidation = [
  body('title')
    .optional()
    .isLength({ min: 5, max: 100 })
    .withMessage('Job title must be between 5 and 100 characters'),
  
  body('description')
    .optional()
    .isLength({ min: 20 })
    .withMessage('Job description must be at least 20 characters'),
  
  body('location')
    .optional(),
  
  body('salary')
    .optional()
    .isString()
    .withMessage('Salary must be a string'),
  
  body('type')
    .optional()
    .isIn(['full-time', 'part-time', 'contract', 'internship', 'remote'])
    .withMessage('Job type must be one of: full-time, part-time, contract, internship, remote'),
  
  body('category')
    .optional(),
  
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  
  body('requirements')
    .optional()
    .isArray()
    .withMessage('Requirements must be an array'),
  
  body('status')
    .optional()
    .isIn(['open', 'closed'])
    .withMessage('Status must be either open or closed')
];
