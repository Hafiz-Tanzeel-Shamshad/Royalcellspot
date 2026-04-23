const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      trim: true,
    },
    source: {
      type: String,
      default: 'add_to_cart',
    },
  },
  { timestamps: true }
);

LeadSchema.index({ email: 1, phone: 1 }, { unique: true });

module.exports = mongoose.model('Lead', LeadSchema);
