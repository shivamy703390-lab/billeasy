const Product = require('../models/Product');

async function list(req, res) {
  const { q, category, sort } = req.query;
  const filter = {};
  if (q) filter.name = { $regex: q, $options: 'i' };
  if (category && category !== 'all') filter.category = category;

  let query = Product.find(filter);
  if (sort === 'price-asc') query = query.sort({ price: 1 });
  else if (sort === 'price-desc') query = query.sort({ price: -1 });
  else if (sort === 'name-asc') query = query.sort({ name: 1 });
  else if (sort === 'name-desc') query = query.sort({ name: -1 });
  else if (sort === 'rating-desc') query = query.sort({ rating: -1 });

  const items = await query.exec();
  res.json({ success: true, data: items });
}

async function getById(req, res) {
  const item = await Product.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, error: 'Not found' });
  res.json({ success: true, data: item });
}

async function create(req, res) {
  const item = await Product.create(req.body);
  res.status(201).json({ success: true, data: item });
}

async function update(req, res) {
  const item = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ success: false, error: 'Not found' });
  res.json({ success: true, data: item });
}

async function remove(req, res) {
  const item = await Product.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ success: false, error: 'Not found' });
  res.json({ success: true, data: item });
}

module.exports = { list, getById, create, update, remove };