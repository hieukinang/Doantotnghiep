import express from 'express';
import auth from '../middleware/auth.js';
import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';
import APIError from '../utils/apiError.js';
import parseCompositeUserId from '../utils/parseRole.js';
import User from '../models/user.model.js';
import { getIO, joinUserToRoom, emitToUser } from '../socket.js';
import upload from '../utils/multer.js'; // Nếu có middleware upload dùng multer, hãy import từ file đúng
import { uploadImage } from '../utils/cloudinary.js'; // Hàm upload ảnh lên Cloudinary

const router = express.Router();

/* ============================================================
   CREATE DIRECT CHAT (OR REUSE) + OPTIONAL FIRST MESSAGE
============================================================ */
// Thêm middleware upload.array cho phép gửi tối đa 5 ảnh
router.post('/direct', auth, upload.array('attachments', 5), async (req, res, next) => {
  let { userId } = req.query;
  const { message } = req.body; // Tin nhắn đầu tiên (optional)

  if (!userId) return next(new APIError("userId not found", 404));

  // Parse userId composite → { user_id, role }
  const p2 = parseCompositeUserId(userId);
  if (!p2) return next(new APIError("Invalid userId format", 400));

  const participant1 = {
    user_id: String(req.user.user_id),
    role: String(req.user.role)
  };

  const participant2 = {
    user_id: String(userId),
    role: String(p2.role)
  };

  try {
    // find existing direct conversation between 2 users
    let existing = await Conversation.findOne({
      participants: {
        $all: [
          { $elemMatch: participant1 },
          { $elemMatch: participant2 }
        ]
      }
    });

    let conv;
    let isNew = false;

    if (existing) {
      conv = existing;
    } else {
      conv = await Conversation.create({
        participants: [participant1, participant2]
      });
      isNew = true;
    }

    const roomId = conv._id.toString();

    // Nếu là conversation mới, auto-join cả 2 users
    if (isNew) {
      joinUserToRoom(participant1.user_id, roomId);
      joinUserToRoom(participant2.user_id, roomId);
    }

    // Lấy thông tin user để gửi kèm
    const [user1Info, user2Info] = await Promise.all([
      User.findOne({ user_id: participant1.user_id }).select('user_id username status'),
      User.findOne({ user_id: participant2.user_id }).select('user_id username status')
    ]);

    const convWithUsers = {
      ...conv.toObject(),
      participants: [
        { ...participant1, username: user1Info?.username, status: user1Info?.status },
        { ...participant2, username: user2Info?.username, status: user2Info?.status }
      ]
    };

    // Xử lý attachments nếu có
    let attachmentUrls = [];
    if (req.files?.length) {
      // Kiểm tra định dạng file
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      for (const file of req.files) {
        if (!allowedTypes.includes(file.mimetype)) {
          return next(new APIError(`File ${file.originalname} không đúng định dạng ảnh (.jpg, .jpeg, .png)`, 400));
        }
      }
      // Upload song song lên Cloudinary
      attachmentUrls = await Promise.all(
        req.files.map(async file => {
          try {
            const result = await uploadImage(file.buffer, 'images', file.mimetype);
            if (!result?.secure_url) throw new Error('No secure_url returned');
            return result.secure_url;
          } catch (err) {
            console.error('Upload error:', err);
            throw new Error(`Failed to upload file: ${file.originalname}`);
          }
        })
      );
    }

    // Nếu có message hoặc attachments, tạo tin nhắn đầu tiên
    let firstMessage = null;
    if ((message && message.trim()) || attachmentUrls.length) {
      firstMessage = await Message.create({
        conversation_id: conv._id,
        sender: {
          user_id: req.user.user_id,
          username: req.user.username,
          role: req.user.role
        },
        content: message ? message.trim() : '',
        attachments: attachmentUrls
      });

      // Cập nhật last_message của conversation
      conv.last_message = firstMessage._id;
      await conv.save();
      convWithUsers.last_message = firstMessage;

      // Emit new_message cho room
      try {
        const io = getIO();
        io.to(roomId).emit('new_message', firstMessage);
      } catch (e) {
        console.error('Socket emit error:', e);
      }
    }

    // Thông báo cho User B về conversation mới (chỉ khi tạo mới)
    if (isNew) {
      emitToUser(participant2.user_id, 'new_conversation', convWithUsers);
    }

    res.json({
      conversation: convWithUsers,
      message: firstMessage,
      isNew
    });
  } catch (err) {
    next(err);
  }
});

/* ============================================================
   LIST CONVERSATIONS
============================================================ */
router.get('/', auth, async (req, res, next) => {
  try {
    const convs = await Conversation.find({
      participants: { $elemMatch: { user_id: req.user.user_id } }
    })
      .select('_id last_message participants')
      .populate('last_message')
      .sort({ updatedAt: -1 });

    // collect all user_ids for participant info
    const allUserIds = [
      ...new Set(
        convs.flatMap(c => c.participants.map(p => p.user_id))
      )
    ];

    const users = await User.find({ user_id: { $in: allUserIds } })
      .select('user_id username status role');

    const userMap = {};
    users.forEach(u => {
      userMap[u.user_id] = u;
    });

    const result = convs.map(conv => ({
      ...conv.toObject(),
      participants: conv.participants.map(p => ({
        user_id: p.user_id,
        username: userMap[p.user_id]?.username,
        status: userMap[p.user_id]?.status,
        role: p.role
      }))
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
});

/* ============================================================
   LEAVE CONVERSATION
============================================================ */
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const conv = await Conversation.findById(req.params.id);
    if (!conv) return next(new APIError("Not found", 404));

    const user = {
      user_id: req.user.user_id,
      role: req.user.role
    };

    const idx = conv.participants.findIndex(
      p =>
        String(p.user_id) === String(user.user_id) &&
        p.role === user.role
    );

    if (idx === -1) return next(new APIError("Not participant", 403));

    conv.participants.splice(idx, 1);

    // delete conversation if empty
    if (conv.participants.length === 0) {
      await Message.deleteMany({ conversation_id: conv._id });
      await Conversation.findByIdAndDelete(conv._id);
    } else {
      await conv.save();
    }

    // notify room
    try {
      const io = getIO();
      io.to(req.params.id).emit('user-left', {
        roomId: req.params.id,
        user
      });
    } catch (e) {
      console.error("Socket emit error:", e);
    }

    res.json({ status: 'success' });
  } catch (err) {
    next(err);
  }
});

export default router;

