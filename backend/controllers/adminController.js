import User from '../models/User.js';
import Skill from '../models/Skill.js';
import Review from '../models/Review.js';
import SwapRequest from '../models/SwapRequest.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import ActivityLog from '../models/ActivityLog.js';
import asyncHandler from '../utils/asyncHandler.js';
import { AppError } from '../middleware/errorHandler.js';
import APIFeatures from '../utils/apiFeatures.js';

// @desc    Admin dashboard analytics
// @route   GET /api/admin/analytics
export const getAnalytics = asyncHandler(async (req, res) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [totalUsers, activeUsers, totalSkills, totalSwaps, totalReviews, totalMessages, recentUsers, recentActivity] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Skill.countDocuments({ isActive: true }),
      SwapRequest.countDocuments(),
      Review.countDocuments(),
      Message.countDocuments(),
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      ActivityLog.find().sort('-createdAt').limit(20).populate('user', 'name avatar'),
    ]);

  const swapsByStatus = await SwapRequest.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const usersByMonth = await User.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    success: true,
    analytics: {
      totalUsers,
      activeUsers,
      totalSkills,
      totalSwaps,
      totalReviews,
      totalMessages,
      recentUsers,
      swapsByStatus,
      usersByMonth,
      recentActivity,
    },
  });
});

// @desc    Get all users (admin)
// @route   GET /api/admin/users
export const getAllUsers = asyncHandler(async (req, res) => {
  const features = new APIFeatures(User.find(), req.query).search(['name', 'email']).sort().paginate();
  const users = await features.query.select('-password');
  const total = await User.countDocuments();
  res.status(200).json({ success: true, count: users.length, total, users });
});

// @desc    Update user (admin)
// @route   PUT /api/admin/users/:id
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).select('-password');
  if (!user) throw new AppError('User not found', 404);
  res.status(200).json({ success: true, user });
});

// @desc    Delete user (admin)
// @route   DELETE /api/admin/users/:id
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  user.isActive = false;
  await user.save();
  res.status(200).json({ success: true, message: 'User deactivated' });
});

// @desc    Get flagged reviews
// @route   GET /api/admin/reviews
export const getAdminReviews = asyncHandler(async (req, res) => {
  const filter = req.query.flagged === 'true' ? { isFlagged: true } : {};
  const reviews = await Review.find(filter)
    .populate('reviewer', 'name email')
    .populate('reviewee', 'name email')
    .sort('-createdAt');
  res.status(200).json({ success: true, reviews });
});

// @desc    Moderate review
// @route   PUT /api/admin/reviews/:id
export const moderateReview = asyncHandler(async (req, res) => {
  const { isApproved, isFlagged } = req.body;
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { isApproved, isFlagged },
    { new: true }
  );
  if (!review) throw new AppError('Review not found', 404);
  res.status(200).json({ success: true, review });
});

// @desc    Get activity logs
// @route   GET /api/admin/activity
export const getActivityLogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    ActivityLog.find().populate('user', 'name email').sort('-createdAt').skip(skip).limit(limit),
    ActivityLog.countDocuments(),
  ]);

  res.status(200).json({ success: true, count: logs.length, total, logs });
});

// @desc    Send system notification
// @route   POST /api/admin/notifications/broadcast
export const broadcastNotification = asyncHandler(async (req, res) => {
  const { title, message, link } = req.body;
  const users = await User.find({ isActive: true, role: 'user' }).select('_id');

  const notifications = users.map((user) => ({
    recipient: user._id,
    type: 'system',
    title,
    message,
    link: link || '',
  }));

  await Notification.insertMany(notifications);
  res.status(200).json({ success: true, message: `Sent to ${users.length} users` });
});
