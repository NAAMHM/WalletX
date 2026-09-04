const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const {
  getStatistics,
  getUsers,
  getUserDetails,
  blockUser,
  unblockUser,
  getAllTransactions
} = require('../controllers/adminController');

// All routes require admin access
router.use(protect, adminOnly);

// Get statistics
router.get('/statistics', getStatistics);

// Get all users
router.get('/users', getUsers);

// Get user details
router.get('/users/:id', getUserDetails);

// Block user
router.put('/users/:id/block', blockUser);

// Unblock user
router.put('/users/:id/unblock', unblockUser);

// Get all transactions
router.get('/transactions', getAllTransactions);

module.exports = router;
