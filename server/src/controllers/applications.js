const JobApplication = require('../models/JobApplication');
const Job = require('../models/Job');
const JobSeeker = require('../models/JobSeeker');
const User = require('../models/User');
const { createNotification } = require('./notifications');

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private
exports.getApplications = async (req, res) => {
  try {
    let applications;
    
    // If user is job seeker, get their applications
    if (req.user.role === 'jobseeker') {
      const jobSeeker = await JobSeeker.findOne({ user: req.user.id });
      
      if (!jobSeeker) {
        return res.status(404).json({
          success: false,
          error: 'Job seeker profile not found'
        });
      }
      
      applications = await JobApplication.find({ jobSeeker: jobSeeker._id })
        .populate({
          path: 'job',
          select: 'title company location status',
          populate: {
            path: 'employer',
            select: 'companyName logo'
          }
        });
    } 
    // If user is employer, get applications for their jobs
    else if (req.user.role === 'employer') {
      applications = await JobApplication.find()
        .populate({
          path: 'job',
          match: { employer: req.query.employer }
        })
        .populate({
          path: 'jobSeeker',
          select: 'title skills experience location photo',
          populate: {
            path: 'user',
            select: 'name email'
          }
        });
      
      // Filter out applications where job is null (not owned by this employer)
      applications = applications.filter(app => app.job !== null);
    }

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
exports.getApplication = async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id)
      .populate({
        path: 'job',
        select: 'title description location status',
        populate: {
          path: 'employer',
          select: 'companyName logo'
        }
      })
      .populate({
        path: 'jobSeeker',
        select: 'title skills experience location photo',
        populate: {
          path: 'user',
          select: 'name email'
        }
      });

    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    // Check if user is authorized to view this application
    if (req.user.role === 'jobseeker') {
      const jobSeeker = await JobSeeker.findOne({ user: req.user.id });
      
      if (application.jobSeeker._id.toString() !== jobSeeker._id.toString()) {
        return res.status(401).json({
          success: false,
          error: 'Not authorized to view this application'
        });
      }
    } else if (req.user.role === 'employer') {
      if (application.job.employer.user.toString() !== req.user.id) {
        return res.status(401).json({
          success: false,
          error: 'Not authorized to view this application'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Create new application
// @route   POST /api/jobs/:jobId/applications
// @access  Private/JobSeeker
exports.createApplication = async (req, res) => {
  try {
    // Add job to req.body
    req.body.job = req.params.jobId;
    
    // Check if job exists
    const job = await Job.findById(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }
    
    // Check if job is open
    if (job.status !== 'open') {
      return res.status(400).json({
        success: false,
        error: 'This job is not accepting applications'
      });
    }
    
    // Get job seeker profile
    const jobSeeker = await JobSeeker.findOne({ user: req.user.id });
    
    if (!jobSeeker) {
      return res.status(404).json({
        success: false,
        error: 'Job seeker profile not found. Please create a profile first.'
      });
    }
    
    // Add job seeker to req.body
    req.body.jobSeeker = jobSeeker._id;
    
    // Check if already applied
    const alreadyApplied = await JobApplication.findOne({
      job: req.params.jobId,
      jobSeeker: jobSeeker._id
    });
    
    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        error: 'You have already applied to this job'
      });
    }
    
    const application = await JobApplication.create(req.body);
    
    // Create notification for employer about new application
    const populatedJob = await Job.findById(req.params.jobId).populate({
      path: 'employer',
      populate: { path: 'user' }
    });
    
    if (populatedJob && populatedJob.employer && populatedJob.employer.user) {
      await createNotification({
        user: populatedJob.employer.user._id,
        type: 'application',
        title: `New application for ${populatedJob.title}`,
        message: `${jobSeeker.user.name} has applied for your job listing.`,
        relatedId: application._id,
        relatedModel: 'JobApplication'
      });
    }
    
    res.status(201).json({
      success: true,
      data: application
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private/Employer
exports.updateApplication = async (req, res) => {
  try {
    let application = await JobApplication.findById(req.params.id).populate({
      path: 'job',
      populate: {
        path: 'employer'
      }
    });
    
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }
    
    // Check if user is the employer who posted the job
    if (application.job.employer.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this application'
      });
    }
    
    // Only allow status updates
    if (Object.keys(req.body).length > 1 || !req.body.status) {
      return res.status(400).json({
        success: false,
        error: 'Only status updates are allowed'
      });
    }
    
    application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    )
    .populate({
      path: 'jobSeeker',
      populate: { path: 'user' }
    })
    .populate({
      path: 'job',
      select: 'title'
    });
    
    // Create notification for job seeker about status change
    if (application.jobSeeker && application.jobSeeker.user) {
      const statusMessages = {
        pending: 'Your application is pending review.',
        reviewing: 'Your application is now being reviewed.',
        accepted: 'Congratulations! Your application has been accepted.',
        rejected: 'We regret to inform you that your application was not selected.'
      };
      
      await createNotification({
        user: application.jobSeeker.user._id,
        type: 'application',
        title: `Application ${req.body.status}: ${application.job.title}`,
        message: statusMessages[req.body.status] || `Your application status has been updated to ${req.body.status}.`,
        relatedId: application._id,
        relatedModel: 'JobApplication'
      });
    }
    
    res.status(200).json({
      success: true,
      data: application
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};
