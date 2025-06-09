"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const applications_1 = require("../controllers/applications");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router({ mergeParams: true });
router.route('/')
    .get(auth_1.protect, (0, auth_1.authorize)('employer'), applications_1.getJobApplications)
    .post(auth_1.protect, (0, auth_1.authorize)('jobseeker'), applications_1.applyToJob);
// Routes not tied to a specific job
router.get('/my-applications', auth_1.protect, (0, auth_1.authorize)('jobseeker'), applications_1.getMyApplications);
router.put('/:id', auth_1.protect, (0, auth_1.authorize)('employer'), applications_1.updateApplicationStatus);
exports.default = router;
