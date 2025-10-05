const Product = require('../models/Product');

exports.list = async (req, res) => {
  const products = await Product.find().limit(100);
  res.json({ products });
};

exports.get = async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ message: 'Not found' });
  res.json({ product: p });
};

exports.create = async (req, res) => {
  const { name, price, description, stock, images } = req.body;
  const p = await Product.create({ name, price, description, stock, images });
  res.json({ product: p });
};
