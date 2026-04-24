const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  brand: {
    type: String,
    required: [true, 'Please add a brand'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
  discountPrice: {
    type: Number,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
  },
  images: [String],
  specs: {
    ram: String,
    storage: String,
    battery: String,
    processor: String,
  },
  // array of available storage options (e.g. ["64GB","128GB"]) and colors
  storage: [String],
  colors: [String],
  stock: {
    type: Number,
    required: [true, 'Please add stock'],
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// migrate old specs.storage into storage array when saving (backwards-compat)
ProductSchema.pre('save', function (next) {
  try {
    if (this.specs && this.specs.storage && (!this.storage || this.storage.length === 0)) {
      if (typeof this.specs.storage === 'string') {
        // split by comma if multiple values stored in one string
        this.storage = this.specs.storage.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
  } catch (err) {
    // ignore migration errors
  }
  next();
});

module.exports = mongoose.model('Product', ProductSchema);