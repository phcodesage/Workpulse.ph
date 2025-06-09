"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWorkHistory = exports.addWorkHistory = exports.deleteEducation = exports.addEducation = exports.getJobSeekerProfile = exports.getEmployerProfile = exports.createJobSeekerProfile = exports.createEmployerProfile = exports.getMyProfile = void 0;
const Employer_1 = __importDefault(require("../models/Employer"));
const JobSeeker_1 = __importDefault(require("../models/JobSeeker"));
// @desc    Get current user's profile (employer or job seeker)
// @route   GET /api/profile
// @access  Private
const getMyProfile = async (req, res) => {
    try {
        let profile;
        if (req.user.role === 'employer') {
            profile = await Employer_1.default.findOne({ userId: req.user.id });
        }
        else if (req.user.role === 'jobseeker') {
            profile = await JobSeeker_1.default.findOne({ userId: req.user.id });
        }
        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Profile not found'
            });
        }
        res.status(200).json({
            success: true,
            data: profile
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Server Error'
        });
    }
};
exports.getMyProfile = getMyProfile;
// @desc    Create or update employer profile
// @route   POST /api/profile/employer
// @access  Private (Employers only)
const createEmployerProfile = async (req, res) => {
    try {
        // Check if profile already exists
        let profile = await Employer_1.default.findOne({ userId: req.user.id });
        if (profile) {
            // Update
            profile = await Employer_1.default.findOneAndUpdate({ userId: req.user.id }, req.body, { new: true, runValidators: true });
        }
        else {
            // Create
            req.body.userId = req.user.id;
            profile = await Employer_1.default.create(req.body);
        }
        res.status(200).json({
            success: true,
            data: profile
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Server Error'
        });
    }
};
exports.createEmployerProfile = createEmployerProfile;
// @desc    Create or update job seeker profile
// @route   POST /api/profile/jobseeker
// @access  Private (Job Seekers only)
const createJobSeekerProfile = async (req, res) => {
    try {
        // Check if profile already exists
        let profile = await JobSeeker_1.default.findOne({ userId: req.user.id });
        if (profile) {
            // Update
            profile = await JobSeeker_1.default.findOneAndUpdate({ userId: req.user.id }, req.body, { new: true, runValidators: true });
        }
        else {
            // Create
            req.body.userId = req.user.id;
            profile = await JobSeeker_1.default.create(req.body);
        }
        res.status(200).json({
            success: true,
            data: profile
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Server Error'
        });
    }
};
exports.createJobSeekerProfile = createJobSeekerProfile;
// @desc    Get employer profile by ID
// @route   GET /api/profile/employer/:id
// @access  Public
const getEmployerProfile = async (req, res) => {
    try {
        const profile = await Employer_1.default.findById(req.params.id).populate({
            path: 'userId',
            select: 'name email'
        });
        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Employer profile not found'
            });
        }
        res.status(200).json({
            success: true,
            data: profile
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Server Error'
        });
    }
};
exports.getEmployerProfile = getEmployerProfile;
// @desc    Get job seeker profile by ID
// @route   GET /api/profile/jobseeker/:id
// @access  Public
const getJobSeekerProfile = async (req, res) => {
    try {
        const profile = await JobSeeker_1.default.findById(req.params.id).populate({
            path: 'userId',
            select: 'name email'
        });
        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Job seeker profile not found'
            });
        }
        res.status(200).json({
            success: true,
            data: profile
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Server Error'
        });
    }
};
exports.getJobSeekerProfile = getJobSeekerProfile;
// @desc    Add education to job seeker profile
// @route   PUT /api/profile/jobseeker/education
// @access  Private (Job Seekers only)
const addEducation = async (req, res) => {
    try {
        const profile = await JobSeeker_1.default.findOne({ userId: req.user.id });
        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Job seeker profile not found'
            });
        }
        profile.education.unshift(req.body);
        await profile.save();
        res.status(200).json({
            success: true,
            data: profile
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Server Error'
        });
    }
};
exports.addEducation = addEducation;
// @desc    Delete education from job seeker profile
// @route   DELETE /api/profile/jobseeker/education/:eduId
// @access  Private (Job Seekers only)
const deleteEducation = async (req, res) => {
    try {
        const profile = await JobSeeker_1.default.findOne({ userId: req.user.id });
        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Job seeker profile not found'
            });
        }
        // Get remove index
        const removeIndex = profile.education
            .map(item => item._id.toString())
            .indexOf(req.params.eduId);
        if (removeIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Education not found'
            });
        }
        profile.education.splice(removeIndex, 1);
        await profile.save();
        res.status(200).json({
            success: true,
            data: profile
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Server Error'
        });
    }
};
exports.deleteEducation = deleteEducation;
// @desc    Add work history to job seeker profile
// @route   PUT /api/profile/jobseeker/work
// @access  Private (Job Seekers only)
const addWorkHistory = async (req, res) => {
    try {
        const profile = await JobSeeker_1.default.findOne({ userId: req.user.id });
        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Job seeker profile not found'
            });
        }
        profile.workHistory.unshift(req.body);
        await profile.save();
        res.status(200).json({
            success: true,
            data: profile
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Server Error'
        });
    }
};
exports.addWorkHistory = addWorkHistory;
// @desc    Delete work history from job seeker profile
// @route   DELETE /api/profile/jobseeker/work/:workId
// @access  Private (Job Seekers only)
const deleteWorkHistory = async (req, res) => {
    try {
        const profile = await JobSeeker_1.default.findOne({ userId: req.user.id });
        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Job seeker profile not found'
            });
        }
        // Get remove index
        const removeIndex = profile.workHistory
            .map(item => item._id.toString())
            .indexOf(req.params.workId);
        if (removeIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Work history not found'
            });
        }
        profile.workHistory.splice(removeIndex, 1);
        await profile.save();
        res.status(200).json({
            success: true,
            data: profile
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Server Error'
        });
    }
};
exports.deleteWorkHistory = deleteWorkHistory;
