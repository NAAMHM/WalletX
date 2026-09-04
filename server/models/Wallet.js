const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  walletId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  balances: {
    INR: {
      type: Number,
      default: 0,
      min: [0, 'Balance cannot be negative']
    },
    USD: {
      type: Number,
      default: 0,
      min: [0, 'Balance cannot be negative']
    },
    EUR: {
      type: Number,
      default: 0,
      min: [0, 'Balance cannot be negative']
    },
    GBP: {
      type: Number,
      default: 0,
      min: [0, 'Balance cannot be negative']
    },
    AED: {
      type: Number,
      default: 0,
      min: [0, 'Balance cannot be negative']
    }
  },
  totalMoneyAdded: {
    type: Number,
    default: 0
  },
  totalMoneySent: {
    type: Number,
    default: 0
  },
  totalMoneyReceived: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster wallet lookup
walletSchema.index({ walletId: 1 });
walletSchema.index({ userId: 1 });

// Method to get balance in preferred currency
walletSchema.methods.getBalance = function(currency = 'INR') {
  return this.balances[currency] || 0;
};

// Method to update balance
walletSchema.methods.updateBalance = function(currency, amount) {
  if (!this.balances[currency] && this.balances[currency] !== 0) {
    throw new Error('Invalid currency');
  }
  
  const newBalance = this.balances[currency] + amount;
  
  if (newBalance < 0) {
    throw new Error('Insufficient balance');
  }
  
  this.balances[currency] = newBalance;
};

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
