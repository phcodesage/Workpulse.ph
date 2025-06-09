const Job = require('../models/Job');
const Employer = require('../models/Employer');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
  try {
    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'search', 'skills'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // Parse the query string back to an object
    let queryObj = JSON.parse(queryStr);
    
    // Handle search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      queryObj = {
        ...queryObj,
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { category: searchRegex },
          { location: searchRegex }
        ]
      };
    }
    
    // Handle skills filtering
    if (req.query.skills) {
      const skillsArray = req.query.skills.split(',');
      queryObj.skills = { $in: skillsArray };
    }
    
    // Finding resource
    let query = Job.find(queryObj).populate({
      path: 'employer',
      select: 'companyName location logo'
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
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Job.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const jobs = await query;

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
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate({
        path: 'employer',
        select: 'companyName industry location website description logo'
      })
      .populate({
        path: 'applications',
        populate: {
          path: 'jobSeeker',
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
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private/Employer
exports.createJob = async (req, res) => {
  try {
    // Find employer profile for the current user
    const employer = await Employer.findOne({ user: req.user.id });

    if (!employer) {
      return res.status(404).json({
        success: false,
        error: 'Employer profile not found. Please create a profile first.'
      });
    }

    // Add employer to req.body
    req.body.employer = employer._id;

    const job = await Job.create(req.body);

    res.status(201).json({
      success: true,
      data: job
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private/Employer
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    // Find employer profile for the current user
    const employer = await Employer.findOne({ user: req.user.id });

    // Make sure user is job owner
    if (job.employer.toString() !== employer._id.toString()) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this job'
      });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private/Employer
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    // Find employer profile for the current user
    const employer = await Employer.findOne({ user: req.user.id });

    // Make sure user is job owner
    if (job.employer.toString() !== employer._id.toString()) {
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
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};
