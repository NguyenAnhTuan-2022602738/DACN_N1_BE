const Wishlist = require('../models/Wishlist');

// get wishlist for current user
exports.getWishlist = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  let w = await Wishlist.findOne({ user: req.user._id });
  if (!w) return res.json({ items: [] });
  res.json({ items: w.items });
};

// add item to wishlist (idempotent)
exports.addItem = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  const { productId, snapshot } = req.body;
  if (!productId) return res.status(400).json({ message: 'Missing productId' });
  let w = await Wishlist.findOne({ user: req.user._id });
  if (!w) {
    w = await Wishlist.create({ user: req.user._id, items: [{ productId, snapshot }] });
    return res.json({ items: w.items });
  }
  // if exists, ignore duplicates
  if (w.items.some(i => i.productId === productId)) return res.json({ items: w.items });
  w.items.push({ productId, snapshot });
  await w.save();
  res.json({ items: w.items });
};

// remove item
exports.removeItem = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ message: 'Missing productId' });
  const w = await Wishlist.findOne({ user: req.user._id });
  if (!w) return res.json({ items: [] });
  w.items = w.items.filter(i => i.productId !== productId);
  await w.save();
  res.json({ items: w.items });
};
