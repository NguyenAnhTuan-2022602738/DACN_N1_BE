const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variant_id: { type: mongoose.Schema.Types.ObjectId },
  quantity: { type: Number, required: true },
  unit_price: { type: Number, required: true },
  total_price: { type: Number, required: true },
  product_name: { type: String, required: true },
  product_sku: String,
  variant_name: String,
  product_image_url: String
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('OrderItem', orderItemSchema);
