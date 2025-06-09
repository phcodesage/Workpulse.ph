"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = __importDefault(require("mongoose"));
// Protect routes
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
    }
    // Make sure token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Not authorized to access this route',
        });
    }
    try {
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded.id || !mongoose_1.default.Types.ObjectId.isValid(decoded.id)) {
            return res.status(401).json({
                success: false,
                error: 'Invalid token',
            });
        }
        req.user = await User_1.default.findById(decoded.id);
        next();
    }
    catch (err) {
        return res.status(401).json({
            success: false,
            error: 'Not authorized to access this route',
        });
    }
};
exports.protect = protect;
// Grant access to specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'User not found',
            });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `User role ${req.user.role} is not authorized to access this route`,
            });
        }
        next();
    };
};
exports.authorize = authorize;
