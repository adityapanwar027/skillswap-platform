import { body } from 'express-validator';

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 50 }),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

export const forgotPasswordValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
];

export const resetPasswordValidation = [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const skillValidation = [
  body('name').trim().notEmpty().withMessage('Skill name is required'),
  body('category').notEmpty().withMessage('Category is required'),
];

export const swapRequestValidation = [
  body('receiver').notEmpty().withMessage('Receiver is required'),
  body('offeredSkill.name').notEmpty().withMessage('Offered skill is required'),
  body('requestedSkill.name').notEmpty().withMessage('Requested skill is required'),
];

export const reviewValidation = [
  body('reviewee').notEmpty().withMessage('Reviewee is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
];

export const messageValidation = [
  body('receiver').notEmpty().withMessage('Receiver is required'),
  body('content').trim().notEmpty().withMessage('Message content is required'),
];
