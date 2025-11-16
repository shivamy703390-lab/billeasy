const Event = require('../models/Event');

async function list(req, res) {
  const { q, month } = req.query;
  const filter = {};
  if (q) filter.title = { $regex: q, $options: 'i' };
  if (month && month !== 'all') filter.month = month;

  const items = await Event.find(filter).sort({ date: 1 }).exec();
  res.json({ success: true, data: items });
}

async function getById(req, res) {
  const item = await Event.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, error: 'Not found' });
  res.json({ success: true, data: item });
}

async function create(req, res) {
  const item = await Event.create(req.body);
  res.status(201).json({ success: true, data: item });
}

async function update(req, res) {
  const item = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ success: false, error: 'Not found' });
  res.json({ success: true, data: item });
}

async function remove(req, res) {
  const item = await Event.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ success: false, error: 'Not found' });
  res.json({ success: true, data: item });
}

module.exports = { list, getById, create, update, remove };