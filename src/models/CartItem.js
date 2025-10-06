const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile' },
  session_id: String,
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variant_id: { type: mongoose.Schema.Types.ObjectId },
  quantity: { type: Number, required: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// Indexes for fast lookups and to prevent duplicates
cartItemSchema.index({ user_id: 1 });
cartItemSchema.index({ session_id: 1 });
cartItemSchema.index({ product_id: 1 });
cartItemSchema.index({ user_id: 1, product_id: 1, variant_id: 1 }, { unique: true, partialFilterExpression: { user_id: { $exists: true } } });
cartItemSchema.index({ session_id: 1, product_id: 1, variant_id: 1 }, { unique: true, partialFilterExpression: { session_id: { $exists: true } } });

module.exports = mongoose.model('CartItem', cartItemSchema);
