/**
 * Basic seeding script for development.
 * Run from project/server: node src/scripts/seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

const Product = require('../models/ProductMongo');
const Category = require('../models/Category');
const User = require('../models/User');
const CartItem = require('../models/CartItem');

const MONGO = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/abc-fashion';

async function main() {
  console.log('Connecting to', MONGO);
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });

  // Create categories
  const cats = [
    { name: 'Woman', slug: 'women', description: 'Women clothing and accessories', is_active: true },
    { name: 'Man', slug: 'men', description: 'Men clothing and accessories', is_active: true },
    { name: 'Kids', slug: 'kids', description: 'Kids clothing and accessories', is_active: true },
    { name: 'Accessories', slug: 'accessories', description: 'Fashion accessories like bags, jewelry', is_active: true },
    { name: 'Shoes', slug: 'shoes', description: 'Footwear for all ages', is_active: true }
  ];
  const createdCats = [];
  for (const c of cats) {
    const up = await Category.findOneAndUpdate({ slug: c.slug }, { $set: c }, { upsert: true, new: true });
    createdCats.push(up);
  }

  // Create products
  const sampleProducts = [
    {
      name: 'Áo sơ mi trắng basic',
      slug: 'ao-so-mi-trang-basic',
      description: 'Áo sơ mi trắng phong cách tối giản, chất liệu cotton cao cấp, dễ chịu khi mặc',
      short_description: 'Áo sơ mi trắng comfortable',
      category_id: createdCats[0]._id,
      price: 299000,
      original_price: 399000,
      stock_quantity: 50,
      status: 'active',
      images: [ { image_url: 'https://placehold.co/600x600?text=shirt1' }, { image_url: 'https://placehold.co/600x600?text=shirt1-back' } ],
      variants: [
        { name: 'Size', value: 'S', stock_quantity: 10 },
        { name: 'Size', value: 'M', stock_quantity: 15 },
        { name: 'Size', value: 'L', stock_quantity: 15 },
        { name: 'Size', value: 'XL', stock_quantity: 10 }
      ]
    },
    {
      name: 'Quần jean xanh',
      slug: 'quan-jean-xanh',
      description: 'Quần jean nam form regular, chất liệu denim bền bỉ, phù hợp đi chơi và công sở',
      short_description: 'Jeans comfortable',
      category_id: createdCats[1]._id,
      price: 499000,
      original_price: 599000,
      stock_quantity: 30,
      status: 'active',
      images: [ { image_url: 'https://placehold.co/600x600?text=jeans' } ],
      variants: [
        { name: 'Size', value: '28', stock_quantity: 5 },
        { name: 'Size', value: '30', stock_quantity: 10 },
        { name: 'Size', value: '32', stock_quantity: 10 },
        { name: 'Size', value: '34', stock_quantity: 5 }
      ]
    },
    {
      name: 'Váy hoa nữ',
      slug: 'vay-hoa-nu',
      description: 'Váy hoa nữ kiểu dáng A-line, chất liệu voan nhẹ nhàng, phù hợp dạo phố',
      short_description: 'Váy hoa nữ đẹp',
      category_id: createdCats[0]._id,
      price: 350000,
      original_price: 450000,
      stock_quantity: 20,
      status: 'active',
      images: [ { image_url: 'https://placehold.co/600x600?text=dress' } ],
      variants: [
        { name: 'Size', value: 'S', stock_quantity: 5 },
        { name: 'Size', value: 'M', stock_quantity: 8 },
        { name: 'Size', value: 'L', stock_quantity: 7 }
      ]
    },
    {
      name: 'Áo khoác nam',
      slug: 'ao-khoac-nam',
      description: 'Áo khoác nam kiểu dáng slim fit, chất liệu len ấm áp, chống gió',
      short_description: 'Áo khoác nam thời trang',
      category_id: createdCats[1]._id,
      price: 650000,
      original_price: 750000,
      stock_quantity: 15,
      status: 'active',
      images: [ { image_url: 'https://placehold.co/600x600?text=jacket' } ],
      variants: [
        { name: 'Size', value: 'M', stock_quantity: 4 },
        { name: 'Size', value: 'L', stock_quantity: 6 },
        { name: 'Size', value: 'XL', stock_quantity: 5 }
      ]
    },
    {
      name: 'Quần short trẻ em',
      slug: 'quan-short-tre-em',
      description: 'Quần short trẻ em chất liệu cotton thoáng mát, dễ chịu cho bé chơi đùa',
      short_description: 'Quần short trẻ em',
      category_id: createdCats[2]._id,
      price: 150000,
      original_price: 200000,
      stock_quantity: 40,
      status: 'active',
      images: [ { image_url: 'https://placehold.co/600x600?text=shorts' } ],
      variants: [
        { name: 'Size', value: '4-5Y', stock_quantity: 10 },
        { name: 'Size', value: '6-7Y', stock_quantity: 15 },
        { name: 'Size', value: '8-9Y', stock_quantity: 15 }
      ]
    },
    {
      name: 'Túi xách nữ',
      slug: 'tui-xach-nu',
      description: 'Túi xách nữ da thật, kiểu dáng tote, dung tích lớn phù hợp đi làm',
      short_description: 'Túi xách nữ cao cấp',
      category_id: createdCats[3]._id,
      price: 800000,
      original_price: 1000000,
      stock_quantity: 10,
      status: 'active',
      images: [ { image_url: 'https://placehold.co/600x600?text=bag' } ],
      variants: [
        { name: 'Color', value: 'Black', stock_quantity: 4 },
        { name: 'Color', value: 'Brown', stock_quantity: 6 }
      ]
    },
    {
      name: 'Giày sneaker nam',
      slug: 'giay-sneaker-nam',
      description: 'Giày sneaker nam chất liệu da tổng hợp, đế cao su bền bỉ, thoải mái khi đi',
      short_description: 'Giày sneaker nam',
      category_id: createdCats[4]._id,
      price: 550000,
      original_price: 650000,
      stock_quantity: 25,
      status: 'active',
      images: [ { image_url: 'https://placehold.co/600x600?text=sneakers' } ],
      variants: [
        { name: 'Size', value: '39', stock_quantity: 5 },
        { name: 'Size', value: '40', stock_quantity: 8 },
        { name: 'Size', value: '41', stock_quantity: 7 },
        { name: 'Size', value: '42', stock_quantity: 5 }
      ]
    },
    {
      name: 'Áo len nữ',
      slug: 'ao-len-nu',
      description: 'Áo len nữ cổ lọ, chất liệu len mềm mại, giữ nhiệt tốt mùa đông',
      short_description: 'Áo len nữ ấm áp',
      category_id: createdCats[0]._id,
      price: 400000,
      original_price: 500000,
      stock_quantity: 35,
      status: 'active',
      images: [ { image_url: 'https://placehold.co/600x600?text=sweater' } ],
      variants: [
        { name: 'Size', value: 'S', stock_quantity: 10 },
        { name: 'Size', value: 'M', stock_quantity: 15 },
        { name: 'Size', value: 'L', stock_quantity: 10 }
      ]
    }
  ];

  const createdProducts = [];
  for (const p of sampleProducts) {
    const up = await Product.findOneAndUpdate({ slug: p.slug }, { $set: p }, { upsert: true, new: true });
    createdProducts.push(up);
  }

  // Create an admin user (password hashed for security)
  let admin = await User.findOne({ email: 'admin@abc.com' });
  if (!admin) {
    const hashedPassword = await bcrypt.hash('adminpass', 10);
    admin = await User.create({ email: 'admin@abc.com', password: hashedPassword, name: 'Admin', role: 'admin' });
  }

  // Create demo customers (passwords hashed)
  const customers = [
    { email: 'demo@abc.com', password: 'demopass', name: 'Demo Customer', role: 'customer' },
    { email: 'user1@abc.com', password: 'user1pass', name: 'Nguyen Van A', role: 'customer' },
    { email: 'user2@abc.com', password: 'user2pass', name: 'Tran Thi B', role: 'customer' },
    { email: 'user3@abc.com', password: 'user3pass', name: 'Le Van C', role: 'customer' }
  ];
  const createdCustomers = [];
  for (const c of customers) {
    let user = await User.findOne({ email: c.email });
    if (!user) {
      const hashedPassword = await bcrypt.hash(c.password, 10);
      user = await User.create({ ...c, password: hashedPassword });
    }
    createdCustomers.push(user);
  }

  // Clear sample cart items for customers and add multiple
  for (const cust of createdCustomers) {
    await CartItem.deleteMany({ user_id: cust._id });
    // Add 1-3 random items per customer
    const numItems = Math.floor(Math.random() * 3) + 1;
    const usedProducts = new Set();
    for (let i = 0; i < numItems; i++) {
      let prod;
      do {
        prod = createdProducts[Math.floor(Math.random() * createdProducts.length)];
      } while (usedProducts.has(prod._id.toString()));
      usedProducts.add(prod._id.toString());
      
      // Pick a random variant if available
      let variantId = null;
      if (prod.variants && prod.variants.length > 0) {
        const randomVariant = prod.variants[Math.floor(Math.random() * prod.variants.length)];
        variantId = randomVariant._id;
      }
      
      await CartItem.findOneAndUpdate(
        { user_id: cust._id, product_id: prod._id, variant_id: variantId },
        { quantity: Math.floor(Math.random() * 5) + 1 },
        { upsert: true, new: true }
      );
    }
  }

  console.log('Seed complete: categories:', createdCats.length, 'products:', createdProducts.length, 'users:', 1 + createdCustomers.length, 'cart items: multiple per user');
  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
