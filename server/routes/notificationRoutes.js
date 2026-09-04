const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getNotifications,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
} = require('../controllers/notificationController');

// Get notifications
router.get('/', protect, getNotifications);

// Get unread count
router.get('/unread/count', protect, getUnreadCount);

// Mark notification as read
router.put('/:id/read', protect, markNotificationAsRead);

// Mark all as read
router.put('/read-all', protect, markAllAsRead);

// Delete notification
router.delete('/:id', protect, deleteNotification);

module.exports = router;
