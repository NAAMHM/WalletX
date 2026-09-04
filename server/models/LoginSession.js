const mongoose = require('mongoose');

const loginSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tokenIdentifier: {
    type: String,
    required: true,
    unique: true
  },
  ipAddress: {
    type: String,
    trim: true,
    default: ''
  },
  userAgent: {
    type: String,
    trim: true,
    default: ''
  },
  device: {
    type: String,
    trim: true,
    default: 'Unknown'
  },
  browser: {
    type: String,
    trim: true,
    default: 'Unknown'
  },
  location: {
    type: String,
    trim: true,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  lastActivityAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
loginSessionSchema.index({ userId: 1, isActive: 1 });
loginSessionSchema.index({ tokenIdentifier: 1 });
loginSessionSchema.index({ expiresAt: 1 });

// Automatically remove expired sessions
loginSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const LoginSession = mongoose.model('LoginSession', loginSessionSchema);

module.exports = LoginSession;
