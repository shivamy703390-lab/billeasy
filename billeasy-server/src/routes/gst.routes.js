const express = require('express');
const GstCalculation = require('../models/GSTCalculation');
// CHANGE: point to canonical Product model file
const Product = require('../models/Product');

const router = express.Router();

// Create a GST calculation
router.post('/', async (req, res) => {
  try {
    const { productId, price, ratePercent } = req.body || {};
    if (productId) {
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
      const basePrice = typeof price === 'number' ? price : product.price;
      const saved = await GstCalculation.create({
        product: product._id,
        productName: product.name,
        price: basePrice,
        ratePercent: typeof ratePercent === 'number' ? ratePercent : undefined
      });
      return res.status(201).json({ success: true, data: saved });
    }

    if (typeof price !== 'number') {
      return res.status(400).json({ success: false, error: 'price is required when productId is not provided' });
    }

    const saved = await GstCalculation.create({
      price,
      ratePercent: typeof ratePercent === 'number' ? ratePercent : undefined
    });

    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// List GST calculations
router.get('/', async (req, res) => {
  try {
    const { productId, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (productId) filter.product = productId;
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      GstCalculation.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      GstCalculation.countDocuments(filter)
    ]);
    res.json({ success: true, data: items, meta: { total, page: Number(page), limit: Number(limit) } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;