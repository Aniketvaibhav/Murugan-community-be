import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload';

const router = Router();

// Get user profile
router.get('/profile', protect, UserController.getProfile);

// Update user profile
router.put(
  '/profile',
  protect,
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  UserController.updateProfile
);

export default router; 