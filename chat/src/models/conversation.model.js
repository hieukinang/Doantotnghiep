import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema({
  participants: [{
    user_id: { type: String, required: true },
    role: { type: String, enum: ['ADMIN', 'CLIENT', 'STORE', 'SHIPPER'], required: true }
  }],
  last_message: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }
}, { timestamps: true });

// Compound index for finding conversations by participant user_id
ConversationSchema.index({ 'participants.user_id': 1 });

export default mongoose.model('Conversation', ConversationSchema);
