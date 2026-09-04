const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  generateQRCode,
  scanQRCode,
  payViaQR
} = require('../controllers/qrController');

// Generate QR code
router.post('/generate', protect, generateQRCode);

// Scan QR code
router.post('/scan', protect, scanQRCode);

// Pay via QR code
router.post('/pay', protect, payViaQR);

module.exports = router;
