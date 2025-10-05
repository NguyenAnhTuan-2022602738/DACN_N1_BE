const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  // optional profile fields
  phone: { type: String },
  dateOfBirth: { type: String },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
  avatar: { type: String },
  role: { type: String, default: 'customer' },
  createdAt: { type: Date, default: Date.now }
  ,
  // addresses book for shipping
  addresses: [
    {
      label: { type: String },
      fullName: { type: String },
      phone: { type: String },
      addressLine1: { type: String },
      addressLine2: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
      default: { type: Boolean, default: false }
    }
  ],
  // account status for admin control
  accountStatus: { type: String, enum: ['active', 'disabled', 'pending'], default: 'active' },
  // password reset fields
  resetPasswordCodeHash: { type: String },
  resetPasswordExpires: { type: Date }
});

module.exports = mongoose.model('User', userSchema);
