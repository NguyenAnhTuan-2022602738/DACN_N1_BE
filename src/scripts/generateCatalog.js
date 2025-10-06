require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const MONGO = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/abc-fashion';

const BRANDS = ['ABC Fashion','Bella','OfficeWear','FormalLine','HeelCo','UrbanStyle','DenimHouse','ClassicWear'];
const CATEGORIES = ['Áo','Quần','Giày','Túi','Phụ kiện','Mũ','Thắt lưng','Váy','Đầm','Áo khoác'];
const COLORS = ['Trắng','Đen','Xanh','Đỏ','Vàng','Hồng','Be','Nâu','Xám'];
const SIZES = ['XS','S','M','L','XL','XXL'];
const IMG_POOL = [
  'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1583496661160-fb5886a13d27?w=800&h=800&fit=crop'
];

function rand(arr) { return arr[Math.floor(Math.random()*arr.length)]; }
function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min }

function makeProduct(i){
  const category = rand(CATEGORIES);
  const brand = rand(BRANDS);
  const baseName = `${brand} ${category} mẫu ${i}`;
  const colors = Array.from(new Set(Array.from({length: randInt(1,4)},()=>rand(COLORS))));
  const sizes = Array.from(new Set(Array.from({length: randInt(1,5)},()=>rand(SIZES))));
  const originalPrice = randInt(200000,2000000);
  const salePrice = Math.round(originalPrice * (0.6 + Math.random()*0.35));
  const images = Array.from({length: randInt(1,4)}, ()=> rand(IMG_POOL) + `&v=${i}`);
  return {
    sku: `PRD-${Date.now().toString().slice(-5)}-${i}`,
    name: baseName,
    brand,
    categories: [category],
    collections: ['Mới về'],
    description: `Sản phẩm ${baseName} - chất lượng tốt, phong cách hiện đại.`,
    originalPrice,
    salePrice,
    images,
    stock: randInt(0,200),
    rating: +(3 + Math.random()*2).toFixed(1),
    reviewCount: randInt(0,500),
    colors,
    sizes,
    features: ['Chất liệu tốt','Thiết kế tinh tế','Dễ phối đồ'],
    specifications: { 'Chất liệu': rand(['Cotton','Polyester','Lụa','Da tổng hợp']) },
    careInstructions: ['Giặt tay hoặc giặt nhẹ','Không tẩy'],
    tags: [category, brand],
    status: 'published'
  };
}

async function generate(count=200, insert=true){
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to DB');
  const products = [];
  for(let i=1;i<=count;i++){
    products.push(makeProduct(i));
  }
  if (!insert) {
    console.log(JSON.stringify(products, null, 2).slice(0, 2000));
    await mongoose.disconnect();
    return;
  }
  // Insert in batches to avoid huge single insert
  const batchSize = 100;
  for(let i=0;i<products.length;i+=batchSize){
    const batch = products.slice(i, i+batchSize);
    await Product.insertMany(batch);
    console.log(`Inserted batch ${i/batchSize+1}`);
  }
  console.log(`Inserted ${products.length} products`);
  await mongoose.disconnect();
}

const argv = process.argv.slice(2);
const count = parseInt(argv[0],10) || 200;
const insert = argv.includes('--no-insert') ? false : true;

generate(count, insert).catch(err=>{
  console.error('Generation failed', err);
  process.exit(1);
});
