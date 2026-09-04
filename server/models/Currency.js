const mongoose = require('mongoose');

const currencySchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    minlength: 3,
    maxlength: 3
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  symbol: {
    type: String,
    required: true,
    trim: true
  },
  demoRate: {
    type: Number,
    required: true,
    min: [0, 'Rate must be positive']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  country: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

// Index
currencySchema.index({ code: 1 });
currencySchema.index({ isActive: 1 });

const Currency = mongoose.model('Currency', currencySchema);

module.exports = Currency;
