const mongoose = require('mongoose');

const moneyRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: [0.01, 'Amount must be greater than 0']
  },
  currency: {
    type: String,
    required: true,
    enum: ['INR', 'USD', 'EUR', 'GBP', 'AED'],
    default: 'INR'
  },
  note: {
    type: String,
    trim: true,
    maxlength: [500, 'Note cannot exceed 500 characters'],
    default: ''
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED'],
    default: 'PENDING'
  },
  transactionId: {
    type: String,
    default: ''
  },
  respondedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
moneyRequestSchema.index({ requestId: 1 });
moneyRequestSchema.index({ senderId: 1, status: 1 });
moneyRequestSchema.index({ receiverId: 1, status: 1 });
moneyRequestSchema.index({ createdAt: -1 });

const MoneyRequest = mongoose.model('MoneyRequest', moneyRequestSchema);

module.exports = MoneyRequest;
