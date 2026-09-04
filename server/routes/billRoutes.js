const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getBillProviders,
  payBill,
  getBillHistory,
  getBillDetails
} = require('../controllers/billController');

// Get bill providers
router.get('/providers', protect, getBillProviders);

// Pay bill
router.post('/pay', protect, payBill);

// Get bill payment history
router.get('/history', protect, getBillHistory);

// Get bill payment details
router.get('/:paymentId', protect, getBillDetails);

module.exports = router;
