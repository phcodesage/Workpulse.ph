const express = require('express');
const {
  search,
  searchBySkills
} = require('../controllers/search');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public search routes
router.get('/', search);
router.get('/skills', searchBySkills);

module.exports = router;
