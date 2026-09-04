const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    required: true,
    enum: [
      'ADD_MONEY',
      'WITHDRAW',
      'SEND',
      'RECEIVE',
      'REQUEST',
      'BILL_PAYMENT',
      'QR_PAYMENT',
      'CURRENCY_CONVERSION'
    ]
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount must be greater than 0']
  },
  currency: {
    type: String,
    required: true,
    enum: ['INR', 'USD', 'EUR', 'GBP', 'AED'],
    default: 'INR'
  },
  category: {
    type: String,
    default: 'general'
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'PENDING', 'FAILED', 'CANCELLED'],
    default: 'SUCCESS'
  },
  referenceId: {
    type: String,
    default: ''
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  balanceBefore: {
    type: Number,
    default: 0
  },
  balanceAfter: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for faster queries
transactionSchema.index({ transactionId: 1 });
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ senderId: 1 });
transactionSchema.index({ receiverId: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ createdAt: -1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
