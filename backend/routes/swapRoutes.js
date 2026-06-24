import express from 'express';
import {
  createSwapRequest,
  getSwapRequests,
  respondToSwap,
  cancelSwap,
  completeSwap,
} from '../controllers/swapController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { swapRequestValidation } from '../middleware/validators.js';

const router = express.Router();

router.use(protect);
router.route('/').get(getSwapRequests).post(swapRequestValidation, validate, createSwapRequest);
router.put('/:id/respond', respondToSwap);
router.put('/:id/cancel', cancelSwap);
router.put('/:id/complete', completeSwap);

export default router;
