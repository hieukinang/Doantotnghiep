const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  type: { type: String, enum: ['direct', 'group'], default: 'direct' },
  name: { type: String },
  code: { type: String },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  last_message: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }
}, { timestamps: true });

module.exports = mongoose.model('Conversation', ConversationSchema);
