const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');
const Employer = require('../models/Employer');
const JobSeeker = require('../models/JobSeeker');
const User = require('../models/User');

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/dashboard
 * @access  Private
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    // Common stats for all users
    const stats = {
      totalJobs: await Job.countDocuments({ status: 'open' }),
      recentJobs: await Job.find({ status: 'open' })
        .sort('-createdAt')
        .limit(5)
        .populate({
          path: 'employer',
          select: 'companyName logo'
        }),
      userCount: {
        employers: await User.countDocuments({ role: 'employer' }),
        jobSeekers: await User.countDocuments({ role: 'jobseeker' })
      }
    };
    
    // Role-specific stats
    if (userRole === 'employer') {
      const employer = await Employer.findOne({ user: userId });
      
      if (!employer) {
        return res.status(404).json({
          success: false,
          error: 'Employer profile not found'
        });
      }
      
      // Get employer's jobs
      const employerJobs = await Job.find({ employer: employer._id });
      const jobIds = employerJobs.map(job => job._id);
      
      // Get applications for employer's jobs
      const applications = await JobApplication.find({
        job: { $in: jobIds }
      });
      
      // Calculate application statistics
      const applicationStats = {
        total: applications.length,
        pending: applications.filter(app => app.status === 'pending').length,
        reviewing: applications.filter(app => app.status === 'reviewing').length,
        accepted: applications.filter(app => app.status === 'accepted').length,
        rejected: applications.filter(app => app.status === 'rejected').length
      };
      
      stats.employer = {
        jobCount: employerJobs.length,
        activeJobs: employerJobs.filter(job => job.status === 'open').length,
        applications: applicationStats,
        recentApplications: await JobApplication.find({ job: { $in: jobIds } })
          .sort('-createdAt')
          .limit(5)
          .populate({
            path: 'jobSeeker',
            select: 'title skills experience photo',
            populate: {
              path: 'user',
              select: 'name'
            }
          })
          .populate({
            path: 'job',
            select: 'title'
          })
      };
    } else if (userRole === 'jobseeker') {
      const jobSeeker = await JobSeeker.findOne({ user: userId });
      
      if (!jobSeeker) {
        return res.status(404).json({
          success: false,
          error: 'Job seeker profile not found'
        });
      }
      
      // Get job seeker's applications
      const applications = await JobApplication.find({ jobSeeker: jobSeeker._id })
        .populate({
          path: 'job',
          select: 'title employer status',
          populate: {
            path: 'employer',
            select: 'companyName logo'
          }
        });
      
      // Calculate application statistics
      const applicationStats = {
        total: applications.length,
        pending: applications.filter(app => app.status === 'pending').length,
        reviewing: applications.filter(app => app.status === 'reviewing').length,
        accepted: applications.filter(app => app.status === 'accepted').length,
        rejected: applications.filter(app => app.status === 'rejected').length
      };
      
      // Get recommended jobs based on skills
      const recommendedJobs = await Job.find({
        status: 'open',
        skills: { $in: jobSeeker.skills }
      })
        .sort('-createdAt')
        .limit(5)
        .populate({
          path: 'employer',
          select: 'companyName logo'
        });
      
      stats.jobSeeker = {
        applications: applicationStats,
        recommendedJobs,
        recentApplications: applications.slice(0, 5)
      };
    }
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
