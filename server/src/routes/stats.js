const express = require('express');
const {
  getPlatformStats,
  getEmployerStats,
  getJobSeekerStats
} = require('../controllers/stats');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public route for platform stats
router.get('/', getPlatformStats);

// Protected routes for role-specific stats
router.get('/employer', protect, authorize('employer'), getEmployerStats);
router.get('/jobseeker', protect, authorize('jobseeker'), getJobSeekerStats);

module.exports = router;
