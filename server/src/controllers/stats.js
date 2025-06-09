const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');
const User = require('../models/User');
const Employer = require('../models/Employer');
const JobSeeker = require('../models/JobSeeker');

/**
 * @desc    Get platform statistics
 * @route   GET /api/stats
 * @access  Public
 */
exports.getPlatformStats = async (req, res) => {
  try {
    const stats = {
      users: {
        total: await User.countDocuments(),
        employers: await User.countDocuments({ role: 'employer' }),
        jobSeekers: await User.countDocuments({ role: 'jobseeker' })
      },
      jobs: {
        total: await Job.countDocuments(),
        open: await Job.countDocuments({ status: 'open' }),
        closed: await Job.countDocuments({ status: 'closed' })
      },
      applications: {
        total: await JobApplication.countDocuments(),
        pending: await JobApplication.countDocuments({ status: 'pending' }),
        reviewing: await JobApplication.countDocuments({ status: 'reviewing' }),
        accepted: await JobApplication.countDocuments({ status: 'accepted' }),
        rejected: await JobApplication.countDocuments({ status: 'rejected' })
      },
      topCategories: await getTopJobCategories(),
      topLocations: await getTopJobLocations()
    };
    
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

/**
 * @desc    Get employer statistics
 * @route   GET /api/stats/employer
 * @access  Private/Employer
 */
exports.getEmployerStats = async (req, res) => {
  try {
    const employer = await Employer.findOne({ user: req.user.id });
    
    if (!employer) {
      return res.status(404).json({
        success: false,
        error: 'Employer profile not found'
      });
    }
    
    // Get employer's jobs
    const jobs = await Job.find({ employer: employer._id });
    const jobIds = jobs.map(job => job._id);
    
    // Get applications for employer's jobs
    const applications = await JobApplication.find({
      job: { $in: jobIds }
    });
    
    const stats = {
      jobs: {
        total: jobs.length,
        open: jobs.filter(job => job.status === 'open').length,
        closed: jobs.filter(job => job.status === 'closed').length
      },
      applications: {
        total: applications.length,
        pending: applications.filter(app => app.status === 'pending').length,
        reviewing: applications.filter(app => app.status === 'reviewing').length,
        accepted: applications.filter(app => app.status === 'accepted').length,
        rejected: applications.filter(app => app.status === 'rejected').length
      },
      applicationRate: jobs.length > 0 ? applications.length / jobs.length : 0,
      applicationsOverTime: await getApplicationsOverTime(jobIds),
      topJobs: await getTopJobs(jobIds)
    };
    
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

/**
 * @desc    Get job seeker statistics
 * @route   GET /api/stats/jobseeker
 * @access  Private/JobSeeker
 */
exports.getJobSeekerStats = async (req, res) => {
  try {
    const jobSeeker = await JobSeeker.findOne({ user: req.user.id });
    
    if (!jobSeeker) {
      return res.status(404).json({
        success: false,
        error: 'Job seeker profile not found'
      });
    }
    
    // Get job seeker's applications
    const applications = await JobApplication.find({ jobSeeker: jobSeeker._id });
    
    const stats = {
      applications: {
        total: applications.length,
        pending: applications.filter(app => app.status === 'pending').length,
        reviewing: applications.filter(app => app.status === 'reviewing').length,
        accepted: applications.filter(app => app.status === 'accepted').length,
        rejected: applications.filter(app => app.status === 'rejected').length
      },
      successRate: applications.length > 0 
        ? applications.filter(app => app.status === 'accepted').length / applications.length 
        : 0,
      applicationsOverTime: await getJobSeekerApplicationsOverTime(jobSeeker._id),
      matchingJobs: await getMatchingJobs(jobSeeker)
    };
    
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

// Helper functions

/**
 * Get top job categories
 */
const getTopJobCategories = async () => {
  const categories = await Job.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);
  
  return categories.map(category => ({
    name: category._id,
    count: category.count
  }));
};

/**
 * Get top job locations
 */
const getTopJobLocations = async () => {
  const locations = await Job.aggregate([
    { $group: { _id: '$location', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);
  
  return locations.map(location => ({
    name: location._id,
    count: location.count
  }));
};

/**
 * Get applications over time for an employer
 */
const getApplicationsOverTime = async (jobIds) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const applications = await JobApplication.aggregate([
    { 
      $match: { 
        job: { $in: jobIds },
        createdAt: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: { 
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);
  
  // Format the result for frontend chart
  return applications.map(item => ({
    month: `${item._id.year}-${item._id.month}`,
    count: item.count
  }));
};

/**
 * Get top jobs based on application count
 */
const getTopJobs = async (jobIds) => {
  const topJobs = await JobApplication.aggregate([
    { $match: { job: { $in: jobIds } } },
    { $group: { _id: '$job', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);
  
  // Get job details for each top job
  const jobDetails = await Promise.all(
    topJobs.map(async (job) => {
      const jobData = await Job.findById(job._id).select('title location');
      return {
        id: job._id,
        title: jobData.title,
        location: jobData.location,
        applicationCount: job.count
      };
    })
  );
  
  return jobDetails;
};

/**
 * Get applications over time for a job seeker
 */
const getJobSeekerApplicationsOverTime = async (jobSeekerId) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const applications = await JobApplication.aggregate([
    { 
      $match: { 
        jobSeeker: jobSeekerId,
        createdAt: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: { 
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);
  
  // Format the result for frontend chart
  return applications.map(item => ({
    month: `${item._id.year}-${item._id.month}`,
    count: item.count
  }));
};

/**
 * Get matching jobs for a job seeker based on skills
 */
const getMatchingJobs = async (jobSeeker) => {
  // Find jobs that match job seeker's skills
  const matchingJobs = await Job.find({
    status: 'open',
    skills: { $in: jobSeeker.skills }
  })
    .sort('-createdAt')
    .limit(5)
    .select('title company location skills')
    .populate({
      path: 'employer',
      select: 'companyName'
    });
  
  return matchingJobs.map(job => ({
    id: job._id,
    title: job.title,
    company: job.employer ? job.employer.companyName : job.company,
    location: job.location,
    matchingSkills: job.skills.filter(skill => 
      jobSeeker.skills.includes(skill)
    )
  }));
};
