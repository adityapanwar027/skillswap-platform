import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Message, { getConversationId } from '../models/Message.js';
import { createNotification } from '../models/Notification.js';

const onlineUsers = new Map();

export const initSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
      if (!token) return next(new Error('Authentication required'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return next(new Error('User not found'));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.user._id.toString();
    onlineUsers.set(userId, socket.id);

    await User.findByIdAndUpdate(userId, { isOnline: true, lastSeen: new Date() });
    io.emit('user:online', { userId, isOnline: true });

    socket.join(`user:${userId}`);

    socket.on('message:send', async ({ receiverId, content }) => {
      try {
        const conversationId = getConversationId(socket.user._id, receiverId);
        const message = await Message.create({
          conversationId,
          sender: socket.user._id,
          receiver: receiverId,
          content,
        });

        const populated = await Message.findById(message._id)
          .populate('sender', 'name avatar')
          .populate('receiver', 'name avatar');

        io.to(`user:${receiverId}`).emit('message:receive', populated);
        socket.emit('message:sent', populated);

        await createNotification({
          recipient: receiverId,
          sender: socket.user._id,
          type: 'message',
          title: 'New Message',
          message: `${socket.user.name}: ${content.substring(0, 50)}`,
          link: `/chat/${userId}`,
        });

        io.to(`user:${receiverId}`).emit('notification:new', {
          type: 'message',
          title: 'New Message',
          message: `${socket.user.name} sent you a message`,
        });
      } catch (err) {
        socket.emit('message:error', { message: err.message });
      }
    });

    socket.on('typing:start', ({ receiverId }) => {
      io.to(`user:${receiverId}`).emit('typing:start', { userId });
    });

    socket.on('typing:stop', ({ receiverId }) => {
      io.to(`user:${receiverId}`).emit('typing:stop', { userId });
    });

    socket.on('messages:read', async ({ senderId }) => {
      const conversationId = getConversationId(socket.user._id, senderId);
      await Message.updateMany(
        { conversationId, receiver: socket.user._id, isRead: false },
        { isRead: true, readAt: new Date() }
      );
      io.to(`user:${senderId}`).emit('messages:read', { userId });
    });

    socket.on('disconnect', async () => {
      onlineUsers.delete(userId);
      await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: new Date() });
      io.emit('user:offline', { userId, isOnline: false, lastSeen: new Date() });
    });
  });
};

export const isUserOnline = (userId) => onlineUsers.has(userId.toString());
