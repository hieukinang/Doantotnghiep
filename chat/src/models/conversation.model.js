import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema({
  type: { type: String, enum: ['direct', 'group'], default: 'direct' },
  name: { type: String },
  code: { type: String },
  participants: [{ user_id: { type: String, required: true }, role: { type: String, enum: ['ADMIN', 'CLIENT', 'STORE', 'SHIPPER'], required: true } }],
  requests: [{ user_id: { type: String, required: true }, role: { type: String, enum: ['ADMIN', 'CLIENT', 'STORE', 'SHIPPER'], required: true } }],
  admins: [{ user_id: { type: String, required: true }, role: { type: String, enum: ['ADMIN', 'CLIENT', 'STORE', 'SHIPPER'], required: true } }],
  last_message: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }
}, { timestamps: true });

export default mongoose.model('Conversation', ConversationSchema);
