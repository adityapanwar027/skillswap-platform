import SwapRequest from '../models/SwapRequest.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import { AppError } from '../middleware/errorHandler.js';
import { createNotification } from '../models/Notification.js';
import { logActivity } from '../models/ActivityLog.js';

// @desc    Send swap request
// @route   POST /api/swaps
export const createSwapRequest = asyncHandler(async (req, res) => {
  const { receiver, offeredSkill, requestedSkill, message } = req.body;

  if (receiver === req.user._id.toString()) {
    throw new AppError('Cannot send swap request to yourself', 400);
  }

  const receiverUser = await User.findById(receiver);
  if (!receiverUser || !receiverUser.isActive) throw new AppError('Receiver not found', 404);

  const existing = await SwapRequest.findOne({
    sender: req.user._id,
    receiver,
    status: 'pending',
  });
  if (existing) throw new AppError('You already have a pending request with this user', 400);

  const swapRequest = await SwapRequest.create({
    sender: req.user._id,
    receiver,
    offeredSkill,
    requestedSkill,
    message,
  });

  await createNotification({
    recipient: receiver,
    sender: req.user._id,
    type: 'swap_request',
    title: 'New Swap Request',
    message: `${req.user.name} wants to swap ${offeredSkill.name} for ${requestedSkill.name}`,
    link: '/dashboard/requests',
    metadata: { swapRequestId: swapRequest._id },
  });

  await logActivity({
    user: req.user._id,
    action: 'SWAP_REQUEST_SENT',
    resource: 'SwapRequest',
    resourceId: swapRequest._id,
    req,
  });

  const populated = await SwapRequest.findById(swapRequest._id)
    .populate('sender', 'name avatar')
    .populate('receiver', 'name avatar');

  res.status(201).json({ success: true, swapRequest: populated });
});

// @desc    Get swap requests
// @route   GET /api/swaps
export const getSwapRequests = asyncHandler(async (req, res) => {
  const { type = 'all', status } = req.query;
  let filter = {};

  if (type === 'sent') filter.sender = req.user._id;
  else if (type === 'received') filter.receiver = req.user._id;
  else filter.$or = [{ sender: req.user._id }, { receiver: req.user._id }];

  if (status) filter.status = status;

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const [requests, total] = await Promise.all([
    SwapRequest.find(filter)
      .populate('sender', 'name avatar skillsOffered')
      .populate('receiver', 'name avatar skillsWanted')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit),
    SwapRequest.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: requests.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    requests,
  });
});

// @desc    Respond to swap request
// @route   PUT /api/swaps/:id/respond
export const respondToSwap = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['accepted', 'rejected'].includes(status)) {
    throw new AppError('Status must be accepted or rejected', 400);
  }

  const swapRequest = await SwapRequest.findById(req.params.id);
  if (!swapRequest) throw new AppError('Swap request not found', 404);
  if (swapRequest.receiver.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized', 403);
  }
  if (swapRequest.status !== 'pending') {
    throw new AppError('Request already responded to', 400);
  }

  swapRequest.status = status;
  swapRequest.respondedAt = new Date();
  await swapRequest.save();

  await createNotification({
    recipient: swapRequest.sender,
    sender: req.user._id,
    type: status === 'accepted' ? 'swap_accepted' : 'swap_rejected',
    title: status === 'accepted' ? 'Swap Request Accepted!' : 'Swap Request Declined',
    message: `${req.user.name} ${status} your swap request`,
    link: '/dashboard/requests',
    metadata: { swapRequestId: swapRequest._id },
  });

  const populated = await SwapRequest.findById(swapRequest._id)
    .populate('sender', 'name avatar')
    .populate('receiver', 'name avatar');

  res.status(200).json({ success: true, swapRequest: populated });
});

// @desc    Cancel swap request
// @route   PUT /api/swaps/:id/cancel
export const cancelSwap = asyncHandler(async (req, res) => {
  const swapRequest = await SwapRequest.findById(req.params.id);
  if (!swapRequest) throw new AppError('Swap request not found', 404);

  const isSender = swapRequest.sender.toString() === req.user._id.toString();
  const isReceiver = swapRequest.receiver.toString() === req.user._id.toString();
  if (!isSender && !isReceiver) throw new AppError('Not authorized', 403);

  swapRequest.status = 'cancelled';
  await swapRequest.save();
  res.status(200).json({ success: true, swapRequest });
});

// @desc    Complete swap
// @route   PUT /api/swaps/:id/complete
export const completeSwap = asyncHandler(async (req, res) => {
  const swapRequest = await SwapRequest.findById(req.params.id);
  if (!swapRequest) throw new AppError('Swap request not found', 404);
  if (swapRequest.status !== 'accepted') throw new AppError('Swap must be accepted first', 400);

  const isParticipant =
    swapRequest.sender.toString() === req.user._id.toString() ||
    swapRequest.receiver.toString() === req.user._id.toString();
  if (!isParticipant) throw new AppError('Not authorized', 403);

  swapRequest.status = 'completed';
  swapRequest.completedAt = new Date();
  await swapRequest.save();
  res.status(200).json({ success: true, swapRequest });
});
