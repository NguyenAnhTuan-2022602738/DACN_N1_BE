const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  snapshot: {
    name: String,
    brand: String,
    image: String,
    price: Number,
    originalPrice: Number,
    category: String
  }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

wishlistSchema.index({ user_id: 1, product_id: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
