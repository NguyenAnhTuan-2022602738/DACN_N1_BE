const mongoose = require('mongoose');

const customerAddressSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true },
  type: { type: String, enum: ['billing','shipping','both'], required: true },
  full_name: { type: String, required: true },
  company: String,
  address_line_1: { type: String, required: true },
  address_line_2: String,
  city: { type: String, required: true },
  state_province: { type: String, required: true },
  postal_code: { type: String, required: true },
  country: { type: String, default: 'Vietnam' },
  phone: String,
  is_default: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('CustomerAddress', customerAddressSchema);
