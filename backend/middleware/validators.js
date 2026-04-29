const { body, param, query } = require('express-validator');

/**
 * Validation rules for authentication routes
 */
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password').notEmpty().withMessage('Password is required'),
];

/**
 * Validation rules for expense routes
 */
const expenseValidation = [
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be at least 0.01'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn([
      'Food',
      'Travel',
      'Shopping',
      'Bills',
      'Health',
      'Entertainment',
      'Education',
      'Others',
    ])
    .withMessage('Invalid category'),

  body('date')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date'),

  body('note')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Note cannot exceed 200 characters'),

  body('paymentMethod')
    .optional()
    .isIn(['Cash', 'Card', 'UPI', 'Net Banking', 'Other'])
    .withMessage('Invalid payment method'),
];

const expenseUpdateValidation = [
  body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be at least 0.01'),

  body('category')
    .optional()
    .trim()
    .isIn([
      'Food',
      'Travel',
      'Shopping',
      'Bills',
      'Health',
      'Entertainment',
      'Education',
      'Others',
    ])
    .withMessage('Invalid category'),

  body('date')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date'),

  body('note')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Note cannot exceed 200 characters'),

  body('paymentMethod')
    .optional()
    .isIn(['Cash', 'Card', 'UPI', 'Net Banking', 'Other'])
    .withMessage('Invalid payment method'),
];

const mongoIdValidation = [
  param('id').isMongoId().withMessage('Invalid ID format'),
];

module.exports = {
  registerValidation,
  loginValidation,
  expenseValidation,
  expenseUpdateValidation,
  mongoIdValidation,
};
