import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  user_id: { 
    type: String, required: true, unique: true 
  },
  username: {
    type: String, required: true
  },
  status: { 
    type: String, enum: ['online', 'offline'], default: 'offline' 
  },
  role: { 
    type: String, enum: ['CLIENT', 'ADMIN', 'STORE', 'SHIPPER'], default: 'CLIENT' 
  },
  last_online: { type: Date }
}, { 
  timestamps: true 
});

UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

export default mongoose.model('User', UserSchema);