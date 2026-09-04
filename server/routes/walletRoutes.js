const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { validateAmount } = require('../middleware/validationMiddleware');
const {
  getWallet,
  addMoneyToWallet,
  withdrawFromWallet,
  getBalance,
  searchWallet
} = require('../controllers/walletController');

// Get wallet details
router.get('/', protect, getWallet);

// Add money to wallet
router.post('/add-money', protect, validateAmount, addMoneyToWallet);

// Withdraw money from wallet
router.post('/withdraw', protect, validateAmount, withdrawFromWallet);

// Get balance in specific currency
router.get('/balance/:currency', protect, getBalance);

// Search wallet by identifier
router.get('/search/:identifier', protect, searchWallet);

module.exports = router;
