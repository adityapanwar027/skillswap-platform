import express from 'express';
import {
  getAnalytics,
  getAllUsers,
  updateUser,
  deleteUser,
  getAdminReviews,
  moderateReview,
  getActivityLogs,
  broadcastNotification,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/reviews', getAdminReviews);
router.put('/reviews/:id', moderateReview);
router.get('/activity', getActivityLogs);
router.post('/notifications/broadcast', broadcastNotification);

export default router;
