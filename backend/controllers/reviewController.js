import Review from '../models/Review.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import { AppError } from '../middleware/errorHandler.js';
import { createNotification } from '../models/Notification.js';
import { logActivity } from '../models/ActivityLog.js';

const updateUserRating = async (userId) => {
  const stats = await Review.aggregate([
    { $match: { reviewee: userId, isApproved: true } },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  const averageRating = stats[0]?.avgRating ? Math.round(stats[0].avgRating * 10) / 10 : 0;
  const reviewCount = stats[0]?.count || 0;
  await User.findByIdAndUpdate(userId, { averageRating, reviewCount });
};

// @desc    Create review
// @route   POST /api/reviews
export const createReview = asyncHandler(async (req, res) => {
  const { reviewee, rating, title, comment, swapRequest } = req.body;

  if (reviewee === req.user._id.toString()) {
    throw new AppError('Cannot review yourself', 400);
  }

  const revieweeUser = await User.findById(reviewee);
  if (!revieweeUser) throw new AppError('User not found', 404);

  const review = await Review.create({
    reviewer: req.user._id,
    reviewee,
    rating,
    title,
    comment,
    swapRequest,
  });

  await updateUserRating(reviewee);

  await createNotification({
    recipient: reviewee,
    sender: req.user._id,
    type: 'review',
    title: 'New Review',
    message: `${req.user.name} left you a ${rating}-star review`,
    link: `/users/${reviewee}`,
    metadata: { reviewId: review._id },
  });

  await logActivity({
    user: req.user._id,
    action: 'REVIEW_CREATED',
    resource: 'Review',
    resourceId: review._id,
    req,
  });

  const populated = await Review.findById(review._id).populate('reviewer', 'name avatar');
  res.status(201).json({ success: true, review: populated });
});

// @desc    Get reviews for user
// @route   GET /api/reviews/user/:userId
export const getUserReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const filter = { reviewee: req.params.userId, isApproved: true };
  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate('reviewer', 'name avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit),
    Review.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: reviews.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    reviews,
  });
});

// @desc    Update own review
// @route   PUT /api/reviews/:id
export const updateReview = asyncHandler(async (req, res) => {
  let review = await Review.findById(req.params.id);
  if (!review) throw new AppError('Review not found', 404);
  if (review.reviewer.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized', 403);
  }

  const { rating, title, comment } = req.body;
  review.rating = rating ?? review.rating;
  review.title = title ?? review.title;
  review.comment = comment ?? review.comment;
  await review.save();

  await updateUserRating(review.reviewee);
  res.status(200).json({ success: true, review });
});

// @desc    Delete own review
// @route   DELETE /api/reviews/:id
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new AppError('Review not found', 404);
  if (review.reviewer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized', 403);
  }

  const revieweeId = review.reviewee;
  await review.deleteOne();
  await updateUserRating(revieweeId);
  res.status(200).json({ success: true, message: 'Review deleted' });
});

// @desc    Get my reviews
// @route   GET /api/reviews/me
export const getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ reviewer: req.user._id })
    .populate('reviewee', 'name avatar')
    .sort('-createdAt');
  res.status(200).json({ success: true, reviews });
});
