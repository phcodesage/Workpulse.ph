"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messages_1 = require("../controllers/messages");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/')
    .get(auth_1.protect, messages_1.getConversations)
    .post(auth_1.protect, messages_1.sendMessage);
router.get('/:userId', auth_1.protect, messages_1.getConversation);
exports.default = router;
