const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getTransactions,
  getTransactionDetails,
  getTransactionStats
} = require('../controllers/transactionController');

// Get all transactions
router.get('/', protect, getTransactions);

// Get transaction statistics
router.get('/stats/summary', protect, getTransactionStats);

// Get transaction details
router.get('/:id', protect, getTransactionDetails);

module.exports = router;
