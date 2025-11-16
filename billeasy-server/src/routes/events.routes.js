const express = require('express');
const Event = require('../models/Event');

const router = express.Router();

// GET /api/events - list all events
router.get('/', async (req, res) => {
  try {
    const items = await Event.find().sort({ date: -1, createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/events - create event
router.post('/', async (req, res) => {
  try {
    const { title, date, location, description = '' } = req.body || {};
    if (!title || !date || !location) {
      return res.status(400).json({ success: false, error: 'title, date, and location are required' });
    }
    const created = await Event.create({ title, date, location, description });
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET /api/events/:id - get single event
router.get('/:id', async (req, res) => {
  try {
    const item = await Event.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT /api/events/:id - update event
router.put('/:id', async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE /api/events/:id - delete event
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: { id: deleted._id } });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;