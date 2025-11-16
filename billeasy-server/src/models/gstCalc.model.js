const mongoose = require('mongoose');

const GstCalcSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
    productName: { type: String, default: '' }, // snapshot name (optional)
    price: { type: Number, required: true, min: 0 }, // base price
    ratePercent: { type: Number, required: true, min: 0 }, // GST rate
    gstAmount: { type: Number, required: true, min: 0 }, // computed: price * rate/100
    totalAmount: { type: Number, required: true, min: 0 }, // price + gstAmount
    currency: { type: String, default: 'INR' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('GstCalculation', GstCalcSchema);