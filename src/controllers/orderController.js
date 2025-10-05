const Order = require('../models/Order');

exports.create = async (req, res) => {
  const { items, total, customer } = req.body;
  if (!items || !items.length) return res.status(400).json({ message: 'No items' });
  const orderData = { items, total, customer };
  if (req.user) orderData.user = req.user._id;
  const order = await Order.create(orderData);
  res.json({ order });
};

exports.list = async (req, res) => {
  if (req.user) {
    const orders = await Order.find({ user: req.user._id }).limit(200).populate('user', 'email');
    return res.json({ orders });
  }
  const orders = await Order.find().limit(200).populate('user', 'email');
  res.json({ orders });
};

exports.get = async (req, res) => {
  const o = await Order.findById(req.params.id).populate('user', 'email');
  if (!o) return res.status(404).json({ message: 'Not found' });
  // if user is present, ensure they own the order (or allow admin later)
  if (req.user && o.user && o.user._id.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
  res.json({ order: o });
};
