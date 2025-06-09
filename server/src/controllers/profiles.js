const Employer = require('../models/Employer');
const JobSeeker = require('../models/JobSeeker');
const User = require('../models/User');

// @desc    Get current user profile
// @route   GET /api/profiles/me
// @access  Private
exports.getMyProfile = async (req, res) => {
  try {
    let profile;
    
    if (req.user.role === 'employer') {
      profile = await Employer.findOne({ user: req.user.id }).populate('user', ['name', 'email']);
    } else if (req.user.role === 'jobseeker') {
      profile = await JobSeeker.findOne({ user: req.user.id }).populate('user', ['name', 'email']);
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
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Create or update employer profile
// @route   POST /api/profiles/employer
// @access  Private/Employer
exports.createEmployerProfile = async (req, res) => {
  try {
    // Check if user is an employer
    if (req.user.role !== 'employer') {
      return res.status(403).json({
        success: false,
        error: 'Only employers can create employer profiles'
      });
    }

    // Check if profile already exists
    let profile = await Employer.findOne({ user: req.user.id });

    if (profile) {
      // Update
      profile = await Employer.findOneAndUpdate(
        { user: req.user.id },
        req.body,
        { new: true, runValidators: true }
      );
    } else {
      // Create
      req.body.user = req.user.id;
      profile = await Employer.create(req.body);
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Create or update job seeker profile
// @route   POST /api/profiles/jobseeker
// @access  Private/JobSeeker
exports.createJobSeekerProfile = async (req, res) => {
  try {
    // Check if user is a job seeker
    if (req.user.role !== 'jobseeker') {
      return res.status(403).json({
        success: false,
        error: 'Only job seekers can create job seeker profiles'
      });
    }

    // Check if profile already exists
    let profile = await JobSeeker.findOne({ user: req.user.id });

    if (profile) {
      // Update
      profile = await JobSeeker.findOneAndUpdate(
        { user: req.user.id },
        req.body,
        { new: true, runValidators: true }
      );
    } else {
      // Create
      req.body.user = req.user.id;
      profile = await JobSeeker.create(req.body);
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get all employers
// @route   GET /api/profiles/employers
// @access  Public
exports.getEmployers = async (req, res) => {
  try {
    const employers = await Employer.find().populate('user', ['name', 'email']);

    res.status(200).json({
      success: true,
      count: employers.length,
      data: employers
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get all job seekers
// @route   GET /api/profiles/jobseekers
// @access  Public
exports.getJobSeekers = async (req, res) => {
  try {
    const jobSeekers = await JobSeeker.find().populate('user', ['name', 'email']);

    res.status(200).json({
      success: true,
      count: jobSeekers.length,
      data: jobSeekers
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get employer by ID
// @route   GET /api/profiles/employers/:id
// @access  Public
exports.getEmployer = async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id).populate('user', ['name', 'email']);

    if (!employer) {
      return res.status(404).json({
        success: false,
        error: 'Employer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: employer
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get job seeker by ID
// @route   GET /api/profiles/jobseekers/:id
// @access  Public
exports.getJobSeeker = async (req, res) => {
  try {
    const jobSeeker = await JobSeeker.findById(req.params.id).populate('user', ['name', 'email']);

    if (!jobSeeker) {
      return res.status(404).json({
        success: false,
        error: 'Job seeker not found'
      });
    }

    res.status(200).json({
      success: true,
      data: jobSeeker
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};
