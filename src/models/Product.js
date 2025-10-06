const mongoose = require('mongoose');

const VariantSchema = new mongoose.Schema({
  sku: { type: String },
  attributes: { type: mongoose.Schema.Types.Mixed }, // e.g. { color: 'Trắng', size: 'M' }
  price: { type: Number },
  originalPrice: { type: Number },
  stock: { type: Number, default: 0 },
  images: { type: [String], default: [] }
}, { _id: false });

const PromotionSchema = new mongoose.Schema({
  title: String,
  type: { type: String }, // 'percentage' | 'fixed' | 'coupon'
  value: Number,
  startsAt: Date,
  endsAt: Date
}, { _id: false });

const DimensionsSchema = new mongoose.Schema({
  length: Number,
  width: Number,
  height: Number
}, { _id: false });

const productSchema = new mongoose.Schema({
  sku: { type: String, index: true },
  name: { type: String, required: true, trim: true },
  slug: { type: String, index: true },
  brand: { type: String },
  categories: { type: [String], default: [] },
  collections: { type: [String], default: [] },
  description: { type: String },

  // Pricing
  originalPrice: { type: Number },
  salePrice: { type: Number, required: true },
  price: { type: Number }, // deprecated alias
  discount: { type: Number, default: 0 },
  promotions: { type: [PromotionSchema], default: [] },

  // Variants & inventory
  variants: { type: [VariantSchema], default: [] },
  colors: { type: [String], default: [] },
  sizes: { type: [String], default: [] },
  stock: { type: Number, default: 0 },
  availability: { type: String, enum: ['in_stock', 'out_of_stock', 'preorder'], default: 'in_stock' },

  // Media
  images: { type: [String], default: [] },
  videoUrl: { type: String },

  // Descriptive
  features: { type: [String], default: [] },
  specifications: { type: mongoose.Schema.Types.Mixed },
  careInstructions: { type: [String], default: [] },

  // Social / reviews
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },

  // Marketing / SEO
  tags: { type: [String], default: [] },
  featured: { type: Boolean, default: false },
  relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },

  // Logistics
  weight: { type: Number }, // in kg
  dimensions: { type: DimensionsSchema },
  shippingClass: { type: String },
  shippingCost: { type: Number },
  returnPolicy: { type: String },

  // Admin / audit
  status: { type: String, enum: ['published', 'draft', 'archived'], default: 'published' },
  visibility: { type: String, enum: ['public', 'private'], default: 'public' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  vendor: { type: String },

}, { timestamps: true });

// Ensure `price` field remains in sync as a convenience alias
productSchema.pre('save', function (next) {
  if (!this.price) this.price = this.salePrice || this.originalPrice;
  // compute simple discount percent if possible
  if (this.originalPrice && this.salePrice) {
    this.discount = Math.round(((this.originalPrice - this.salePrice) / this.originalPrice) * 100);
  }
  next();
});

productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.models?.Product || mongoose.model('Product', productSchema);
