import express from 'express';
import {
  createReview,
  getUserReviews,
  updateReview,
  deleteReview,
  getMyReviews,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { reviewValidation } from '../middleware/validators.js';

const router = express.Router();

router.get('/user/:userId', getUserReviews);
router.get('/me', protect, getMyReviews);
router.post('/', protect, reviewValidation, validate, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;
