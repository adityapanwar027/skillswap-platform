import express from 'express';
import {
  getConversations,
  getMessages,
  sendMessage,
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { messageValidation } from '../middleware/validators.js';

const router = express.Router();

router.use(protect);
router.get('/conversations', getConversations);
router.post('/', messageValidation, validate, sendMessage);
router.get('/:userId', getMessages);

export default router;
