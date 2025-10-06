const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  name: String,
  description: String,
  type: { type: String, enum: ['percentage','fixed_amount'] },
  value: { type: Number },
  minimum_order_amount: { type: Number, default: 0 },
  maximum_discount_amount: { type: Number },
  usage_limit: Number,
  usage_count: { type: Number, default: 0 },
  user_limit: { type: Number, default: 1 },
  is_active: { type: Boolean, default: true },
  starts_at: Date,
  expires_at: Date,
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile' }
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('Coupon', couponSchema);
