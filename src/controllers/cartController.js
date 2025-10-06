const CartItem = require('../models/CartItem');
const Product = require('../models/ProductMongo');

// Helper: build session id from cookie or header fallback
function getSessionId(req) {
  return req.cookies?.session_id || req.headers['x-session-id'] || null;
}

async function getCart(req, res) {
  try {
    const filter = {};
    if (req.user) filter.user_id = req.user._id;
    else {
      const sid = getSessionId(req);
      if (!sid) return res.json({ cart: { items: [], count: 0, total: 0 } });
      filter.session_id = sid;
    }

    // join product info and filter out unpublished products
    const items = await CartItem.find(filter).lean();
    // fetch product info in batch
    const pids = items.map(it => it.product_id).filter(Boolean);
    const products = await Product.find({ _id: { $in: pids }, status: 'active' }).lean();
    const productsById = Object.fromEntries(products.map(p => [String(p._id), p]));

    const outItems = items.map(it => {
      const prod = productsById[String(it.product_id)];
      if (!prod) return null; // filter out removed/unpublished
      return {
        id: String(it._id),
        productId: String(it.product_id),
        variantId: it.variant_id ? String(it.variant_id) : null,
        name: prod.name,
        image: (prod.images && prod.images[0] && prod.images[0].image_url) || null,
        price: prod.price || prod.original_price || 0,
        originalPrice: prod.original_price || null,
        quantity: it.quantity,
        inStock: (typeof prod.stock_quantity !== 'undefined') ? (prod.stock_quantity > 0) : true,
        product: prod
      };
    }).filter(Boolean);

    const total = outItems.reduce((s, it) => s + (Number(it.price || 0) * Number(it.quantity || 1)), 0);
    return res.json({ cart: { items: outItems, count: outItems.length, total } });
  } catch (err) {
    console.error('getCart error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function addItem(req, res) {
  console.log('[DEBUG addItem] req.user:', req.user ? req.user._id : 'NO USER');
  console.log('[DEBUG addItem] Authorization header:', req.headers.authorization ? 'EXISTS' : 'MISSING');
  try {
    const { item } = req.body;
    if (!item || !item.productId) return res.status(400).json({ message: 'Invalid item' });

    // ensure product exists and is published
    const product = await Product.findOne({ _id: item.productId, status: 'active' });
    if (!product) return res.status(404).json({ message: 'Product not found or unavailable' });

    const filter = {};
    if (req.user) filter.user_id = req.user._id;
    else {
      const sid = getSessionId(req);
      if (!sid) return res.status(400).json({ message: 'Session missing' });
      filter.session_id = sid;
    }

    filter.product_id = item.productId;
    if (item.variantId) filter.variant_id = item.variantId;

    let existing = await CartItem.findOne(filter);
    if (existing) {
      existing.quantity = (existing.quantity || 0) + (parseInt(item.quantity || 1, 10) || 1);
      await existing.save();
    } else {
      const toCreate = {
        product_id: item.productId,
        variant_id: item.variantId || null,
        quantity: parseInt(item.quantity || 1, 10) || 1
      };
      if (req.user) toCreate.user_id = req.user._id; else toCreate.session_id = getSessionId(req);
      existing = await CartItem.create(toCreate);
    }

    // return updated cart
    return getCart(req, res);
  } catch (err) {
    console.error('addItem error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function removeItem(req, res) {
  try {
    const { item } = req.body;
    if (!item) return res.status(400).json({ message: 'Invalid item' });

    const filter = {};
    if (req.user) filter.user_id = req.user._id;
    else {
      const sid = getSessionId(req);
      if (!sid) return res.status(400).json({ message: 'Session missing' });
      filter.session_id = sid;
    }

    if (item.id) filter._id = item.id;
    else {
      if (!item.productId) return res.status(400).json({ message: 'Need id or productId' });
      filter.product_id = item.productId;
      if (item.variantId) filter.variant_id = item.variantId;
    }

    await CartItem.deleteMany(filter);
    return getCart(req, res);
  } catch (err) {
    console.error('removeItem error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function updateItem(req, res) {
  try {
    const { item } = req.body;
    if (!item || !item.id) return res.status(400).json({ message: 'Invalid item' });

    const filter = { _id: item.id };
    if (req.user) filter.user_id = req.user._id; else filter.session_id = getSessionId(req);

    const existing = await CartItem.findOne(filter);
    if (!existing) return res.status(404).json({ message: 'Cart item not found' });
    if (typeof item.quantity !== 'undefined') existing.quantity = parseInt(item.quantity, 10) || 0;
    await existing.save();
    return getCart(req, res);
  } catch (err) {
    console.error('updateItem error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function clearCart(req, res) {
  try {
    const filter = {};
    if (req.user) filter.user_id = req.user._id;
    else {
      const sid = getSessionId(req);
      if (!sid) return res.status(400).json({ message: 'Session missing' });
      filter.session_id = sid;
    }
    await CartItem.deleteMany(filter);
    return res.json({ cart: { items: [], count: 0, total: 0 } });
  } catch (err) {
    console.error('clearCart error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  getCart,
  addItem,
  removeItem,
  updateItem,
  clearCart
};




