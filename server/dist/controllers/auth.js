"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.getMe = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        // Check if user already exists
        const userExists = await User_1.default.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                error: 'User with that email already exists',
            });
        }
        // Create user
        const user = await User_1.default.create({
            name,
            email,
            password,
            role,
        });
        sendTokenResponse(user, 201, res);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Server Error',
        });
    }
};
exports.register = register;
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide an email and password',
            });
        }
        // Check for user
        const user = await User_1.default.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials',
            });
        }
        // Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials',
            });
        }
        sendTokenResponse(user, 200, res);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Server Error',
        });
    }
};
exports.login = login;
// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Server Error',
        });
    }
};
exports.getMe = getMe;
// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
const logout = async (req, res) => {
    res.status(200).json({
        success: true,
        data: {},
    });
};
exports.logout = logout;
// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRE
            ? parseInt(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
            : 30 * 24 * 60 * 60 * 1000)),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    };
    res.status(statusCode).json({
        success: true,
        token,
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
};
