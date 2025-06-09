const { body } = require('express-validator');

/**
 * Validation rules for creating a job application
 */
exports.createApplicationValidation = [
  body('coverLetter')
    .notEmpty()
    .withMessage('Cover letter is required')
    .isLength({ min: 50, max: 2000 })
    .withMessage('Cover letter must be between 50 and 2000 characters'),
  
  body('resume')
    .optional()
    .isURL()
    .withMessage('Resume must be a valid URL'),
  
  body('additionalDocuments')
    .optional()
    .isArray()
    .withMessage('Additional documents must be an array'),
  
  body('additionalDocuments.*.name')
    .optional()
    .isString()
    .withMessage('Document name must be a string'),
  
  body('additionalDocuments.*.url')
    .optional()
    .isURL()
    .withMessage('Document URL must be a valid URL')
];

/**
 * Validation rules for updating a job application status
 */
exports.updateApplicationStatusValidation = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['pending', 'reviewing', 'accepted', 'rejected'])
    .withMessage('Status must be one of: pending, reviewing, accepted, rejected')
];
