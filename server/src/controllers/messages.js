const Message = require('../models/Message');
const User = require('../models/User');
const { createNotification } = require('./notifications');

// @desc    Get all messages for a user
// @route   GET /api/messages
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    // Get all messages where user is either sender or receiver
    const messages = await Message.find({
      $or: [
        { sender: req.user.id },
        { receiver: req.user.id }
      ]
    })
    .populate('sender', 'name email')
    .populate('receiver', 'name email')
    .sort('-createdAt');

    // Group messages by conversation
    const conversations = {};
    
    messages.forEach(message => {
      const otherUser = message.sender._id.toString() === req.user.id 
        ? message.receiver._id.toString() 
        : message.sender._id.toString();
      
      if (!conversations[otherUser]) {
        conversations[otherUser] = {
          user: message.sender._id.toString() === req.user.id 
            ? message.receiver 
            : message.sender,
          messages: []
        };
      }
      
      conversations[otherUser].messages.push(message);
    });

    res.status(200).json({
      success: true,
      data: Object.values(conversations)
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get conversation with a specific user
// @route   GET /api/messages/:userId
// @access  Private
exports.getConversation = async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Get all messages between current user and specified user
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id }
      ]
    })
    .populate('sender', 'name email')
    .populate('receiver', 'name email')
    .sort('createdAt');
    
    // Mark messages as read if current user is receiver
    const unreadMessages = messages.filter(
      message => 
        message.receiver._id.toString() === req.user.id && 
        !message.read
    );
    
    if (unreadMessages.length > 0) {
      await Message.updateMany(
        { 
          _id: { $in: unreadMessages.map(msg => msg._id) }
        },
        { read: true }
      );
    }

    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { receiver, content } = req.body;
    
    // Check if receiver exists
    const receiverUser = await User.findById(receiver);
    
    if (!receiverUser) {
      return res.status(404).json({
        success: false,
        error: 'Receiver not found'
      });
    }
    
    // Create message
    const message = await Message.create({
      sender: req.user.id,
      receiver,
      content
    });
    
    // Populate sender and receiver
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email')
      .populate('receiver', 'name email');
    
    // Create notification for receiver
    await createNotification({
      user: receiver,
      type: 'message',
      title: 'New message',
      message: `${populatedMessage.sender.name} sent you a message: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
      relatedId: message._id,
      relatedModel: 'Message'
    });

    res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }
    
    // Check if user is the sender
    if (message.sender.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this message'
      });
    }
    
    await message.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get unread message count
// @route   GET /api/messages/unread
// @access  Private
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user.id,
      read: false
    });
    
    res.status(200).json({
      success: true,
      data: { count }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};
