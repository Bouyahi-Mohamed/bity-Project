import express from 'express';
import { searchAds, getNotifications, markNotificationsAsRead, toggleSaveAd, getSavedAds, getDashboardStats } from '../controllers/studentController.js';
import { authMiddleware, checkRole, checkVerified } from '../middleware/auth.js';

const router = express.Router();

// Smart search (restricted to verified students or admins)
router.get('/search', authMiddleware, checkVerified, checkRole(['student', 'admin']), searchAds);

// Fetch notifications (for price drops, new ads)
router.get('/notifications', authMiddleware, getNotifications);

// Mark notification as read
router.post('/notifications/read', authMiddleware, markNotificationsAsRead);

// Saved Ads
router.post('/saved', authMiddleware, toggleSaveAd);
router.get('/saved', authMiddleware, getSavedAds);

// Dashboard Stats
router.get('/dashboard-stats', authMiddleware, getDashboardStats);

export default router;
