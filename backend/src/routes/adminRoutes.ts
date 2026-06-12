import express from 'express';
import { getPendingUsers, verifyUser, rejectUser, getAnalytics, sendManualEmail } from '../controllers/adminController.js';
import { authMiddleware, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Enforce admin check for all routes in this router
router.use(authMiddleware, checkRole(['admin']));

// Verification queue
router.get('/pending-users', getPendingUsers);

// Validate a user profile (set is_verified = true)
router.post('/verify-user/:id', verifyUser);

// Reject a user profile (notify, delete docs)
router.post('/reject-user/:id', rejectUser);

// Analytics statistics dashboard
router.get('/analytics', getAnalytics);

// Send manual email directly from dashboard
router.post('/send-email', sendManualEmail);

export default router;
