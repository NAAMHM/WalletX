const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getCurrencies,
  convertCurrencyController,
  calculateConversion
} = require('../controllers/currencyController');

// Get supported currencies
router.get('/', protect, getCurrencies);

// Convert currency
router.post('/convert', protect, convertCurrencyController);

// Calculate conversion
router.post('/calculate', protect, calculateConversion);

module.exports = router;
