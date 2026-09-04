const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getProfile,
  updateProfile,
  changePassword,
  getLoginHistory
} = require('../controllers/userController');

// Get profile
router.get('/me', protect, getProfile);

// Update profile
router.put('/me', protect, updateProfile);

// Change password
router.put('/change-password', protect, changePassword);

// Get login history
router.get('/login-history', protect, getLoginHistory);

module.exports = router;
