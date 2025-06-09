const express = require('express');
const {
  getApplications,
  getApplication,
  createApplication,
  updateApplication
} = require('../controllers/applications');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validator');
const { createApplicationValidation, updateApplicationStatusValidation } = require('../validations/applications');

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(protect, getApplications)
  .post(protect, authorize('jobseeker'), validate(createApplicationValidation), createApplication);

router.route('/:id')
  .get(protect, getApplication)
  .put(protect, authorize('employer'), validate(updateApplicationStatusValidation), updateApplication);

module.exports = router;
