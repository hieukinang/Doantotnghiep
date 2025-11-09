import express from 'express';
import multer from 'multer';
import auth from '../middleware/auth.js';
import Message from '../models/message.model.js';
import Conversation from '../models/conversation.model.js';
import { uploadImage } from '../utils/cloudinary.js';

const router = express.Router();
const upload = multer(); // dùng bộ nhớ tạm, không lưu file ra ổ cứng

// send message (multipart/form-data)
router.post('/:conversationId', auth, upload.array('attachments', 5), async (req, res) => {
  const { content } = req.body;
  const { conversationId } = req.params;
  // attachments sẽ nằm ở req.files
  if (!conversationId) return res.status(400).json({ error: 'conversation_id required' });
  try {
    const conv = await Conversation.findById(conversationId);
    if (!conv) return res.status(404).json({ error: 'Conversation not found' });

    // Enforce maximum attachments (multer already limits, but double-check)
    if (req.files && req.files.length > 5) {
      return res.status(400).json({ error: 'Maximum 5 attachments allowed' });
    }

    // Upload attachments to cloudinary if provided (max 5 images)
    const attachmentUrls = [];
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        try {
          // file.buffer là Buffer của file; pass mimetype so cloudinary can detect type
          const result = await uploadImage(file.buffer, 'images', file.mimetype);
          if (result && result.secure_url) attachmentUrls.push(result.secure_url);
          else throw new Error('Cloudinary did not return a secure_url');
        } catch (uploadErr) {
          console.error('Upload error:', uploadErr);
          return res.status(500).json({ error: 'Failed to upload attachments', detail: uploadErr.message });
        }
      }
    }

    const sender = { user_id: req.user.user_id, role: req.user.role };
    const msg = await Message.create({
      conversation_id: conversationId,
      sender_id: sender,
      content,
      attachments: attachmentUrls
    });
    conv.last_message = msg._id;
    await conv.save();
    res.json(msg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// get messages for conversation
router.get('/:conversationId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ conversation_id: req.params.conversationId }).sort({ sent_at: 1 }).limit(100);
    res.json(messages);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
