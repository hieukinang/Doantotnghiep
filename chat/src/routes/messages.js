import express from 'express';
import multer from 'multer';
import auth from '../middleware/auth.js';
import Message from '../models/message.model.js';
import Conversation from '../models/conversation.model.js';
import { uploadImage } from '../utils/cloudinary.js';
import { getIO } from '../socket.js';

const router = express.Router();
const upload = multer(); // sử dụng RAM, không lưu ra disk

// =============================
// SEND MESSAGE (multipart/form-data)
// =============================
router.post('/:conversationId', auth, upload.array('attachments', 5), async (req, res) => {
  const { content } = req.body;
  const { conversationId } = req.params;

  if (!conversationId)
    return res.status(400).json({ error: 'conversation_id bắt buộc' });

  try {
    // --- Tìm kiếm cuộc trò chuyện ---
    const conv = await Conversation.findById(conversationId);
    if (!conv)
      return res.status(404).json({ error: 'Không tìm thấy cuộc trò chuyện' });

    // --- Chỉ những người tham gia mới có thể gửi tin nhắn ---
    const isParticipant = conv.participants.some(
      p => String(p.user_id) === String(req.user.user_id)
    );
    if (!isParticipant)
      return res.status(403).json({ error: 'Bạn không phải là thành viên của cuộc trò chuyện này' });

    // --- Kiểm tra nội dung hoặc tệp đính kèm ---
    if (!content && (!req.files || req.files.length === 0))
      return res.status(400).json({ error: 'Tin nhắn yêu cầu có nội dung hoặc tệp đính kèm' });

    // --- Kiểm tra số lượng tệp đính kèm tối đa ---
    if (req.files && req.files.length > 5)
      return res.status(400).json({ error: 'Tối đa 5 tệp đính kèm được phép' });

    // --- Upload ---
    let attachmentUrls = [];

    if (req.files?.length) {
      // Upload song song giúp nhanh hơn
      attachmentUrls = await Promise.all(
        req.files.map(async file => {
          try {
            const result = await uploadImage(file.buffer, 'images', file.mimetype);
            if (!result?.secure_url) throw new Error('Không có secure_url trả về');
            return result.secure_url;
          } catch (err) {
            console.error('Lỗi upload:', err);
            throw new Error(`Không thể upload file: ${file.originalname}`);
          }
        })
      );
    }

    // --- Tạo tin nhắn ---
    const msg = await Message.create({
      conversation_id: conversationId,
      sender: {
        user_id: req.user.user_id,
        username: req.user.username,
        role: req.user.role
      },
      content: content || '',
      attachments: attachmentUrls
    });

    // --- Cập nhật tin nhắn cuối cùng của cuộc trò chuyện ---
    conv.last_message = msg._id;
    await conv.save();

    // --- Phát sự kiện socket ---
    try {
      const io = getIO();
      io.to(conversationId).emit('new_message', msg);
    } catch (e) {
      console.error('Lỗi phát sự kiện socket:', e);
    }

    res.json(msg);
  } catch (err) {
    console.error('Lỗi gửi tin nhắn:', err);
    res.status(500).json({ error: err.message });
  }
});

// =============================
// GET MESSAGES IN CONVERSATION
// =============================
router.get('/:conversationId', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;

    // Kiểm tra quyền truy cập
    const conv = await Conversation.findById(conversationId).select('participants');
    if (!conv) {
      return res.status(404).json({ error: 'Không tìm thấy cuộc trò chuyện' });
    }

    const isParticipant = conv.participants.some(
      p => String(p.user_id) === String(req.user.user_id)
    );
    if (!isParticipant) {
      return res.status(403).json({ error: 'Bạn không phải là thành viên của cuộc trò chuyện này' });
    }

    // Optional: paginate
    const limit = Number(req.query.limit) || 100;
    const skip = Number(req.query.skip) || 0;

    const messages = await Message
      .find({ conversation_id: conversationId })
      .sort({ sent_at: 1 })
      .skip(skip)
      .limit(limit);

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
