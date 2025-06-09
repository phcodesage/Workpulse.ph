"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApplicationStatus = exports.getMyApplications = exports.getJobApplications = exports.applyToJob = void 0;
const JobApplication_1 = __importDefault(require("../models/JobApplication"));
const Job_1 = __importDefault(require("../models/Job"));
const JobSeeker_1 = __importDefault(require("../models/JobSeeker"));
const Employer_1 = __importDefault(require("../models/Employer"));
// @desc    Apply to job
// @route   POST /api/jobs/:jobId/applications
// @access  Private (Job Seekers only)
const applyToJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { coverLetter } = req.body;
        // Check if job exists
        const job = await Job_1.default.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                error: 'Job not found'
            });
        }
        // Check if job is still open
        if (job.status !== 'open') {
            return res.status(400).json({
                success: false,
                error: 'This job is no longer accepting applications'
            });
        }
        // Find job seeker profile for the user
        const jobSeeker = await JobSeeker_1.default.findOne({ userId: req.user.id });
        if (!jobSeeker) {
            return res.status(404).json({
                success: false,
                error: 'Job seeker profile not found. Please create a profile first.'
            });
        }
        // Check if already applied
        const existingApplication = await JobApplication_1.default.findOne({
            jobId,
            jobSeekerId: jobSeeker._id
        });
        if (existingApplication) {
            return res.status(400).json({
                success: false,
                error: 'You have already applied to this job'
            });
        }
        // Create application
        const application = await JobApplication_1.default.create({
            jobId,
            jobSeekerId: jobSeeker._id,
            coverLetter
        });
        res.status(201).json({
            success: true,
            data: application
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Server Error'
        });
    }
};
exports.applyToJob = applyToJob;
// @desc    Get applications for a job
// @route   GET /api/jobs/:jobId/applications
// @access  Private (Employer who posted the job)
const getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;
        // Check if job exists
        const job = await Job_1.default.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                error: 'Job not found'
            });
        }
        // Find employer profile for the user
        const employer = await Employer_1.default.findOne({ userId: req.user.id });
        if (!employer) {
            return res.status(404).json({
                success: false,
                error: 'Employer profile not found'
            });
        }
        // Make sure user is job owner
        if (job.employerId.toString() !== employer._id.toString()) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to view applications for this job'
            });
        }
        // Get applications
        const applications = await JobApplication_1.default.find({ jobId })
            .populate({
            path: 'jobSeekerId',
            select: 'title skills experience location photo bio hourlyRate availability',
            populate: {
                path: 'userId',
                select: 'name email'
            }
        })
            .sort('-createdAt');
        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Server Error'
        });
    }
};
exports.getJobApplications = getJobApplications;
// @desc    Get applications by job seeker
// @route   GET /api/applications
// @access  Private (Job Seeker)
const getMyApplications = async (req, res) => {
    try {
        // Find job seeker profile for the user
        const jobSeeker = await JobSeeker_1.default.findOne({ userId: req.user.id });
        if (!jobSeeker) {
            return res.status(404).json({
                success: false,
                error: 'Job seeker profile not found'
            });
        }
        // Get applications
        const applications = await JobApplication_1.default.find({ jobSeekerId: jobSeeker._id })
            .populate({
            path: 'jobId',
            select: 'title description category budget paymentType location remote status createdAt',
            populate: {
                path: 'employerId',
                select: 'companyName logo'
            }
        })
            .sort('-createdAt');
        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Server Error'
        });
    }
};
exports.getMyApplications = getMyApplications;
// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private (Employer who posted the job)
const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status || !['pending', 'reviewing', 'accepted', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a valid status'
            });
        }
        // Find application
        const application = await JobApplication_1.default.findById(req.params.id);
        if (!application) {
            return res.status(404).json({
                success: false,
                error: 'Application not found'
            });
        }
        // Get job
        const job = await Job_1.default.findById(application.jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                error: 'Job not found'
            });
        }
        // Find employer profile for the user
        const employer = await Employer_1.default.findOne({ userId: req.user.id });
        if (!employer) {
            return res.status(404).json({
                success: false,
                error: 'Employer profile not found'
            });
        }
        // Make sure user is job owner
        if (job.employerId.toString() !== employer._id.toString()) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to update this application'
            });
        }
        // Update application
        application.status = status;
        await application.save();
        res.status(200).json({
            success: true,
            data: application
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Server Error'
        });
    }
};
exports.updateApplicationStatus = updateApplicationStatus;
