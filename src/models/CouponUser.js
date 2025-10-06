const mongoose = require('mongoose');

const couponUserSchema = new mongoose.Schema({
  coupon_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true },
  usage_count: { type: Number, default: 0 },
  first_used_at: Date,
  last_used_at: Date
}, { timestamps: true });

couponUserSchema.index({ coupon_id:1, user_id:1 }, { unique: true });

module.exports = mongoose.model('CouponUser', couponUserSchema);
