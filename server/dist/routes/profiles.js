"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profiles_1 = require("../controllers/profiles");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get current user profile
router.get('/', auth_1.protect, profiles_1.getMyProfile);
// Employer profile routes
router.route('/employer')
    .post(auth_1.protect, (0, auth_1.authorize)('employer'), profiles_1.createEmployerProfile);
router.get('/employer/:id', profiles_1.getEmployerProfile);
// Job seeker profile routes
router.route('/jobseeker')
    .post(auth_1.protect, (0, auth_1.authorize)('jobseeker'), profiles_1.createJobSeekerProfile);
router.get('/jobseeker/:id', profiles_1.getJobSeekerProfile);
// Education routes
router.route('/jobseeker/education')
    .put(auth_1.protect, (0, auth_1.authorize)('jobseeker'), profiles_1.addEducation);
router.route('/jobseeker/education/:eduId')
    .delete(auth_1.protect, (0, auth_1.authorize)('jobseeker'), profiles_1.deleteEducation);
// Work history routes
router.route('/jobseeker/work')
    .put(auth_1.protect, (0, auth_1.authorize)('jobseeker'), profiles_1.addWorkHistory);
router.route('/jobseeker/work/:workId')
    .delete(auth_1.protect, (0, auth_1.authorize)('jobseeker'), profiles_1.deleteWorkHistory);
exports.default = router;
