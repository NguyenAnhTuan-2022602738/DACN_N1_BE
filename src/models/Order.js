const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  order_number: { type: String, unique: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile' },
  guest_email: String,
  status: { type: String, enum: ['pending','confirmed','processing','shipped','delivered','cancelled'], default: 'pending' },
  payment_status: { type: String, enum: ['pending','paid','failed','refunded'], default: 'pending' },
  subtotal: { type: Number, required: true },
  tax_amount: { type: Number, default: 0 },
  shipping_amount: { type: Number, default: 0 },
  discount_amount: { type: Number, default: 0 },
  total_amount: { type: Number, required: true },
  billing_address: { type: Object, required: true },
  shipping_address: { type: Object, required: true },
  notes: String,
  coupon_code: String,
  payment_method: String,
  payment_reference: String,
  shipped_at: Date,
  delivered_at: Date
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Order', orderSchema);
