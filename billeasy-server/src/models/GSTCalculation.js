const mongoose = require('mongoose');

const GSTCalculationSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
    productName: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    ratePercent: { type: Number, required: true, min: 0, default: 18 },
    gstAmount: { type: Number, required: true, min: 0 },
    totalWithGST: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' }
  },
  { timestamps: true }
);

// Auto-calculate amounts if not set
GSTCalculationSchema.pre('validate', function (next) {
  if (typeof this.price === 'number' && typeof this.ratePercent === 'number') {
    const gstAmount = +(this.price * (this.ratePercent / 100)).toFixed(2);
    const total = +(this.price + gstAmount).toFixed(2);
    this.gstAmount = gstAmount;
    this.totalWithGST = total;
  }
  next();
});

module.exports = mongoose.model('GstCalculation', GSTCalculationSchema);