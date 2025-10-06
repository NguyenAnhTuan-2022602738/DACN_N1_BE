const mongoose = require('mongoose');

const ProductImage = new mongoose.Schema({
  image_url: String,
  alt_text: String,
  sort_order: { type: Number, default: 0 },
  is_primary: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
}, { _id: true });

const ProductVariant = new mongoose.Schema({
  name: String,
  value: String,
  price_adjustment: { type: Number, default: 0 },
  stock_quantity: { type: Number, default: 0 },
  sku: String,
  image_url: String,
  sort_order: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
}, { _id: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  short_description: String,
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  sku: { type: String, unique: true, sparse: true },
  price: { type: Number, required: true },
  original_price: Number,
  cost_price: Number,
  stock_quantity: { type: Number, default: 0 },
  min_stock_level: { type: Number, default: 5 },
  weight: Number,
  dimensions: String,
  status: { type: String, enum: ['active','inactive','out_of_stock'], default: 'active' },
  is_featured: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  review_count: { type: Number, default: 0 },
  tags: { type: [String], default: [] },
  meta_title: String,
  meta_description: String,
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile' },
  images: { type: [ProductImage], default: [] },
  variants: { type: [ProductVariant], default: [] }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

productSchema.index({ slug: 1 });

module.exports = mongoose.model('Product', productSchema);
