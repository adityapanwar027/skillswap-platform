import Skill from '../models/Skill.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import { AppError } from '../middleware/errorHandler.js';
import APIFeatures from '../utils/apiFeatures.js';
import cloudinary from '../config/cloudinary.js';
import { logActivity } from '../models/ActivityLog.js';

// @desc    Get all skills
// @route   GET /api/skills
export const getSkills = asyncHandler(async (req, res) => {
  let query = Skill.find({ isActive: true });
  if (req.query.featured === 'true') query = Skill.find({ isActive: true, isFeatured: true });
  if (req.query.category) query = Skill.find({ isActive: true, category: req.query.category });

  const features = new APIFeatures(query, req.query).search(['name', 'description', 'category']).sort().paginate();
  const skills = await features.query;
  const total = await Skill.countDocuments({ isActive: true });

  res.status(200).json({
    success: true,
    count: skills.length,
    total,
    page: features.page,
    pages: Math.ceil(total / features.limit),
    skills,
  });
});

// @desc    Get single skill
// @route   GET /api/skills/:id
export const getSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id).populate('createdBy', 'name avatar');
  if (!skill || !skill.isActive) throw new AppError('Skill not found', 404);

  const usersWithSkill = await User.find({
    isActive: true,
    $or: [{ 'skillsOffered.name': new RegExp(skill.name, 'i') }, { 'skillsWanted.name': new RegExp(skill.name, 'i') }],
  })
    .select('name avatar bio averageRating skillsOffered skillsWanted location')
    .limit(12);

  res.status(200).json({ success: true, skill, users: usersWithSkill });
});

// @desc    Get skill by slug
// @route   GET /api/skills/slug/:slug
export const getSkillBySlug = asyncHandler(async (req, res) => {
  const skill = await Skill.findOne({ slug: req.params.slug, isActive: true });
  if (!skill) throw new AppError('Skill not found', 404);
  req.params.id = skill._id;
  return getSkill(req, res);
});

// @desc    Create skill (admin)
// @route   POST /api/skills
export const createSkill = asyncHandler(async (req, res) => {
  const data = { ...req.body, createdBy: req.user._id };
  if (req.file) {
    data.image = { public_id: req.file.filename, url: req.file.path };
  }
  const skill = await Skill.create(data);
  await logActivity({ user: req.user._id, action: 'SKILL_CREATED', resource: 'Skill', resourceId: skill._id, req });
  res.status(201).json({ success: true, skill });
});

// @desc    Update skill (admin)
// @route   PUT /api/skills/:id
export const updateSkill = asyncHandler(async (req, res) => {
  let skill = await Skill.findById(req.params.id);
  if (!skill) throw new AppError('Skill not found', 404);

  const updates = { ...req.body };
  if (req.file) {
    if (skill.image?.public_id) await cloudinary.uploader.destroy(skill.image.public_id);
    updates.image = { public_id: req.file.filename, url: req.file.path };
  }

  skill = await Skill.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  res.status(200).json({ success: true, skill });
});

// @desc    Delete skill (admin)
// @route   DELETE /api/skills/:id
export const deleteSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);
  if (!skill) throw new AppError('Skill not found', 404);

  skill.isActive = false;
  await skill.save();
  res.status(200).json({ success: true, message: 'Skill deactivated' });
});

// @desc    Get skill categories
// @route   GET /api/skills/meta/categories
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Skill.distinct('category', { isActive: true });
  res.status(200).json({ success: true, categories });
});
