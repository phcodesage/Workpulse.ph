const Job = require('../models/Job');
const Employer = require('../models/Employer');
const JobSeeker = require('../models/JobSeeker');
const User = require('../models/User');

/**
 * @desc    Search jobs, employers, and job seekers
 * @route   GET /api/search
 * @access  Public
 */
exports.search = async (req, res) => {
  try {
    const { query, type, limit = 10 } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a search query'
      });
    }
    
    const searchRegex = new RegExp(query, 'i');
    let results = [];
    
    // Search jobs
    if (!type || type === 'jobs') {
      const jobs = await Job.find({
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { company: searchRegex },
          { location: searchRegex },
          { category: searchRegex }
        ]
      })
      .limit(parseInt(limit))
      .populate({
        path: 'employer',
        select: 'companyName logo'
      });
      
      results.push({
        type: 'jobs',
        items: jobs.map(job => ({
          id: job._id,
          title: job.title,
          company: job.employer ? job.employer.companyName : job.company,
          location: job.location,
          salary: job.salary,
          status: job.status,
          createdAt: job.createdAt,
          logo: job.employer ? job.employer.logo : null
        }))
      });
    }
    
    // Search employers
    if (!type || type === 'employers') {
      const employers = await Employer.find({
        $or: [
          { companyName: searchRegex },
          { industry: searchRegex },
          { location: searchRegex },
          { description: searchRegex }
        ]
      })
      .limit(parseInt(limit))
      .populate({
        path: 'user',
        select: 'name email'
      });
      
      results.push({
        type: 'employers',
        items: employers.map(employer => ({
          id: employer._id,
          companyName: employer.companyName,
          industry: employer.industry,
          location: employer.location,
          logo: employer.logo,
          contactName: employer.user ? employer.user.name : null,
          contactEmail: employer.user ? employer.user.email : null
        }))
      });
    }
    
    // Search job seekers (only if user is authenticated and an employer)
    if ((!type || type === 'jobseekers') && req.user && req.user.role === 'employer') {
      const jobSeekers = await JobSeeker.find({
        $or: [
          { title: searchRegex },
          { skills: searchRegex },
          { experience: searchRegex },
          { education: searchRegex },
          { location: searchRegex }
        ]
      })
      .limit(parseInt(limit))
      .populate({
        path: 'user',
        select: 'name email'
      });
      
      results.push({
        type: 'jobseekers',
        items: jobSeekers.map(jobSeeker => ({
          id: jobSeeker._id,
          name: jobSeeker.user ? jobSeeker.user.name : null,
          title: jobSeeker.title,
          skills: jobSeeker.skills,
          location: jobSeeker.location,
          experience: jobSeeker.experience,
          photo: jobSeeker.photo
        }))
      });
    }
    
    res.status(200).json({
      success: true,
      data: results
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * @desc    Search jobs by skills
 * @route   GET /api/search/skills
 * @access  Public
 */
exports.searchBySkills = async (req, res) => {
  try {
    const { skills, limit = 10 } = req.query;
    
    if (!skills) {
      return res.status(400).json({
        success: false,
        error: 'Please provide skills to search for'
      });
    }
    
    const skillsArray = skills.split(',').map(skill => skill.trim());
    
    const jobs = await Job.find({
      skills: { $in: skillsArray },
      status: 'open'
    })
    .limit(parseInt(limit))
    .populate({
      path: 'employer',
      select: 'companyName logo'
    });
    
    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs.map(job => ({
        id: job._id,
        title: job.title,
        company: job.employer ? job.employer.companyName : job.company,
        location: job.location,
        matchingSkills: job.skills.filter(skill => skillsArray.includes(skill)),
        salary: job.salary,
        status: job.status,
        createdAt: job.createdAt,
        logo: job.employer ? job.employer.logo : null
      }))
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
