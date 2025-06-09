"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversations = exports.getConversation = exports.sendMessage = void 0;
const Message_1 = __importDefault(require("../models/Message"));
const User_1 = __importDefault(require("../models/User"));
// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        if (!receiverId || !content) {
            return res.status(400).json({
                success: false,
                error: 'Please provide receiver ID and message content'
            });
        }
        // Check if receiver exists
        const receiver = await User_1.default.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({
                success: false,
                error: 'Receiver not found'
            });
        }
        // Create message
        const message = await Message_1.default.create({
            senderId: req.user.id,
            receiverId,
            content
        });
        res.status(201).json({
            success: true,
            data: message
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Server Error'
        });
    }
};
exports.sendMessage = sendMessage;
// @desc    Get conversation between current user and another user
// @route   GET /api/messages/:userId
// @access  Private
const getConversation = async (req, res) => {
    try {
        const { userId } = req.params;
        // Check if user exists
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        // Get messages between users (both directions)
        const messages = await Message_1.default.find({
            $or: [
                { senderId: req.user.id, receiverId: userId },
                { senderId: userId, receiverId: req.user.id }
            ]
        }).sort('createdAt');
        // Mark messages as read if current user is the receiver
        await Message_1.default.updateMany({ senderId: userId, receiverId: req.user.id, read: false }, { read: true });
        res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Server Error'
        });
    }
};
exports.getConversation = getConversation;
// @desc    Get all conversations for current user
// @route   GET /api/messages
// @access  Private
const getConversations = async (req, res) => {
    try {
        // Find all users the current user has messaged or received messages from
        const messages = await Message_1.default.find({
            $or: [
                { senderId: req.user.id },
                { receiverId: req.user.id }
            ]
        }).sort('-createdAt');
        // Extract unique user IDs
        const userIds = new Set();
        messages.forEach(message => {
            if (message.senderId.toString() !== req.user.id) {
                userIds.add(message.senderId.toString());
            }
            if (message.receiverId.toString() !== req.user.id) {
                userIds.add(message.receiverId.toString());
            }
        });
        // Get latest message for each conversation
        const conversations = [];
        for (const userId of userIds) {
            const latestMessage = await Message_1.default.findOne({
                $or: [
                    { senderId: req.user.id, receiverId: userId },
                    { senderId: userId, receiverId: req.user.id }
                ]
            }).sort('-createdAt');
            // Get user info
            const user = await User_1.default.findById(userId).select('name email role');
            // Count unread messages
            const unreadCount = await Message_1.default.countDocuments({
                senderId: userId,
                receiverId: req.user.id,
                read: false
            });
            conversations.push({
                user,
                latestMessage,
                unreadCount
            });
        }
        res.status(200).json({
            success: true,
            count: conversations.length,
            data: conversations
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Server Error'
        });
    }
};
exports.getConversations = getConversations;
