import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { jwtSecret } from './config.js';
import User from './models/user.model.js';
import Conversation from './models/conversation.model.js';

let io;

export function initSocket(server) {
  io = new Server(server, { cors: { origin: '*' } });

  // Authentication middleware: expects token in socket.handshake.auth.token
  io.use(async (socket, next) => {
    const token = socket.handshake.auth && socket.handshake.auth.token;
    if (!token) return next(new Error('auth error'));
    try {
      const payload = jwt.verify(token, jwtSecret);
      // Tìm user theo user_id (string) và username (nếu cần)
      const user = await User.findOne({ user_id: payload.userId });
      if (!user) return next(new Error('auth error'));
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('auth error'));
    }
  });

  // Khi người dùng login
  io.on('connection', (socket) => {
    const user = socket.user;
    console.log('socket connected', user?.username ?? user?.user_id);
    try {
      user.status = 'online';
      user.last_online = new Date();
      user.save().catch(console.error);
    } catch (e) { console.error('presence save error', e); }
    io.emit('presence', { userId: user.user_id, status: 'online' });

    // tham gia group chat
    socket.on('join-room', async (payload, ack) => {
      const { roomId } = payload || {};
      if (!roomId) return ack && ack({ error: 'roomId required' });
      try {
        const conv = await Conversation.findById(roomId).select('participants');
        if (!conv) return ack && ack({ error: 'Conversation not found' });

        // Verify connected user is a participant in this conversation
        const isParticipant = Array.isArray(conv.participants) && conv.participants.some(p => String(p.user_id) === String(user.user_id));
        if (!isParticipant) {
          return ack && ack({ error: 'You are not a participant of this room' });
        }

        // Join socket.io room
        socket.join(roomId);
        // Notify the room that a user joined (other participants will receive it)
        socket.to(roomId).emit('user-joined', { roomId, user: { user_id: user.user_id, username: user.username } });
        // Acknowledge to the joining client
        return ack && ack({ ok: true, roomId });
      } catch (err) {
        console.error('join-room error', err);
        return ack && ack({ error: err.message });
      }
    });

    /**
     * leave-room
     * payload: { roomId }
     */
    socket.on('leave-room', (payload, ack) => {
      const { roomId } = payload || {};
      if (!roomId) return ack && ack({ error: 'roomId required' });
      socket.leave(roomId);
      socket.to(roomId).emit('user-left', { roomId, user: { user_id: user.user_id, username: user.username } });
      return ack && ack({ ok: true });
    });

    /**
     * send_message
     * payload: { roomId }
     * Server persists message and emits it to the room
     */
    socket.on('send_message', async (payload, ack) => {
      try {
        const { roomId } = payload || {};
        if (!roomId) return ack && ack({ error: 'roomId required' });

        const conv = await Conversation.findById(roomId).select('participants');
        if (!conv) return ack && ack({ error: 'Conversation not found' });

        // Ensure sender is participant
        const isParticipant = Array.isArray(conv.participants) && conv.participants.some(p => String(p.user_id) === String(user.user_id));
        if (!isParticipant) return ack && ack({ error: 'You are not a participant of this room' });

        // Broadcast the new message to everyone in the room
        io.to(roomId).emit('message', msg);
        return ack && ack({ ok: true, message: msg });
      } catch (err) {
        console.error('send_message error', err);
        return ack && ack({ error: err.message });
      }
    });

    // Handle disconnect: mark offline and notify
    socket.on('disconnect', (reason) => {
      try {
        user.status = 'offline';
        user.last_online = new Date();
        user.save().catch(console.error);
      } catch (e) { console.error('disconnect save error', e); }
      io.emit('presence', { userId: user.username, status: 'offline' });
      console.log('socket disconnected', user?.username ?? user?.user_id, 'reason:', reason);
    });
  });
}