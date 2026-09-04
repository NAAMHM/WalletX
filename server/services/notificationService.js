const Notification = require('../models/Notification');

/**
 * Create notification
 */
const createNotification = async (userId, title, message, type = 'SYSTEM', metadata = {}) => {
  try {
    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      metadata
    });
    return notification;
  } catch (error) {
    console.error('Create notification error:', error);
    throw error;
  }
};

/**
 * Mark notification as read
 */
const markAsRead = async (notificationId, userId) => {
  try {
    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      throw new Error('Notification not found');
    }

    if (notification.userId.toString() !== userId.toString()) {
      throw new Error('Not authorized');
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    return notification;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createNotification,
  markAsRead
};
