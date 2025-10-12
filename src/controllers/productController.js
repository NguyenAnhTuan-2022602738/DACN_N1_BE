const Product = require('../models/ProductMongo');
const auth = require('../middleware/auth');

function isAdmin(user) {
  if (!user) return false;
  return ['admin','manager','staff'].includes(user.role);
}

// GET /api/products?search=&category=&status=&page=1&limit=20
exports.list = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page || '1', 10));
  const limit = Math.max(1, Math.min(200, parseInt(req.query.limit || '20', 10)));
  const skip = (page - 1) * limit;

  const q = {};
  if (req.query.status) q.status = req.query.status;
  if (req.query.category) q.category_id = req.query.category;
  if (req.query.is_featured) q.is_featured = req.query.is_featured === 'true';
  if (req.query.search) {
    const s = req.query.search.trim();
    q.$or = [
      { name: new RegExp(s, 'i') },
      { slug: new RegExp(s, 'i') },
      { 'tags': s }
    ];
  }

  const [items, total] = await Promise.all([
    Product.find(q).sort({ created_at: -1 }).skip(skip).limit(limit).lean(),
    Product.countDocuments(q)
  ]);
  res.json({ products: items, meta: { total, page, limit } });
};

// GET /api/products/:id
exports.get = async (req, res) => {
  const p = await Product.findById(req.params.id).lean();
  if (!p) return res.status(404).json({ message: 'Not found' });
  res.json({ product: p });
};

// POST /api/products
exports.create = async (req, res) => {
  if (!req.user || !isAdmin(req.user)) return res.status(403).json({ message: 'Forbidden' });
  const body = req.body || {};
  // basic validation
  if (!body.name || !body.salePrice && !body.price && !body.price === 0) {
    return res.status(400).json({ message: 'Missing required fields: name, price' });
  }
  // normalize fields to our model names
  const doc = {
    name: body.name,
    slug: body.slug || (body.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: body.description || '',
    short_description: body.short_description || '',
    category_id: body.category_id || body.category || null,
    sku: body.sku,
    price: body.salePrice || body.price || 0,
    original_price: body.originalPrice || body.original_price || null,
    cost_price: body.cost_price || null,
    stock_quantity: Number(body.stock) || Number(body.stock_quantity) || 0,
    min_stock_level: body.min_stock_level || 5,
    weight: body.weight || 0,
    dimensions: body.dimensions || '',
    status: body.status || 'active',
    is_featured: !!body.featured || !!body.is_featured,
    tags: body.tags || [],
    meta_title: body.meta_title || '',
    meta_description: body.meta_description || '',
    images: body.images || [],
    variants: body.variants || [],
    created_by: req.user._id
  };
  const created = await Product.create(doc);
  res.json({ product: created });
};

// PUT /api/products/:id
exports.update = async (req, res) => {
  if (!req.user || !isAdmin(req.user)) return res.status(403).json({ message: 'Forbidden' });
  const id = req.params.id;
  const updates = req.body || {};
  // whitelist fields
  const allowed = ['name','slug','description','short_description','category_id','sku','price','original_price','cost_price','stock_quantity','min_stock_level','weight','dimensions','status','is_featured','tags','meta_title','meta_description','images','variants','rating','review_count','created_by','updated_at','vendor'];
  const payload = {};
  for (const k of allowed) if (typeof updates[k] !== 'undefined') payload[k] = updates[k];

  const p = await Product.findByIdAndUpdate(id, { $set: payload }, { new: true });
  if (!p) return res.status(404).json({ message: 'Not found' });
  res.json({ product: p });
};

// DELETE /api/products/:id (hard delete)
exports.remove = async (req, res) => {
  if (!req.user || !isAdmin(req.user)) return res.status(403).json({ message: 'Forbidden' });
  const id = req.params.id;
  const p = await Product.findByIdAndDelete(id);
  if (!p) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
};

// PATCH /api/products/:id/publish (example helper)
exports.publish = async (req, res) => {
  if (!req.user || !isAdmin(req.user)) return res.status(403).json({ message: 'Forbidden' });
  const id = req.params.id;
  const p = await Product.findByIdAndUpdate(id, { $set: { status: 'active' } }, { new: true });
  if (!p) return res.status(404).json({ message: 'Not found' });
  res.json({ product: p });
};

