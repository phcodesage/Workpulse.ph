"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const auth_2 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/register', auth_1.register);
router.post('/login', auth_1.login);
router.get('/me', auth_2.protect, auth_1.getMe);
router.get('/logout', auth_2.protect, auth_1.logout);
exports.default = router;
