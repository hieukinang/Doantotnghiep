const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  avatar_url: { type: String },
  status: { type: String, enum: ['online', 'offline'], default: 'offline' },
  role: { type: String, enum: ['CLIENT', 'ADMIN', 'STORE', 'SHIPPER'], default: 'CLIENT' },
  last_online: { type: Date }
}, { timestamps: true });

// Thêm virtual 'id' để tương thích với token
UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', UserSchema);