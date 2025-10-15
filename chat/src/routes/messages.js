const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/message.model');
const Conversation = require('../models/conversation.model');

// send message
router.post('/', auth, async (req, res) => {
  const { conversation_id, content, attachments } = req.body;
  if (!conversation_id) return res.status(400).json({ error: 'conversation_id required' });
  try {
    const conv = await Conversation.findById(conversation_id);
    if (!conv) return res.status(404).json({ error: 'Conversation not found' });
    const msg = await Message.create({ conversation_id, sender_id: req.user._id, content, attachments });
    conv.last_message = msg._id;
    await conv.save();
    // TODO: emit via socket
    res.json(msg);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// get messages for conversation
router.get('/:conversationId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ conversation_id: req.params.conversationId }).sort({ sent_at: 1 }).limit(100);
    res.json(messages);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
