import express from 'express';
import {
  getSkills,
  getSkill,
  getSkillBySlug,
  createSkill,
  updateSkill,
  deleteSkill,
  getCategories,
} from '../controllers/skillController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { skillValidation } from '../middleware/validators.js';
import { uploadSkillImage } from '../middleware/upload.js';

const router = express.Router();

router.get('/meta/categories', getCategories);
router.get('/slug/:slug', getSkillBySlug);
router.route('/').get(getSkills).post(protect, authorize('admin'), uploadSkillImage, skillValidation, validate, createSkill);
router
  .route('/:id')
  .get(getSkill)
  .put(protect, authorize('admin'), uploadSkillImage, updateSkill)
  .delete(protect, authorize('admin'), deleteSkill);

export default router;
