const express = require('express');
const { getJobs, getJob, createJob, updateJob, deleteJob } = require('../controllers/jobs');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validator');
const { createJobValidation, updateJobValidation } = require('../validations/jobs');

// Include job application router
const applicationRouter = require('./applications');

const router = express.Router();

// Re-route into other resource routers
router.use('/:jobId/applications', applicationRouter);

router.route('/')
  .get(getJobs)
  .post(protect, authorize('employer'), validate(createJobValidation), createJob);

router.route('/:id')
  .get(getJob)
  .put(protect, authorize('employer'), validate(updateJobValidation), updateJob)
  .delete(protect, authorize('employer'), deleteJob);

module.exports = router;
