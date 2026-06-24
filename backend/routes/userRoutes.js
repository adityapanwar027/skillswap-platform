import express from 'express';
import {
  getUsers,
  getUser,
  updateProfile,
  uploadAvatar,
  deleteProfile,
  toggleFavorite,
  getDashboard,
  getPublicStats,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { uploadAvatar as uploadMiddleware } from '../middleware/upload.js';

const router = express.Router();

router.get('/stats/public', getPublicStats);
router.get('/dashboard', protect, getDashboard);
router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/profile', protect, updateProfile);
router.put('/avatar', protect, uploadMiddleware, uploadAvatar);
router.delete('/profile', protect, deleteProfile);
router.post('/:id/favorite', protect, toggleFavorite);

export default router;
