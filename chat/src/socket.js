const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('./config');
const User = require('./models/user.model');
const Message = require('./models/message.model');
const Conversation = require('./models/conversation.model');

let io;

function initSocket(server) {
  io = new Server(server, { cors: { origin: '*' } });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth && socket.handshake.auth.token;
    if (!token) return next(new Error('auth error'));
    try {
      const payload = jwt.verify(token, jwtSecret);
      const user = await User.findById(payload.id);
      if (!user) return next(new Error('auth error'));
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('auth error'));
    }
  });

  io.on('connection', (socket) => {
    const user = socket.user;
    console.log('socket connected', user.username);
    // join a room per user to target messages
    socket.join(`user:${user._id}`);
    user.status = 'online';
    user.last_seen = new Date();
    user.save().catch(console.error);
    io.emit('presence', { userId: user._id, status: 'online' });

    socket.on('send_message', async (payload) => {
      try {
        const { conversation_id, content, attachments } = payload;
        const msg = await Message.create({ conversation_id, sender_id: user._id, content, attachments });
        await Conversation.findByIdAndUpdate(conversation_id, { last_message: msg._id });
        // emit to conversation participants
        const conv = await Conversation.findById(conversation_id).populate('participants');
        conv.participants.forEach(p => io.to(`user:${p._id}`).emit('message', msg));
      } catch (err) { console.error(err); }
    });

    socket.on('disconnect', () => {
      user.status = 'offline';
      user.last_seen = new Date();
      user.save().catch(console.error);
      io.emit('presence', { userId: user._id, status: 'offline' });
    });
  });
}

module.exports = { initSocket };
