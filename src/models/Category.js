const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  image_url: { type: String, default: '' },
  is_active: { type: Boolean, default: true },
  is_featured: { type: Boolean, default: false },
  sort_order: { type: Number, default: 0 },
  meta_title: { type: String, default: '' },
  meta_description: { type: String, default: '' }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

categorySchema.index({ slug: 1 });
categorySchema.index({ parent_id: 1 });
categorySchema.index({ sort_order: 1 });

module.exports = mongoose.model('Category', categorySchema);
