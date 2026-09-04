const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  sendMoneyController,
  requestMoney,
  getMoneyRequests,
  getMoneyRequestDetails,
  acceptMoneyRequest,
  rejectMoneyRequest,
  cancelMoneyRequest
} = require('../controllers/transferController');

// Send money
router.post('/send', protect, sendMoneyController);

// Request money
router.post('/request', protect, requestMoney);

// Get all money requests
router.get('/requests', protect, getMoneyRequests);

// Get money request details
router.get('/requests/:id', protect, getMoneyRequestDetails);

// Accept money request
router.put('/requests/:id/accept', protect, acceptMoneyRequest);

// Reject money request
router.put('/requests/:id/reject', protect, rejectMoneyRequest);

// Cancel money request
router.put('/requests/:id/cancel', protect, cancelMoneyRequest);

module.exports = router;
