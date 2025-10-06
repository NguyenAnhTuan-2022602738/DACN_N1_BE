const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId }, // can reuse auth user id if desired
  email: { type: String, required: true, unique: true },
  full_name: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['admin','manager','staff','customer'], default: 'customer' },
  avatar_url: { type: String },
  is_active: { type: Boolean, default: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, _id: true });

userProfileSchema.index({ email: 1 });

module.exports = mongoose.model('UserProfile', userProfileSchema);
