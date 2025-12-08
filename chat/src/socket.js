// socket.js - Optimized for 1-1 chat
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { jwtSecret } from './config.js';
import User from './models/user.model.js';
import Conversation from './models/conversation.model.js';

let io;

// Map để track user socket (1 user có thể có nhiều socket từ nhiều device)
const userSockets = new Map(); // user_id -> Set of socket ids

export function initSocket(server) {
  io = new Server(server, { cors: { origin: '*' } });

  // --- AUTH MIDDLEWARE ---
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('auth error'));
    try {
      const payload = jwt.verify(token, jwtSecret);
      const user = await User.findOne({ user_id: payload.userId });
      if (!user) return next(new Error('auth error'));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error('auth error'));
    }
  });

  // --- CONNECTION EVENT ---
  io.on('connection', async (socket) => {
    const user = socket.user;
    const userId = user.user_id;

    console.log('socket connected', user?.username ?? userId);

    // Track socket
    if (!userSockets.has(userId)) {
      userSockets.set(userId, new Set());
    }
    userSockets.get(userId).add(socket.id);

    // Cập nhật trạng thái online
    user.status = 'online';
    user.last_online = new Date();
    await user.save().catch(console.error);

    // Broadcast presence
    io.emit('presence', { userId, status: 'online' });

    // Auto-join tất cả conversations của user
    try {
      const conversations = await Conversation.find({
        'participants.user_id': userId
      }).select('_id');

      conversations.forEach(conv => {
        socket.join(conv._id.toString());
      });

      console.log(`User ${userId} joined ${conversations.length} rooms`);
    } catch (err) {
      console.error('Auto-join rooms error:', err);
    }

    // --- JOIN ROOM (thủ công khi tạo conversation mới) ---
    socket.on('join-room', async ({ roomId }, ack) => {
      if (!roomId) return ack?.({ error: 'roomId required' });

      try {
        const conv = await Conversation.findById(roomId).select('participants');
        if (!conv) return ack?.({ error: 'Conversation not found' });

        const isParticipant = conv.participants?.some(
          p => String(p.user_id) === String(userId)
        );

        if (!isParticipant) {
          return ack?.({ error: 'You are not a participant' });
        }

        socket.join(roomId);
        return ack?.({ ok: true, roomId });
      } catch (err) {
        console.error('join-room error', err);
        return ack?.({ error: err.message });
      }
    });

    // --- LEAVE ROOM ---
    socket.on('leave-room', ({ roomId }, ack) => {
      if (!roomId) return ack?.({ error: 'roomId required' });
      socket.leave(roomId);
      return ack?.({ ok: true });
    });

    // --- TYPING INDICATOR ---
    socket.on('typing', ({ roomId, isTyping }) => {
      if (!roomId) return;
      socket.to(roomId).emit('typing', {
        roomId,
        userId,
        username: user.username,
        isTyping
      });
    });

    // --- MESSAGE READ ---
    socket.on('read', ({ roomId, messageId }) => {
      if (!roomId) return;
      socket.to(roomId).emit('read', {
        roomId,
        messageId,
        userId,
        readAt: new Date()
      });
    });

    // --- DISCONNECT ---
    socket.on('disconnect', async () => {
      // Xóa socket khỏi tracking
      userSockets.get(userId)?.delete(socket.id);

      // Chỉ đánh offline nếu không còn socket nào
      if (!userSockets.get(userId)?.size) {
        userSockets.delete(userId);

        user.status = 'offline';
        user.last_online = new Date();
        await user.save().catch(console.error);

        io.emit('presence', { userId, status: 'offline' });
      }

      console.log('socket disconnected', user?.username ?? userId);
    });
  });
}

export function getIO() {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
}

// Helper: emit tới tất cả sockets của 1 user
export function emitToUser(userId, event, data) {
  const sockets = userSockets.get(userId);
  if (sockets) {
    sockets.forEach(socketId => {
      io.to(socketId).emit(event, data);
    });
  }
}

// Helper: join tất cả sockets của 1 user vào room
export function joinUserToRoom(userId, roomId) {
  const sockets = userSockets.get(userId);
  if (sockets && io) {
    sockets.forEach(socketId => {
      const socket = io.sockets.sockets.get(socketId);
      if (socket) {
        socket.join(roomId);
      }
    });
    return true;
  }
  return false;
}


