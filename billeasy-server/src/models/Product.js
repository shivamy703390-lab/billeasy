const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    description: { type: String, default: '' }
  },
  { timestamps: true }
);

// CHANGE: guard the model export to prevent re-compilation on Nodemon reloads
module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);