import express from 'express';
import auth from '../middleware/auth.js';
import Conversation from '../models/conversation.model.js';
import APIError from '../utils/apiError.js';
import parseCompositeUserId from '../utils/parseRole.js';
import User from '../models/user.model.js';

const router = express.Router();

// create direct conversation (or reuse existing)
router.post('/direct', auth, async (req, res, next) => {
  let { userId } = req.query;
  if (!userId) return next(new APIError("userId not found", 404));
  console.log(parseCompositeUserId(userId));
  console.log(req.user);

  // Parse userId string to object { user_id, role }
  let participant2;
  if (typeof userId === 'string') {
    participant2 = parseCompositeUserId(userId);
    if (!participant2) return next(new APIError("Invalid userId format", 400));
  } else if (typeof userId === 'object' && userId.user_id && userId.role) {
    participant2 = userId;
  } else {
    return next(new APIError("userId invalid", 400));
  }
  participant2.user_id = userId;

  try {
    const participant1 = { user_id: String(req.user.user_id), role: String(req.user.role) };
    // try find existing conversation between two users
    const existing = await Conversation.findOne({
      type: 'direct',
      $and: [
        { participants: { $elemMatch: participant1 } },
        { participants: { $elemMatch: participant2 } }
      ]
    });
    if (existing) return res.json(existing);
    const conv = await Conversation.create({ type: 'direct', participants: [participant1, participant2] });
    res.json(conv);
  } catch (err) {
    next(err);
  }
});

// create group
router.post('/group', auth, async (req, res, next) => {
  const { name, code } = req.query;
  if (!name) return next(new APIError("name required", 400));
  try {
    const participant = { user_id: req.user.user_id, role: req.user.role };
    const conv = await Conversation.create({ type: 'group', name, code, participants: [participant], admins: [participant] });
    res.json(conv);
  } catch (err) {
    next(err);
  }
});

// request join group
router.post('/:id/request', auth, async (req, res, next) => {
  try {
    const conv = await Conversation.findById(req.params.id);
    if (!conv) return next(new APIError("Not found", 404));
    const participant = { user_id: req.user.user_id, role: req.user.role };
    if (conv.participants.some(p => p.user_id === participant.user_id && p.role === participant.role)) return next(new APIError("Already a member", 400));
    if (conv.requests.some(r => r.user_id === participant.user_id && r.role === participant.role)) return next(new APIError("Already requested", 400));
    conv.requests.push(participant);
    await conv.save();
    // TODO: notify admins via socket
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// admin accept request
router.post('/:id/approve', auth, async (req, res, next) => {
  let { userId } = req.body; // userId should be { user_id, role }
  if (!userId) return next(new APIError("userId with user_id and role required", 400));
  // Nếu userId là chuỗi, parse thành object
  userId = await User.findOne({ user_id: userId });
  try {
    const conv = await Conversation.findById(req.params.id);
    if (!conv) return next(new APIError("Not found", 404));
    const admin = { user_id: req.user.user_id, role: req.user.role };
    if (!conv.admins.some(a => a.user_id === admin.user_id && a.role === admin.role)) {
      return next(new APIError("Not admin", 403));
    }
    // Kiểm tra userId có nằm trong requests không
    console.log(userId);
    if (!conv.requests.some(r => r.user_id === userId.user_id && r.role === userId.role)) {
      return next(new APIError("User is not in requests", 400));
    }
    // remove from requests and add to participants
    conv.requests = conv.requests.filter(r => !(r.user_id === userId.user_id && r.role === userId.role));
    if (!conv.participants.some(p => p.user_id === userId.user_id && p.role === userId.role)) {
      conv.participants.push(userId);
    }
    await conv.save();
    res.status(200).json({
      status: "success",
      data: { doc: conv },
    });
  } catch (err) {
    next(err);
  }
});

// list conversations for user
router.get('/', auth, async (req, res, next) => {
  try {
    const participant = { user_id: req.user.user_id };
    const convs = await Conversation.find({ participants: { $elemMatch: participant } })
      .select('_id type name code last_message') // chỉ lấy các trường này
      .populate('last_message')
      .sort({ updatedAt: -1 });

    res.json(convs);
  } catch (err) {
    next(err);
  }
});

// leave conversation (xóa user khỏi participants)
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const conv = await Conversation.findById(req.params.id);
    if (!conv) return next(new APIError("Not found", 404));

    const user = { user_id: req.user.user_id, role: req.user.role };

    // Check if user is participant
    const index = conv.participants.findIndex(p => p.user_id === user.user_id && p.role === user.role);
    if (index === -1) return next(new APIError("Not participant", 403));

    // Remove user from participants
    conv.participants.splice(index, 1);

    // If group and user was admin, remove from admins too
    if (conv.type === 'group') {
      const adminIndex = conv.admins.findIndex(a => a.user_id === user.user_id && a.role === user.role);
      if (adminIndex !== -1) conv.admins.splice(adminIndex, 1);
    }

    // If no participants left, delete conversation and messages
    if (conv.participants.length === 0) {
      await Message.deleteMany({ conversation_id: req.params.id });
      await Conversation.findByIdAndDelete(req.params.id);
    } else {
      await conv.save();
    }

    // TODO: emit socket 'user-left' to room
    // Ví dụ: io.to(req.params.id).emit('user-left', { userId: user.user_id, role: user.role });

    res.json({ status: 'success' });
  } catch (err) {
    next(err);
  }
});


export default router;
