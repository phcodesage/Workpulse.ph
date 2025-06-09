const express = require('express');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require('../controllers/notifications');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router.route('/')
  .get(getNotifications);

router.route('/read-all')
  .put(markAllAsRead);

router.route('/:id')
  .put(markAsRead)
  .delete(deleteNotification);

module.exports = router;
