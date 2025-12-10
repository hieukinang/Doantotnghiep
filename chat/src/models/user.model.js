import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  user_id: {
    type: String, required: true, unique: true, index: true
  },
  username: {
    type: String, required: true
  },
  status: {
    type: String, enum: ['online', 'offline'], default: 'offline', index: true
  },
  role: {
    type: String, enum: ['CLIENT', 'ADMIN', 'STORE', 'SHIPPER'], default: 'CLIENT', index: true
  },
  last_online: { type: Date }
}, {
  timestamps: true
});

UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

export default mongoose.model('User', UserSchema);