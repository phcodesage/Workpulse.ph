const { body } = require('express-validator');

/**
 * Validation rules for creating/updating an employer profile
 */
exports.employerProfileValidation = [
  body('companyName')
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),
  
  body('industry')
    .notEmpty()
    .withMessage('Industry is required'),
  
  body('location')
    .notEmpty()
    .withMessage('Location is required'),
  
  body('website')
    .optional()
    .isURL()
    .withMessage('Website must be a valid URL'),
  
  body('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),
  
  body('logo')
    .optional()
    .isURL()
    .withMessage('Logo must be a valid URL'),
  
  body('contactEmail')
    .optional()
    .isEmail()
    .withMessage('Contact email must be a valid email address')
    .normalizeEmail(),
  
  body('contactPhone')
    .optional()
];

/**
 * Validation rules for creating/updating a job seeker profile
 */
exports.jobSeekerProfileValidation = [
  body('title')
    .notEmpty()
    .withMessage('Professional title is required')
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  
  body('skills')
    .isArray()
    .withMessage('Skills must be an array')
    .notEmpty()
    .withMessage('At least one skill is required'),
  
  body('experience')
    .optional()
    .isArray()
    .withMessage('Experience must be an array'),
  
  body('experience.*.title')
    .optional()
    .isString()
    .withMessage('Experience title must be a string'),
  
  body('experience.*.company')
    .optional()
    .isString()
    .withMessage('Experience company must be a string'),
  
  body('experience.*.startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  
  body('experience.*.endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),
  
  body('experience.*.description')
    .optional()
    .isString()
    .withMessage('Experience description must be a string'),
  
  body('education')
    .optional()
    .isArray()
    .withMessage('Education must be an array'),
  
  body('education.*.institution')
    .optional()
    .isString()
    .withMessage('Education institution must be a string'),
  
  body('education.*.degree')
    .optional()
    .isString()
    .withMessage('Education degree must be a string'),
  
  body('education.*.field')
    .optional()
    .isString()
    .withMessage('Education field must be a string'),
  
  body('education.*.startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  
  body('education.*.endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),
  
  body('location')
    .notEmpty()
    .withMessage('Location is required'),
  
  body('bio')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Bio must not exceed 1000 characters'),
  
  body('photo')
    .optional()
    .isURL()
    .withMessage('Photo must be a valid URL'),
  
  body('resume')
    .optional()
    .isURL()
    .withMessage('Resume must be a valid URL')
];
