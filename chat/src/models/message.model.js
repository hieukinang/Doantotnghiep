const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  conversation_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String },
  attachments: [{ type: String }],
  reactions: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, reaction: String }],
  seen_by: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  sent_at: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
