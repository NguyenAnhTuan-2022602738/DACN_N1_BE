const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  image_url: String,
  parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  sort_order: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true },
}, { timestamps: { createdAt: 'created_at' } });

categorySchema.index({ slug: 1 });
module.exports = mongoose.model('Category', categorySchema);
