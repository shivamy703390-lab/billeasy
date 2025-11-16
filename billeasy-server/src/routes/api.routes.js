const express = require('express');
const router = express.Router();

// Health
router.get('/health', (req, res) => {
  res.json({ success: true, status: 'ok', timestamp: Date.now() });
});

// REPLACE these imports to avoid hidden/invalid characters in the path string
// const { computeInvoice } = require('../controllers/invoice.controller');
// const { getKpis, getRevenue } = require('../controllers/kpi.controller');
// const { login } = require('../controllers/auth.controller');

const invoiceController = require('../controllers/invoice.controller.js');
const kpiController = require('../controllers/kpi.controller.js');
const authController = require('../controllers/auth.controller.js');

// Auth (mock)
router.post('/login', authController.login);

// KPIs and Revenue
router.get('/kpis', kpiController.getKpis);
router.get('/revenue', kpiController.getRevenue);

// Invoice computation
router.post('/invoice', invoiceController.computeInvoice);

module.exports = router;