const express = require('express');
const {
  getMessages,
  getConversation,
  sendMessage,
  deleteMessage,
  getUnreadCount
} = require('../controllers/messages');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getMessages)
  .post(protect, sendMessage);

router.get('/unread', protect, getUnreadCount);
router.get('/:userId', protect, getConversation);
router.delete('/:id', protect, deleteMessage);

module.exports = router;
