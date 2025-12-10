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
    return res.status(400).json({ error: 'conversation_id required' });

  try {
    // --- Find conversation ---
    const conv = await Conversation.findById(conversationId);
    if (!conv)
      return res.status(404).json({ error: 'Conversation not found' });

    // --- Only participants can send messages ---
    const isParticipant = conv.participants.some(
      p => String(p.user_id) === String(req.user.user_id)
    );
    if (!isParticipant)
      return res.status(403).json({ error: 'You are not a participant of this conversation' });

    // --- Validate content or files ---
    if (!content && (!req.files || req.files.length === 0))
      return res.status(400).json({ error: 'Message requires text or attachments' });

    // --- Double check max attachments ---
    if (req.files && req.files.length > 5)
      return res.status(400).json({ error: 'Maximum 5 attachments allowed' });

    // --- Upload attachments to cloudinary ---
    let attachmentUrls = [];

    if (req.files?.length) {
      // Upload song song giúp nhanh hơn
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

    // --- Create message ---
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

    // --- Update conversation last message ---
    conv.last_message = msg._id;
    await conv.save();

    // --- Emit socket event ---
    try {
      const io = getIO();
      io.to(conversationId).emit('new_message', msg);
    } catch (e) {
      console.error('Socket emit error:', e);
    }

    res.json(msg);
  } catch (err) {
    console.error('Message send error:', err);
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
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const isParticipant = conv.participants.some(
      p => String(p.user_id) === String(req.user.user_id)
    );
    if (!isParticipant) {
      return res.status(403).json({ error: 'You are not a participant of this conversation' });
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
