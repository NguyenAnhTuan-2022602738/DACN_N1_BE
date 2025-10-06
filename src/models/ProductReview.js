const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true },
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: String,
  content: String,
  images: { type: [String], default: [] },
  is_verified_purchase: { type: Boolean, default: false },
  is_approved: { type: Boolean, default: false },
  helpful_count: { type: Number, default: 0 }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

reviewSchema.index({ product_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model('ProductReview', reviewSchema);
