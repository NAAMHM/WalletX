const mongoose = require('mongoose');

const billPaymentSchema = new mongoose.Schema({
  paymentId: {
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
  provider: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'ELECTRICITY',
      'WATER',
      'MOBILE_RECHARGE',
      'INTERNET',
      'GAS',
      'DTH',
      'INSURANCE',
      'CREDIT_CARD'
    ]
  },
  accountNumber: {
    type: String,
    required: true,
    trim: true
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
  status: {
    type: String,
    enum: ['SUCCESS', 'PENDING', 'FAILED'],
    default: 'SUCCESS'
  },
  transactionId: {
    type: String,
    required: true
  },
  billDetails: {
    billNumber: String,
    dueDate: Date,
    billPeriod: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes
billPaymentSchema.index({ paymentId: 1 });
billPaymentSchema.index({ userId: 1, createdAt: -1 });
billPaymentSchema.index({ category: 1 });
billPaymentSchema.index({ status: 1 });
billPaymentSchema.index({ transactionId: 1 });

const BillPayment = mongoose.model('BillPayment', billPaymentSchema);

module.exports = BillPayment;
