import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  conversation_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
  sender: {
    user_id: { type: String, required: true },
    username: { type: String },
    role: { type: String, enum: ['ADMIN', 'CLIENT', 'STORE', 'SHIPPER'], required: true }
  },
  content: { type: String },
  attachments: [{ type: String }], // URLs of images uploaded to cloudinary
  reactions: [{
    user: {
      user_id: { type: String, required: true },
      role: { type: String, enum: ['ADMIN', 'CLIENT', 'STORE', 'SHIPPER'], required: true }
    },
    reaction: String
  }],
  read_by: [{
    user_id: { type: String, required: true },
    role: { type: String, enum: ['ADMIN', 'CLIENT', 'STORE', 'SHIPPER'], required: true },
    read_at: { type: Date, default: Date.now }
  }],
  sent_at: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Message', MessageSchema);
