import express from 'express';
import { register, login, getProfile, getUserById, updateProfile, searchUsers, rateUser, updateAvatar } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Register with document uploads
router.post('/register', upload.fields([
  { name: 'studentCardImage', maxCount: 1 },
  { name: 'cinImage', maxCount: 1 },
  { name: 'utilityBillImage', maxCount: 1 }
]), register);

// Login
router.post('/login', login);

// Profile
router.get('/me', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.put('/profile/avatar', authMiddleware, upload.single('avatar'), updateAvatar);

// Search users
router.get('/users', authMiddleware, searchUsers);

// Public/student viewable user profiles
router.get('/users/:id', authMiddleware, getUserById);

// Rate a user (roommate or owner)
router.post('/users/rate', authMiddleware, rateUser);

export default router;
