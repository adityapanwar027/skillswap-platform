import Message, { getConversationId } from '../models/Message.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import { AppError } from '../middleware/errorHandler.js';
import { createNotification } from '../models/Notification.js';

// @desc    Get conversations list
// @route   GET /api/messages/conversations
export const getConversations = asyncHandler(async (req, res) => {
  const messages = await Message.aggregate([
    {
      $match: {
        $or: [{ sender: req.user._id }, { receiver: req.user._id }],
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: '$conversationId',
        lastMessage: { $first: '$$ROOT' },
        unreadCount: {
          $sum: {
            $cond: [
              { $and: [{ $eq: ['$receiver', req.user._id] }, { $eq: ['$isRead', false] }] },
              1,
              0,
            ],
          },
        },
      },
    },
    { $sort: { 'lastMessage.createdAt': -1 } },
  ]);

  const conversations = await Promise.all(
    messages.map(async (conv) => {
      const otherUserId =
        conv.lastMessage.sender.toString() === req.user._id.toString()
          ? conv.lastMessage.receiver
          : conv.lastMessage.sender;
      const otherUser = await User.findById(otherUserId).select('name avatar isOnline lastSeen');
      return {
        conversationId: conv._id,
        otherUser,
        lastMessage: conv.lastMessage,
        unreadCount: conv.unreadCount,
      };
    })
  );

  res.status(200).json({ success: true, conversations });
});

// @desc    Get messages in conversation
// @route   GET /api/messages/:userId
export const getMessages = asyncHandler(async (req, res) => {
  const conversationId = getConversationId(req.user._id, req.params.userId);
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = (page - 1) * limit;

  const [messages, total] = await Promise.all([
    Message.find({ conversationId })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit),
    Message.countDocuments({ conversationId }),
  ]);

  await Message.updateMany(
    { conversationId, receiver: req.user._id, isRead: false },
    { isRead: true, readAt: new Date() }
  );

  res.status(200).json({
    success: true,
    conversationId,
    count: messages.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    messages: messages.reverse(),
  });
});

// @desc    Send message (REST fallback)
// @route   POST /api/messages
export const sendMessage = asyncHandler(async (req, res) => {
  const { receiver, content } = req.body;
  const receiverUser = await User.findById(receiver);
  if (!receiverUser) throw new AppError('Receiver not found', 404);

  const conversationId = getConversationId(req.user._id, receiver);
  const message = await Message.create({
    conversationId,
    sender: req.user._id,
    receiver,
    content,
  });

  const populated = await Message.findById(message._id)
    .populate('sender', 'name avatar')
    .populate('receiver', 'name avatar');

  await createNotification({
    recipient: receiver,
    sender: req.user._id,
    type: 'message',
    title: 'New Message',
    message: `${req.user.name}: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`,
    link: `/chat/${req.user._id}`,
    metadata: { messageId: message._id },
  });

  res.status(201).json({ success: true, message: populated });
});
