"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jobs_1 = require("../controllers/jobs");
const auth_1 = require("../middleware/auth");
// Include applications router
const applications_1 = __importDefault(require("./applications"));
const router = express_1.default.Router();
// Re-route into other resource routers
router.use('/:jobId/applications', applications_1.default);
router.route('/')
    .get(jobs_1.getJobs)
    .post(auth_1.protect, (0, auth_1.authorize)('employer'), jobs_1.createJob);
router.route('/:id')
    .get(jobs_1.getJob)
    .put(auth_1.protect, (0, auth_1.authorize)('employer'), jobs_1.updateJob)
    .delete(auth_1.protect, (0, auth_1.authorize)('employer'), jobs_1.deleteJob);
exports.default = router;
