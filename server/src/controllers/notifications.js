const Notification = require('../models/Notification');

/**
 * @desc    Get all notifications for a user
 * @route   GET /api/notifications
 * @access  Private
 */
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort('-createdAt')
      .limit(req.query.limit ? parseInt(req.query.limit) : 20);
    
    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * @desc    Mark notification as read
 * @route   PUT /api/notifications/:id
 * @access  Private
 */
exports.markAsRead = async (req, res) => {
  try {
    let notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }
    
    // Make sure user owns notification
    if (notification.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this notification'
      });
    }
    
    notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * @desc    Mark all notifications as read
 * @route   PUT /api/notifications/read-all
 * @access  Private
 */
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * @desc    Delete a notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }
    
    // Make sure user owns notification
    if (notification.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this notification'
      });
    }
    
    await notification.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * @desc    Create notification (internal use only)
 * @access  Private
 */
exports.createNotification = async (userData) => {
  try {
    return await Notification.create(userData);
  } catch (err) {
    console.error('Error creating notification:', err);
    return null;
  }
};
