"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJob = exports.updateJob = exports.createJob = exports.getJob = exports.getJobs = void 0;
const Job_1 = __importDefault(require("../models/Job"));
const Employer_1 = __importDefault(require("../models/Employer"));
// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
    try {
        // Copy req.query
        const reqQuery = { ...req.query };
        // Fields to exclude
        const removeFields = ['select', 'sort', 'page', 'limit'];
        // Loop over removeFields and delete them from reqQuery
        removeFields.forEach(param => delete reqQuery[param]);
        // Create query string
        let queryStr = JSON.stringify(reqQuery);
        // Create operators ($gt, $gte, etc)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        // Finding resource
        let query = Job_1.default.find(JSON.parse(queryStr)).populate({
            path: 'employerId',
            select: 'companyName logo'
        });
        // Select Fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }
        // Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }
        else {
            query = query.sort('-createdAt');
        }
        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Job_1.default.countDocuments(JSON.parse(queryStr));
        query = query.skip(startIndex).limit(limit);
        // Executing query
        const jobs = await query.populate({
            path: 'applications',
            select: 'status createdAt'
        });
        // Pagination result
        const pagination = {};
        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            };
        }
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            };
        }
        res.status(200).json({
            success: true,
            count: jobs.length,
            pagination,
            data: jobs
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Server Error'
        });
    }
};
exports.getJobs = getJobs;
// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJob = async (req, res) => {
    try {
        const job = await Job_1.default.findById(req.params.id)
            .populate({
            path: 'employerId',
            select: 'companyName industry location website logo description'
        })
            .populate({
            path: 'applications',
            populate: {
                path: 'jobSeekerId',
                select: 'title skills experience location photo'
            }
        });
        if (!job) {
            return res.status(404).json({
                success: false,
                error: 'Job not found'
            });
        }
        res.status(200).json({
            success: true,
            data: job
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Server Error'
        });
    }
};
exports.getJob = getJob;
// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Employers only)
const createJob = async (req, res) => {
    try {
        // Find employer profile for the user
        const employer = await Employer_1.default.findOne({ userId: req.user.id });
        if (!employer) {
            return res.status(404).json({
                success: false,
                error: 'Employer profile not found. Please create a profile first.'
            });
        }
        // Add employer to req.body
        req.body.employerId = employer._id;
        const job = await Job_1.default.create(req.body);
        res.status(201).json({
            success: true,
            data: job
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Server Error'
        });
    }
};
exports.createJob = createJob;
// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Employer who created the job)
const updateJob = async (req, res) => {
    try {
        let job = await Job_1.default.findById(req.params.id);
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
                error: 'Not authorized to update this job'
            });
        }
        job = await Job_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            success: true,
            data: job
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Server Error'
        });
    }
};
exports.updateJob = updateJob;
// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Employer who created the job)
const deleteJob = async (req, res) => {
    try {
        const job = await Job_1.default.findById(req.params.id);
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
                error: 'Not authorized to delete this job'
            });
        }
        await job.deleteOne();
        res.status(200).json({
            success: true,
            data: {}
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Server Error'
        });
    }
};
exports.deleteJob = deleteJob;
