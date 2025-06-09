const express = require('express');
const {
  getMyProfile,
  createEmployerProfile,
  createJobSeekerProfile,
  getEmployers,
  getJobSeekers,
  getEmployer,
  getJobSeeker
} = require('../controllers/profiles');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validator');
const { employerProfileValidation, jobSeekerProfileValidation } = require('../validations/profiles');

const router = express.Router();

router.get('/me', protect, getMyProfile);
router.post('/employer', protect, authorize('employer'), validate(employerProfileValidation), createEmployerProfile);
router.post('/jobseeker', protect, authorize('jobseeker'), validate(jobSeekerProfileValidation), createJobSeekerProfile);
router.get('/employers', getEmployers);
router.get('/jobseekers', getJobSeekers);
router.get('/employers/:id', getEmployer);
router.get('/jobseekers/:id', getJobSeeker);

module.exports = router;
