import User from '../models/User.js';
import Review from '../models/Review.js';
import SwapRequest from '../models/SwapRequest.js';
import asyncHandler from '../utils/asyncHandler.js';
import { AppError } from '../middleware/errorHandler.js';
import APIFeatures from '../utils/apiFeatures.js';
import cloudinary from '../config/cloudinary.js';
import { logActivity } from '../models/ActivityLog.js';

// @desc    Get all users (search/filter)
// @route   GET /api/users
export const getUsers = asyncHandler(async (req, res) => {
  let query = User.find({ isActive: true, role: 'user' });

  if (req.query.skill) {
    const skillRegex = new RegExp(req.query.skill, 'i');
    query = User.find({
      isActive: true,
      role: 'user',
      $or: [{ 'skillsOffered.name': skillRegex }, { 'skillsWanted.name': skillRegex }],
    });
  }

  const features = new APIFeatures(query, req.query).search(['name', 'bio', 'location']).sort().limitFields().paginate();
  const users = await features.query.select('-password -resetPasswordToken -resetPasswordExpire');
  const total = await User.countDocuments(
    req.query.skill
      ? {
          isActive: true,
          role: 'user',
          $or: [
            { 'skillsOffered.name': new RegExp(req.query.skill, 'i') },
            { 'skillsWanted.name': new RegExp(req.query.skill, 'i') },
          ],
        }
      : { isActive: true, role: 'user' }
  );

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    page: features.page,
    pages: Math.ceil(total / features.limit),
    users,
  });
});

// @desc    Get single user profile
// @route   GET /api/users/:id
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password -resetPasswordToken -resetPasswordExpire')
    .populate('skillsOffered.skill skillsWanted.skill');

  if (!user || !user.isActive) throw new AppError('User not found', 404);

  const reviews = await Review.find({ reviewee: user._id, isApproved: true })
    .populate('reviewer', 'name avatar')
    .sort('-createdAt')
    .limit(10);

  res.status(200).json({ success: true, user, reviews });
});

// @desc    Update profile
// @route   PUT /api/users/profile
export const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'bio', 'location', 'skillsOffered', 'skillsWanted'];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  }).select('-password');

  await logActivity({ user: req.user._id, action: 'PROFILE_UPDATED', resource: 'User', resourceId: user._id, req });
  res.status(200).json({ success: true, user });
});

// @desc    Upload avatar
// @route   PUT /api/users/avatar
export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError('Please upload an image', 400);

  const user = await User.findById(req.user._id);
  if (user.avatar?.public_id) {
    await cloudinary.uploader.destroy(user.avatar.public_id);
  }

  user.avatar = { public_id: req.file.filename, url: req.file.path };
  await user.save();

  res.status(200).json({ success: true, avatar: user.avatar });
});

// @desc    Delete profile
// @route   DELETE /api/users/profile
export const deleteProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user.avatar?.public_id) {
    await cloudinary.uploader.destroy(user.avatar.public_id);
  }
  user.isActive = false;
  user.email = `deleted_${Date.now()}_${user.email}`;
  await user.save({ validateBeforeSave: false });

  await logActivity({ user: req.user._id, action: 'PROFILE_DELETED', resource: 'User', resourceId: user._id, req });
  res.status(200).json({ success: true, message: 'Profile deleted successfully' });
});

// @desc    Toggle favorite user
// @route   POST /api/users/:id/favorite
export const toggleFavorite = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    throw new AppError('Cannot favorite yourself', 400);
  }

  const user = await User.findById(req.user._id);
  const targetId = req.params.id;
  const index = user.favorites.indexOf(targetId);

  if (index > -1) {
    user.favorites.splice(index, 1);
  } else {
    user.favorites.push(targetId);
  }
  await user.save();

  res.status(200).json({
    success: true,
    isFavorite: index === -1,
    favorites: user.favorites,
  });
});

// @desc    Get user dashboard stats
// @route   GET /api/users/dashboard
export const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const [sentRequests, receivedRequests, reviews, favorites] = await Promise.all([
    SwapRequest.countDocuments({ sender: userId }),
    SwapRequest.countDocuments({ receiver: userId }),
    Review.countDocuments({ reviewee: userId, isApproved: true }),
    User.findById(userId).select('favorites'),
  ]);

  const pendingReceived = await SwapRequest.countDocuments({ receiver: userId, status: 'pending' });
  const acceptedSwaps = await SwapRequest.countDocuments({
    $or: [{ sender: userId }, { receiver: userId }],
    status: 'accepted',
  });
  const completedSwaps = await SwapRequest.countDocuments({
    $or: [{ sender: userId }, { receiver: userId }],
    status: 'completed',
  });

  res.status(200).json({
    success: true,
    stats: {
      sentRequests,
      receivedRequests,
      pendingReceived,
      acceptedSwaps,
      completedSwaps,
      reviews,
      favoritesCount: favorites?.favorites?.length || 0,
      averageRating: req.user.averageRating,
    },
  });
});

// @desc    Get platform statistics (public)
// @route   GET /api/users/stats/public
export const getPublicStats = asyncHandler(async (req, res) => {
  const [users, swaps, reviews] = await Promise.all([
    User.countDocuments({ isActive: true, role: 'user' }),
    SwapRequest.countDocuments({ status: { $in: ['accepted', 'completed'] } }),
    Review.countDocuments({ isApproved: true }),
  ]);

  res.status(200).json({
    success: true,
    stats: { users, swaps, reviews, skills: 50 },
  });
});
