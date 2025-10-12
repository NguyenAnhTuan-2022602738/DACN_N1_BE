
// const mongoose = require('mongoose');

// const cartItemSchema = new mongoose.Schema({
//   user_id: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'User',
//     default: null
//   },
//   session_id: { 
//     type: String,
//     default: null
//   },
//   product_id: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Product', 
//     required: true 
//   },
//   variant_id: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Variant',
//     default: null
//   },
//   quantity: { 
//     type: Number, 
//     default: 1,
//     min: 0
//   },
  
//   // ✅✅✅ THÊM 2 FIELDS NÀY ✅✅✅
//   selectedSize: { 
//     type: String, 
//     default: null 
//   },
//   selectedColor: { 
//     type: String, 
//     default: null 
//   },
//   // ✅✅✅ KẾT THÚC PHẦN THÊM ✅✅✅
  
//   created_at: { 
//     type: Date, 
//     default: Date.now 
//   },
//   updated_at: { 
//     type: Date, 
//     default: Date.now 
//   }
// });

// // Update timestamp on save
// cartItemSchema.pre('save', function(next) {
//   this.updated_at = Date.now();
//   next();
// });

// // ✅ Index để query nhanh (optional nhưng recommended)
// cartItemSchema.index({ user_id: 1, product_id: 1, selectedSize: 1, selectedColor: 1 });
// cartItemSchema.index({ session_id: 1, product_id: 1, selectedSize: 1, selectedColor: 1 });

// module.exports = mongoose.model('CartItem', cartItemSchema);



const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    default: null
  },
  session_id: { 
    type: String,
    default: null
  },
  product_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  variant_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Variant',
    default: null
  },
  quantity: { 
    type: Number, 
    default: 1,
    min: 0
  },
  
  // ✅ FIELDS CHO SIZE/COLOR
  selectedSize: { 
    type: String, 
    default: null 
  },
  selectedColor: { 
    type: String, 
    default: null 
  },
  
  created_at: { 
    type: Date, 
    default: Date.now 
  },
  updated_at: { 
    type: Date, 
    default: Date.now 
  }
});

// Update timestamp on save
cartItemSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// ❌ XÓA INDEX CŨ (đây là nguyên nhân conflict):
// cartItemSchema.index({ user_id: 1, product_id: 1, variant_id: 1 });

// ✅ CHỈ GIỮ INDEX MỚI (đúng logic merge):
cartItemSchema.index({ user_id: 1, product_id: 1, selectedSize: 1, selectedColor: 1 });
cartItemSchema.index({ session_id: 1, product_id: 1, selectedSize: 1, selectedColor: 1 });

module.exports = mongoose.model('CartItem', cartItemSchema);