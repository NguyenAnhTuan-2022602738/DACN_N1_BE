require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const MONGO = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/abc-fashion';

const sampleProducts = [
  {
    sku: 'ASM-001-WH-M',
    name: 'Áo Sơ Mi Nữ Tay Dài Phong Cách Hàn Quốc',
    brand: 'ABC Fashion',
    categories: ['Áo', 'Nữ', 'Sơ mi'],
    description: 'Áo sơ mi nữ tay dài thiết kế theo phong cách Hàn Quốc, cotton cao cấp, thoáng mát.',
    originalPrice: 450000,
    salePrice: 350000,
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop'
    ],
    stock: 25,
    rating: 4.5,
    reviewCount: 128,
    colors: ['Trắng', 'Xanh nhạt', 'Hồng pastel'],
    sizes: ['S','M','L','XL'],
    features: ['Cotton 100%','Form chuẩn','Dễ phối đồ'],
    specifications: { 'Chất liệu': 'Cotton 100%', 'Xuất xứ': 'Việt Nam' },
    careInstructions: ['Giặt máy ở 30°C','Không tẩy']
  },
  {
    sku: 'CV-002-MD',
    name: 'Chân Váy Xòe Midi Thanh Lịch',
    brand: 'Bella',
    categories: ['Chân váy', 'Nữ'],
    description: 'Chân váy xòe midi phong cách thanh lịch, vải chiffon dập ly.',
    salePrice: 280000,
    images: ['https://images.unsplash.com/photo-1583496661160-fb5886a13d27?w=600&h=600&fit=crop'],
    stock: 15,
    rating: 4.3
  },
  {
    sku: 'QAU-003-TR',
    name: 'Quần Âu Nữ Ống Suông',
    brand: 'OfficeWear',
    categories: ['Quần', 'Nữ', 'Công sở'],
    description: 'Quần âu ống suông phù hợp môi trường công sở, chất liệu co giãn nhẹ.',
    salePrice: 320000,
    images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop'],
    stock: 8,
    rating: 4.6
  },
  {
    sku: 'BLZ-004-BK',
    name: 'Blazer Nữ Phong Cách Công Sở',
    brand: 'FormalLine',
    categories: ['Áo khoác', 'Nữ', 'Công sở'],
    description: 'Blazer nữ form chuẩn, chất liệu vải dày dặn, phù hợp đi làm.',
    salePrice: 520000,
    images: ['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop'],
    stock: 12,
    rating: 4.8
  },
  {
    sku: 'GIAY-005-BK',
    name: 'Giày Cao Gót Mũi Nhọn',
    brand: 'HeelCo',
    categories: ['Giày', 'Nữ'],
    description: 'Giày cao gót mũi nhọn chất liệu da tổng hợp cao cấp.',
    salePrice: 350000,
    images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=600&fit=crop'],
    stock: 20,
    rating: 4.4
  }
];

async function seed() {
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to DB for seeding');
  // clear sample SKUs (optional)
  const skus = sampleProducts.map(p => p.sku);
  await Product.deleteMany({ sku: { $in: skus } });
  const inserted = await Product.insertMany(sampleProducts);
  console.log(`Inserted ${inserted.length} products`);
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seeding failed', err);
  process.exit(1);
});
