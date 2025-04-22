import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { body } from 'express-validator';

const router = Router();

// Validation middleware
const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password').trim().notEmpty().withMessage('Password is required'),
];

// Routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

export default router; 